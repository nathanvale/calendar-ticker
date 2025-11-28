"""
Calendar Ticker Backend
FastAPI server with WebSocket support for real-time calendar updates
"""
import asyncio
import json
import logging
from contextlib import asynccontextmanager
from datetime import datetime, timedelta
from pathlib import Path
from typing import Optional

import yaml
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware

from calendar_service import CalendarService, CalendarEvent

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)

# Global state
config: dict = {}
calendar_service: Optional[CalendarService] = None
connected_clients: set[WebSocket] = set()
cached_events: list[dict] = []
last_refresh: Optional[datetime] = None


def load_config() -> dict:
    """Load configuration from YAML file."""
    config_path = Path("/app/config.yaml")
    if not config_path.exists():
        config_path = Path("config.yaml")
    if not config_path.exists():
        config_path = Path("config.example.yaml")
    
    with open(config_path) as f:
        return yaml.safe_load(f)


def event_to_dict(event: CalendarEvent, config: dict) -> dict:
    """Convert CalendarEvent to dictionary for JSON serialisation."""
    # Get colour for this calendar
    colours = config.get("calendar_colours", {})
    colour = colours.get(event.calendar_id, config.get("default_colour", "#9e9e9e"))
    
    # Check if event is important
    important_keywords = config.get("filters", {}).get("important_keywords", [])
    is_important = any(
        kw.lower() in event.title.lower() 
        for kw in important_keywords
    )
    
    # Calculate relative time
    now = datetime.now(event.start.tzinfo) if event.start.tzinfo else datetime.now()
    time_until = event.start - now
    mins_until = int(time_until.total_seconds() / 60)
    
    # Format time string
    display_config = config.get("display", {})
    time_format = display_config.get("time_format", "12h")
    relative_threshold = display_config.get("relative_time_threshold_mins", 120)
    
    if 0 < mins_until <= relative_threshold:
        if mins_until < 60:
            time_str = f"in {mins_until} min{'s' if mins_until != 1 else ''}"
        else:
            hours = mins_until // 60
            time_str = f"in {hours} hour{'s' if hours != 1 else ''}"
    else:
        if time_format == "12h":
            time_str = event.start.strftime("%-I:%M %p").lower()
        else:
            time_str = event.start.strftime("%H:%M")
    
    return {
        "id": event.id,
        "title": event.title,
        "start": event.start.isoformat(),
        "end": event.end.isoformat() if event.end else None,
        "time_str": time_str,
        "mins_until": mins_until,
        "calendar_id": event.calendar_id,
        "calendar_name": event.calendar_name,
        "colour": colour,
        "is_all_day": event.is_all_day,
        "is_important": is_important,
        "location": event.location,
    }


async def refresh_events():
    """Fetch fresh events from Google Calendar."""
    global cached_events, last_refresh
    
    if not calendar_service:
        logger.warning("Calendar service not initialised")
        return
    
    try:
        filters = config.get("filters", {})
        hours_ahead = filters.get("hours_ahead", 24)
        
        events = await asyncio.to_thread(
            calendar_service.get_upcoming_events,
            hours_ahead=hours_ahead
        )
        
        # Apply filters
        filtered_events = []
        exclude_keywords = [kw.lower() for kw in filters.get("exclude_keywords", [])]
        include_all_day = filters.get("include_all_day", True)
        only_accepted = filters.get("only_accepted", True)
        
        for event in events:
            # Skip all-day events if configured
            if event.is_all_day and not include_all_day:
                continue
            
            # Skip events with excluded keywords
            if any(kw in event.title.lower() for kw in exclude_keywords):
                continue
            
            filtered_events.append(event)
        
        # Sort by start time
        filtered_events.sort(key=lambda e: e.start)
        
        # Convert to dicts
        cached_events = [event_to_dict(e, config) for e in filtered_events]
        last_refresh = datetime.now()
        
        logger.info(f"Refreshed {len(cached_events)} events")
        
        # Broadcast to all connected clients
        await broadcast_events()
        
    except Exception as e:
        logger.error(f"Error refreshing events: {e}")


async def broadcast_events():
    """Send current events to all connected WebSocket clients."""
    if not connected_clients:
        return
    
    message = json.dumps({
        "type": "events",
        "data": cached_events,
        "refreshed_at": last_refresh.isoformat() if last_refresh else None,
        "config": {
            "display": config.get("display", {}),
            "no_events_message": config.get("no_events_message", "No upcoming events"),
        }
    })
    
    disconnected = set()
    for client in connected_clients:
        try:
            await client.send_text(message)
        except Exception:
            disconnected.add(client)
    
    # Clean up disconnected clients
    connected_clients.difference_update(disconnected)


async def refresh_loop():
    """Background task to periodically refresh calendar events."""
    while True:
        await refresh_events()
        interval = config.get("refresh_interval", 300)
        await asyncio.sleep(interval)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan handler."""
    global config, calendar_service
    
    # Load config
    config = load_config()
    logger.info("Configuration loaded")
    
    # Initialise calendar service
    calendars = config.get("calendars", ["primary"])
    calendar_service = CalendarService(calendar_ids=calendars)
    logger.info(f"Calendar service initialised for calendars: {calendars}")
    
    # Start background refresh task
    refresh_task = asyncio.create_task(refresh_loop())
    logger.info("Background refresh task started")
    
    yield
    
    # Cleanup
    refresh_task.cancel()
    try:
        await refresh_task
    except asyncio.CancelledError:
        pass


# Create FastAPI app
app = FastAPI(
    title="Calendar Ticker",
    description="Real-time calendar event ticker for TV displays",
    version="1.0.0",
    lifespan=lifespan
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    """Health check endpoint."""
    return {
        "status": "ok",
        "events_count": len(cached_events),
        "last_refresh": last_refresh.isoformat() if last_refresh else None,
        "connected_clients": len(connected_clients),
    }


@app.get("/events")
async def get_events():
    """Get current cached events (REST endpoint)."""
    return {
        "events": cached_events,
        "refreshed_at": last_refresh.isoformat() if last_refresh else None,
    }


@app.post("/refresh")
async def trigger_refresh():
    """Manually trigger a calendar refresh."""
    await refresh_events()
    return {"status": "refreshed", "events_count": len(cached_events)}


@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    """WebSocket endpoint for real-time event updates."""
    await websocket.accept()
    connected_clients.add(websocket)
    logger.info(f"Client connected. Total clients: {len(connected_clients)}")
    
    try:
        # Send current events immediately
        await websocket.send_text(json.dumps({
            "type": "events",
            "data": cached_events,
            "refreshed_at": last_refresh.isoformat() if last_refresh else None,
            "config": {
                "display": config.get("display", {}),
                "no_events_message": config.get("no_events_message", "No upcoming events"),
            }
        }))
        
        # Keep connection alive and handle incoming messages
        while True:
            data = await websocket.receive_text()
            message = json.loads(data)
            
            if message.get("type") == "refresh":
                await refresh_events()
            elif message.get("type") == "ping":
                await websocket.send_text(json.dumps({"type": "pong"}))
                
    except WebSocketDisconnect:
        logger.info("Client disconnected")
    except Exception as e:
        logger.error(f"WebSocket error: {e}")
    finally:
        connected_clients.discard(websocket)
        logger.info(f"Client removed. Total clients: {len(connected_clients)}")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
