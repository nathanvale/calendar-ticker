"""
Google Calendar Service
Handles authentication and fetching events from Google Calendar API
"""
import logging
from dataclasses import dataclass
from datetime import datetime, timedelta
from pathlib import Path
from typing import Optional
from zoneinfo import ZoneInfo

from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build

logger = logging.getLogger(__name__)

# OAuth scopes
SCOPES = ["https://www.googleapis.com/auth/calendar.readonly"]

# File paths
CREDENTIALS_FILE = Path("/app/credentials.json")
TOKEN_FILE = Path("/app/token.json")

# Fallback paths for local development
if not CREDENTIALS_FILE.exists():
    CREDENTIALS_FILE = Path("credentials.json")
if not TOKEN_FILE.exists():
    TOKEN_FILE = Path("token.json")


@dataclass
class CalendarEvent:
    """Represents a calendar event."""
    id: str
    title: str
    start: datetime
    end: Optional[datetime]
    calendar_id: str
    calendar_name: str
    is_all_day: bool
    location: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None


class CalendarService:
    """Service for interacting with Google Calendar API."""
    
    def __init__(self, calendar_ids: list[str] = None):
        """
        Initialise the calendar service.
        
        Args:
            calendar_ids: List of calendar IDs to fetch events from.
                         Use 'primary' for the main calendar.
        """
        self.calendar_ids = calendar_ids or ["primary"]
        self.credentials = self._get_credentials()
        self.service = build("calendar", "v3", credentials=self.credentials)
        self._calendar_names: dict[str, str] = {}
        self._load_calendar_names()
    
    def _get_credentials(self) -> Credentials:
        """Get or refresh OAuth credentials."""
        creds = None
        
        # Load existing token
        if TOKEN_FILE.exists():
            creds = Credentials.from_authorized_user_file(str(TOKEN_FILE), SCOPES)
        
        # Refresh or get new credentials
        if not creds or not creds.valid:
            if creds and creds.expired and creds.refresh_token:
                logger.info("Refreshing expired credentials")
                creds.refresh(Request())
            else:
                if not CREDENTIALS_FILE.exists():
                    raise FileNotFoundError(
                        f"credentials.json not found. Please download it from "
                        f"Google Cloud Console and place it at {CREDENTIALS_FILE}"
                    )
                logger.info("Starting OAuth flow for new credentials")
                flow = InstalledAppFlow.from_client_secrets_file(
                    str(CREDENTIALS_FILE), SCOPES
                )
                creds = flow.run_local_server(port=0)
            
            # Save credentials
            with open(TOKEN_FILE, "w") as f:
                f.write(creds.to_json())
            logger.info(f"Credentials saved to {TOKEN_FILE}")
        
        return creds
    
    def _load_calendar_names(self):
        """Load calendar names for all configured calendars."""
        try:
            calendar_list = self.service.calendarList().list().execute()
            for cal in calendar_list.get("items", []):
                self._calendar_names[cal["id"]] = cal.get("summary", cal["id"])
        except Exception as e:
            logger.error(f"Error loading calendar names: {e}")
    
    def _parse_event_datetime(self, event_data: dict, key: str) -> tuple[datetime, bool]:
        """
        Parse datetime from event data.
        
        Returns:
            Tuple of (datetime, is_all_day)
        """
        dt_data = event_data.get(key, {})
        
        # All-day event (has 'date' instead of 'dateTime')
        if "date" in dt_data:
            date_str = dt_data["date"]
            dt = datetime.strptime(date_str, "%Y-%m-%d")
            # Set to local timezone
            local_tz = ZoneInfo("Australia/Melbourne")
            dt = dt.replace(tzinfo=local_tz)
            return dt, True
        
        # Timed event
        if "dateTime" in dt_data:
            dt_str = dt_data["dateTime"]
            # Parse ISO format with timezone
            dt = datetime.fromisoformat(dt_str)
            return dt, False
        
        # Fallback
        return datetime.now(ZoneInfo("Australia/Melbourne")), False
    
    def get_upcoming_events(self, hours_ahead: int = 24) -> list[CalendarEvent]:
        """
        Fetch upcoming events from all configured calendars.
        
        Args:
            hours_ahead: How many hours ahead to look for events.
        
        Returns:
            List of CalendarEvent objects sorted by start time.
        """
        events = []
        now = datetime.now(ZoneInfo("Australia/Melbourne"))
        time_min = now.isoformat()
        time_max = (now + timedelta(hours=hours_ahead)).isoformat()
        
        for calendar_id in self.calendar_ids:
            try:
                logger.info(f"Fetching events from calendar: {calendar_id}")
                
                result = self.service.events().list(
                    calendarId=calendar_id,
                    timeMin=time_min,
                    timeMax=time_max,
                    singleEvents=True,
                    orderBy="startTime",
                    maxResults=50,
                ).execute()
                
                calendar_name = self._calendar_names.get(calendar_id, calendar_id)
                
                for item in result.get("items", []):
                    # Skip cancelled events
                    if item.get("status") == "cancelled":
                        continue
                    
                    start_dt, is_all_day = self._parse_event_datetime(item, "start")
                    end_dt, _ = self._parse_event_datetime(item, "end")
                    
                    event = CalendarEvent(
                        id=item["id"],
                        title=item.get("summary", "Untitled Event"),
                        start=start_dt,
                        end=end_dt,
                        calendar_id=calendar_id,
                        calendar_name=calendar_name,
                        is_all_day=is_all_day,
                        location=item.get("location"),
                        description=item.get("description"),
                        status=item.get("status"),
                    )
                    events.append(event)
                    
                logger.info(f"Found {len(result.get('items', []))} events in {calendar_name}")
                
            except Exception as e:
                logger.error(f"Error fetching calendar {calendar_id}: {e}")
        
        # Sort all events by start time
        events.sort(key=lambda e: e.start)
        
        return events
    
    def get_calendars(self) -> list[dict]:
        """Get list of available calendars."""
        try:
            calendar_list = self.service.calendarList().list().execute()
            return [
                {
                    "id": cal["id"],
                    "name": cal.get("summary", cal["id"]),
                    "primary": cal.get("primary", False),
                    "background_color": cal.get("backgroundColor"),
                }
                for cal in calendar_list.get("items", [])
            ]
        except Exception as e:
            logger.error(f"Error fetching calendar list: {e}")
            return []


if __name__ == "__main__":
    # Test the calendar service
    logging.basicConfig(level=logging.INFO)
    
    service = CalendarService(calendar_ids=["primary"])
    
    print("\nAvailable calendars:")
    for cal in service.get_calendars():
        marker = '(primary)' if cal['primary'] else ''
        print(f"  - {cal['name']} {marker}")
        print(f"    ID: {cal['id']}")
    
    print("\nUpcoming events (next 24 hours):")
    for event in service.get_upcoming_events(hours_ahead=24):
        print(f"  - {event.start.strftime('%H:%M')} - {event.title}")
