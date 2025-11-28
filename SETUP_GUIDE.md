# Calendar Ticker - Complete Setup Guide

This guide walks you through setting up the Calendar Ticker from scratch, including Google OAuth configuration. Save this if you ever need to recreate the setup.

## Table of Contents

1. [Google Cloud Setup](#google-cloud-setup)
2. [Local Project Setup](#local-project-setup)
3. [Authentication & Testing](#authentication--testing)
4. [Docker Deployment](#docker-deployment)
5. [Troubleshooting](#troubleshooting)

---

## Google Cloud Setup

### Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click the **project dropdown** (top-left, next to "Google Cloud")
3. Click **"New Project"**
4. Fill in:
   - **Project name**: `calendar-ticker`
   - **Organization**: (leave blank if personal)
5. Click **"Create"**
6. Wait for the project to be created (this may take a minute)
7. Make sure you're in the new project by checking the dropdown at the top-left

### Step 2: Enable Google Calendar API

1. In Google Cloud Console, go to **APIs & Services** → **Library** (left sidebar)
2. Search for `"Google Calendar API"`
3. Click on **Google Calendar API**
4. Click the blue **"Enable"** button
5. Wait for it to finish enabling

### Step 3: Configure OAuth Consent Screen

1. Go to **APIs & Services** → **OAuth consent screen** (left sidebar)
2. Select **"External"** and click **"Create"**

#### Screen 1: App Information
3. Fill in the form:
   - **App name**: `Calendar Ticker`
   - **User support email**: Your email address
   - **Developer contact information**: Your email address
4. Click **"Save and Continue"**

#### Screen 2: Scopes
5. Click **"Add or Remove Scopes"**
6. In the search box, search for: `calendar.readonly`
7. Check the box for: `https://www.googleapis.com/auth/calendar.readonly`
8. Click **"Update"**
9. Click **"Save and Continue"**

#### Screen 3: Test Users
10. Click **"Add users"**
11. Enter your Google account email address
12. Click **"Add"**
13. Click **"Save and Continue"**

#### Screen 4: Summary
14. Review the settings and click **"Back to Dashboard"** (or finish)

### Step 4: Create OAuth Credentials

1. Go to **APIs & Services** → **Credentials** (left sidebar)
2. Click **"+ Create Credentials"** (blue button, top)
3. Select **"OAuth client ID"**
4. You may be prompted to configure the OAuth consent screen first — if so, click **"Configure Consent Screen"** and repeat Step 3
5. Application type: Select **"Desktop app"**
6. Name: `Calendar Ticker Desktop`
7. Click **"Create"**
8. A dialog will appear with your credentials — click **"Download JSON"**
9. Save the file as `credentials.json`

---

## Local Project Setup

### Step 1: Clone the Repository

```bash
cd ~/code
git clone https://github.com/nathanvale/calendar-ticker.git
cd calendar-ticker
```

### Step 2: Add Credentials File

1. Take the `credentials.json` file you downloaded from Google Cloud
2. Copy it to the **root** of the calendar-ticker project:

```bash
cp ~/Downloads/credentials.json ~/code/calendar-ticker/credentials.json
```

Also copy it to the backend directory (for local testing):

```bash
cp ~/code/calendar-ticker/credentials.json ~/code/calendar-ticker/backend/credentials.json
```

### Step 3: Configure Your Calendars

1. Copy the example config:

```bash
cp ~/code/calendar-ticker/config.example.yaml ~/code/calendar-ticker/config.yaml
```

2. Edit `config.yaml` with your calendar details:

```bash
code ~/code/calendar-ticker/config.yaml
# or use: nano ~/code/calendar-ticker/config.yaml
```

3. Update the calendars section with your calendar IDs:

```yaml
# Your primary calendar is always "primary"
calendars:
  - primary
  # Add other calendars here by their email address
  # - work@gmail.com
  # - family@group.calendar.google.com

calendar_colours:
  primary: "#4285f4"  # Google blue
  # Add colours for other calendars

filters:
  hours_ahead: 24
  important_keywords:
    - "!"
    - "IMPORTANT"
  exclude_keywords: []
  include_all_day: true

display:
  scroll_speed: 60
  time_format: "12h"
  position: "bottom"
  font_size: 42
  show_clock: true
```

---

## Authentication & Testing

### First Run: Authenticate with Google

The first time you run the backend, it will prompt you to authenticate with Google. This is normal and required.

```bash
cd ~/code/calendar-ticker/backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python calendar_service.py
```

**What happens:**
1. A browser window will open automatically
2. You'll see a Google sign-in page
3. Sign in with your Google account
4. You'll be asked to give permission for "Calendar Ticker" to access your calendar
5. Click **"Allow"**
6. A success page will appear in the browser
7. In your terminal, you should see your available calendars listed

**The script creates `token.json`:** This file stores your authentication token. Keep it safe — it grants access to your calendar.

### Verify Setup

After successful authentication, your terminal should show something like:

```
Available calendars:
- primary (Nathan Vale)
- work@gmail.com (Work Calendar)
```

If you see this, your setup is complete! Now deactivate the virtual environment:

```bash
deactivate
```

---

## Docker Deployment

### Build and Run

Once you've tested locally, you can run everything with Docker:

```bash
cd ~/code/calendar-ticker
docker-compose up --build
```

**What this does:**
- Builds the backend (FastAPI) Docker image
- Builds the frontend (React) Docker image
- Starts both services
- Makes the ticker available at `http://localhost:8080`

### Run in Background

To keep it running in the background:

```bash
docker-compose up -d --build
```

To check logs:

```bash
docker-compose logs -f
```

To stop:

```bash
docker-compose down
```

### Deploy to iMac

To run on the iMac:

1. **Copy files to iMac:**

```bash
scp ~/code/calendar-ticker/credentials.json imac:~/code/calendar-ticker/
scp ~/code/calendar-ticker/token.json imac:~/code/calendar-ticker/backend/
scp ~/code/calendar-ticker/config.yaml imac:~/code/calendar-ticker/
```

2. **SSH into iMac and run:**

```bash
ssh imac
cd ~/code/calendar-ticker
docker-compose up -d --build
```

3. **Find iMac's IP address:**

```bash
ipconfig getifaddr en0
```

4. **On your TV or other device, navigate to:**

```
http://<imac-ip>:8080
```

### Auto-start on iMac Boot

Create a LaunchAgent plist file on the iMac:

```bash
# On iMac
nano ~/Library/LaunchAgents/com.calendar-ticker.plist
```

Paste this:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>com.calendar-ticker</string>
    <key>ProgramArguments</key>
    <array>
        <string>/usr/local/bin/docker-compose</string>
        <string>-f</string>
        <string>/Users/nathanvale/code/calendar-ticker/docker-compose.yml</string>
        <string>up</string>
        <string>-d</string>
    </array>
    <key>RunAtLoad</key>
    <true/>
    <key>KeepAlive</key>
    <true/>
    <key>WorkingDirectory</key>
    <string>/Users/nathanvale/code/calendar-ticker</string>
</dict>
</plist>
```

Load it:

```bash
launchctl load ~/Library/LaunchAgents/com.calendar-ticker.plist
```

---

## Troubleshooting

### "credentials.json not found"

**Problem:** The script can't find your credentials file.

**Solution:**
1. Make sure `credentials.json` is in `/code/calendar-ticker/backend/` (for local testing)
2. Make sure `credentials.json` is in `/code/calendar-ticker/` (for Docker)
3. Check the file exists:

```bash
ls -la ~/code/calendar-ticker/credentials.json
ls -la ~/code/calendar-ticker/backend/credentials.json
```

### "Token refresh failed"

**Problem:** Your authentication token has expired or is invalid.

**Solution:**
1. Delete the `token.json` file:

```bash
rm ~/code/calendar-ticker/backend/token.json
```

2. Run the authentication again:

```bash
cd ~/code/calendar-ticker/backend
python calendar_service.py
```

3. Follow the browser OAuth flow again

### "No events showing"

**Problem:** The ticker loads but no events appear.

**Check:**
1. Your calendar has events in the next 24 hours (or whatever `hours_ahead` is set to)
2. Your calendar IDs in `config.yaml` are correct
3. You're not filtering them out with `exclude_keywords`

**Debug:**
1. Run the backend and check the logs
2. Visit `http://localhost:8000/events` to see the raw event data

### "WebSocket connection failed"

**Problem:** The frontend can't connect to the backend.

**Solution:**
1. Make sure both services are running: `docker-compose ps`
2. Check backend logs: `docker-compose logs backend`
3. Ensure port 8000 is not blocked by firewall

### "Port already in use"

**Problem:** `docker-compose` says ports 8080 or 8000 are already in use.

**Solution:**
1. Stop existing services:

```bash
docker-compose down
# or kill the specific service:
lsof -i :8080  # Find what's using port 8080
kill -9 <PID>
```

2. Try again

---

## Key Files

- **`credentials.json`** - Your Google OAuth credentials (gitignored, never commit!)
- **`token.json`** - Your authentication token (gitignored, never commit!)
- **`config.yaml`** - Your calendar configuration (gitignored, never commit!)
- **`docker-compose.yml`** - Production Docker setup
- **`backend/calendar_service.py`** - Handles Google Calendar API
- **`backend/main.py`** - FastAPI server with WebSocket
- **`frontend/src/App.jsx`** - React ticker UI

---

## Security Notes

1. **Never commit credentials or tokens** - They're in `.gitignore` for a reason
2. **Keep `credentials.json` safe** - It grants full calendar access
3. **Rotate credentials periodically** - Regenerate them in Google Cloud Console if needed
4. **Use strong OAuth scopes** - This setup uses `calendar.readonly` only (read-only access)

---

## Next Steps

- Customize `config.yaml` with your calendar settings
- Adjust display settings (scroll speed, font size, colors)
- Deploy to iMac with auto-start
- Integrate with Home Assistant (future enhancement)

---

**Last Updated:** 2025-11-28
