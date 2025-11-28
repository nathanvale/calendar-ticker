# Calendar Ticker

OLED-optimised news ticker displaying Google Calendar events on big-screen displays.

## Quick Links

- Setup from scratch: @./SETUP_GUIDE.md
- Configuration reference: @./config.example.yaml
- README: @./README.md

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│  Docker Compose                                             │
│  ┌─────────────────────┐    ┌─────────────────────────────┐ │
│  │  backend            │    │  frontend                   │ │
│  │  (FastAPI)          │◄──►│  (React + Vite)             │ │
│  │  - Calendar API     │ WS │  - Ticker UI                │ │
│  │  - WebSocket server │    │  - Real-time updates        │ │
│  │  :8000              │    │  :5173 → :8080 (prod)       │ │
│  └─────────────────────┘    └─────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

**Data Flow:** Google Calendar API → Backend (cached, filtered) → WebSocket → Frontend ticker

## Directory Structure

```
calendar-ticker/
├── backend/                 # Python FastAPI backend
│   ├── main.py             # FastAPI app, WebSocket, refresh loop
│   ├── calendar_service.py # Google Calendar API integration
│   ├── requirements.txt    # Python dependencies
│   └── Dockerfile
├── frontend/               # React TypeScript frontend (Bun workspace)
│   ├── src/
│   │   ├── App.jsx        # Main ticker component, WebSocket client
│   │   ├── App.css        # OLED-optimized styles (pure black)
│   │   ├── main.jsx       # React entry point
│   │   └── app.test.tsx   # Bun test placeholder
│   ├── vite.config.js     # Vite config with proxy to backend
│   ├── package.json       # Frontend workspace
│   ├── tsconfig.json      # Extends root TS config
│   ├── Dockerfile         # Frontend container (Nginx)
│   └── nginx.conf         # Nginx reverse proxy
├── .husky/                # Git hooks (commitlint, pre-commit CI)
├── package.json           # Root workspace config
├── tsconfig.json          # TypeScript base (strict mode)
├── biome.json             # Biome linter/formatter
├── commitlint.config.js   # Conventional commits
├── config.example.yaml    # Configuration template
├── docker-compose.yml     # Production deployment
└── SETUP_GUIDE.md         # Complete setup instructions
```

## Commands

```bash
# Development
bun install              # Install dependencies
bun run dev              # Start frontend (Vite :5173)
docker-compose -f docker-compose.dev.yml up  # Full stack

# Build & Test
bun run build            # Build frontend (Vite → dist/)
bun run test             # Run Bun tests
bun run typecheck        # TypeScript check
bun run check            # Biome lint + format (--write)
bun run ci               # Full CI: typecheck + lint + test + build

# Production
docker-compose up --build -d   # Start
docker-compose logs -f         # Logs
docker-compose down            # Stop
```

## Code Conventions

### TypeScript (Frontend)
- **Strict mode** enabled
- **Biome**: Tabs, double quotes, semicolons
- **React**: Functional components, hooks only
- **File naming**: `kebab-case.jsx/tsx`

### Python (Backend)
- **Python 3.11+**, FastAPI with async/await
- **Type hints**: `-> dict`, `list[CalendarEvent]`
- **Dataclasses** for models
- **Timezone**: Australia/Melbourne (hardcoded in `calendar_service.py:145`)

### Git
- **Conventional Commits** enforced: `type(scope): subject`
- **Types**: feat, fix, docs, style, refactor, perf, test, build, ci, chore
- **Hooks**: commit-msg (commitlint), pre-commit (full CI)

## Key Files

| File | Purpose |
|------|---------|
| `backend/main.py` | FastAPI app, WebSocket endpoint, background refresh |
| `backend/calendar_service.py` | Google Calendar API, OAuth flow |
| `frontend/src/App.jsx` | Ticker component, WebSocket client, animation |
| `frontend/src/App.css` | OLED styles (pure black #000) |
| `config.yaml` | User config (copy from example, not in git) |

## Security

**NEVER commit** (already in `.gitignore`):
- `credentials.json` — Google OAuth credentials
- `token.json` — Google OAuth refresh token
- `config.yaml` — May contain sensitive calendar IDs

## Troubleshooting

| Issue | Solution |
|-------|----------|
| "Calendar service not initialised" | Missing `credentials.json` → see @./SETUP_GUIDE.md |
| WebSocket disconnects | Check `docker-compose logs backend`, verify proxy config |
| Events not updating | Check `refresh_interval` in config, verify API quota |
| Frontend build fails | `bun run typecheck` to check TS errors |
| Pre-commit hook fails | Fix errors from CI (typecheck/lint/test/build) |
| Debug WebSocket | `docker-compose logs -f backend` or `wscat -c ws://localhost:8000/ws` |

## Configuration

**File**: `config.yaml` (copy from `config.example.yaml`)

| Setting | Default | Description |
|---------|---------|-------------|
| `calendars` | `["primary"]` | Calendar IDs to display |
| `calendar_colours` | — | Hex colour map per calendar |
| `filters.hours_ahead` | 24 | How far ahead to fetch |
| `filters.important_keywords` | `["!", "URGENT"]` | Keywords that highlight events |
| `filters.exclude_keywords` | `[]` | Keywords to filter out |
| `display.scroll_speed` | 50 | Pixels per second |
| `display.time_format` | `"12h"` | `"12h"` or `"24h"` |
| `refresh_interval` | 300 | Seconds between API fetches |

## Testing

- **Framework**: Bun test
- **Pattern**: `*.test.tsx` alongside source
- **Backend**: No tests yet

## Resources

- @./SETUP_GUIDE.md — Complete setup from scratch (Google OAuth, Docker)
- @./README.md — Project overview and features
- @./config.example.yaml — Configuration reference
- @./docker-compose.yml — Production deployment
