# Calendar Ticker

A beautiful, OLED-optimised news ticker displaying your Google Calendar events. Built with FastAPI and React, designed for big-screen displays.

![Ticker Preview](docs/preview.png)

## Features

- 📺 **News ticker style** - Smooth horizontal scrolling like CNN/Bloomberg
- 🎨 **Colour-coded calendars** - Each calendar gets its own accent colour
- 🌑 **OLED optimised** - Pure black background, no burn-in risk
- ⚡ **Live updates** - WebSocket connection for real-time event changes
- 🔧 **Configurable filters** - Show only important events, specific calendars, etc.
- 🖥️ **Designed for TV** - Montserrat font, readable from across the room

## Quick Start

### Prerequisites

- Docker & Docker Compose
- Google Cloud project with Calendar API enabled
- `credentials.json` from Google Cloud Console

### 1. Clone and configure

```bash
git clone <repo>
cd calendar-ticker
cp config.example.yaml config.yaml
# Edit config.yaml with your calendar settings
```

### 2. Add Google credentials

Place your `credentials.json` in the project root (see [Google Calendar Setup](#google-calendar-setup) below).

### 3. Run with Docker

```bash
docker-compose up --build
```

### 4. Open in browser

Navigate to `http://localhost:8080` on your TV or browser.

## Configuration

Edit `config.yaml` to customise:

```yaml
# Which calendars to display (leave empty for all)
calendars:
  - primary
  - work@gmail.com
  - family@group.calendar.google.com

# Calendar colours (hex codes)
calendar_colours:
  primary: "#4285f4"        # Google blue
  work@gmail.com: "#ea4335" # Red
  family: "#34a853"         # Green

# Event filtering
filters:
  # Only show events starting within this many hours
  hours_ahead: 24
  
  # Keywords that mark an event as "important" (shown with emphasis)
  important_keywords:
    - "!"
    - "IMPORTANT"
    - "urgent"
  
  # Exclude events with these keywords
  exclude_keywords:
    - "lunch"
    - "commute"
  
  # Include all-day events?
  include_all_day: false

# Display settings
display:
  # Scroll speed (pixels per second)
  scroll_speed: 50
  
  # Pause on each event (seconds, 0 for continuous scroll)
  pause_duration: 3
  
  # Time format (12h or 24h)
  time_format: "12h"
  
  # Show "in X mins" instead of absolute time for near events
  relative_time_threshold_mins: 60

# Update interval (seconds)
refresh_interval: 300
```

## Google Calendar Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (or select existing)
3. Enable the **Google Calendar API**
4. Go to **Credentials** → **Create Credentials** → **OAuth 2.0 Client ID**
5. Application type: **Desktop app**
6. Download the JSON and save as `credentials.json` in the project root
7. On first run, you'll be prompted to authorise access in your browser

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│  Docker Compose                                             │
│  ┌─────────────────────┐    ┌─────────────────────────────┐ │
│  │  backend            │    │  frontend                   │ │
│  │  (FastAPI)          │◄──►│  (React + Nginx)            │ │
│  │  - Calendar API     │ WS │  - Ticker UI                │ │
│  │  - WebSocket server │    │  - Montserrat font          │ │
│  │  :8000              │    │  :80 → exposed :8080        │ │
│  └─────────────────────┘    └─────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                               │
                               ▼
                        ┌──────────────┐
                        │  LG TV       │
                        │  Browser     │
                        └──────────────┘
```

## Development

### Run backend locally

```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

### Run frontend locally

```bash
cd frontend
npm install
npm run dev
```

## Deployment to iMac/Server

```bash
# On your server
docker-compose up -d

# Auto-start on boot (macOS)
# Create a LaunchAgent plist or use Docker Desktop's auto-start
```

## License

MIT
