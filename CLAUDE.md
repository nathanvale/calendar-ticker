# Calendar Ticker

LG OLED TV-optimised news ticker displaying Google Calendar events on big-screen displays.

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
├── apps/                    # Bun monorepo apps
│   ├── backend/            # Python FastAPI backend
│   │   ├── main.py         # FastAPI app, WebSocket, refresh loop
│   │   ├── calendar_service.py # Google Calendar API integration
│   │   ├── requirements.txt # Python dependencies
│   │   └── Dockerfile
│   ├── frontend/           # React TypeScript frontend
│   │   ├── src/
│   │   │   ├── App.jsx    # Main ticker component, WebSocket client
│   │   │   ├── App.css    # OLED-optimized styles (pure black)
│   │   │   ├── main.jsx   # React entry point
│   │   │   └── app.test.tsx # Bun test placeholder
│   │   ├── vite.config.js # Vite config with proxy to backend
│   │   ├── package.json   # Frontend workspace
│   │   ├── tsconfig.json  # Extends root TS config
│   │   ├── Dockerfile     # Frontend container (Nginx)
│   │   └── nginx.conf     # Nginx reverse proxy
│   └── storybook/          # Storybook for design system
│       ├── .storybook/    # Storybook configuration
│       └── package.json   # Storybook workspace
├── packages/               # Shared packages
│   └── design-system/     # Shared design tokens & components
│       ├── src/
│       │   ├── tokens/    # Design tokens (colors, spacing, typography)
│       │   ├── components/ # Reusable components
│       │   └── styles/    # Global styles
│       └── package.json
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
bun install              # Install dependencies (all workspaces)
bun run dev              # Start frontend (Vite :5173)
bun run storybook        # Start Storybook dev server
docker-compose -f docker-compose.dev.yml up  # Full stack

# Build & Test
bun run build            # Build frontend (Vite → dist/)
bun run test             # Run Bun tests (all workspaces)
bun run typecheck        # TypeScript check (all workspaces)
bun run check            # Biome lint + format (--write)
bun run lint             # Biome lint only (no format)
bun run format           # Biome format only (--write)
bun run format:check     # Biome format check (no write)
bun run ci               # Full CI: typecheck + lint + test + build

# Production
docker-compose up --build -d   # Start
docker-compose logs -f         # Logs
docker-compose down            # Stop
```

## Code Conventions

### TypeScript (Frontend)
- **Strict mode** enabled (+ `noUncheckedIndexedAccess`, `noImplicitOverride`)
- **Biome**: Tabs, double quotes, semicolons, recommended rules
- **React**: Functional components, hooks only
- **File naming**: `kebab-case.jsx/tsx`
- **Monorepo**: Bun workspaces (`apps/*`, `packages/*`)

### Python (Backend)
- **Python 3.11+**, FastAPI with async/await
- **Type hints**: `-> dict`, `list[CalendarEvent]`
- **Dataclasses** for models
- **Timezone**: Australia/Melbourne (hardcoded in `apps/backend/calendar_service.py:145`)

### Git
- **Conventional Commits** enforced: `type(scope): subject`
- **Types**: feat, fix, docs, style, refactor, perf, test, build, ci, chore
- **Hooks**: commit-msg (commitlint), pre-commit (full CI)

## Key Files

| File | Purpose |
|------|---------|
| `apps/backend/main.py` | FastAPI app, WebSocket endpoint, background refresh |
| `apps/backend/calendar_service.py` | Google Calendar API, OAuth flow |
| `apps/frontend/src/App.jsx` | Ticker component, WebSocket client, animation |
| `apps/frontend/src/App.css` | OLED styles (pure black #000) |
| `packages/design-system/src/tokens/index.ts` | Design tokens (colors, spacing, typography) |
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
| Workspace dependency issues | Run `bun install` from project root, check package.json workspaces |

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

## Design System

The project now includes a shared design system package:

- **Location**: `packages/design-system/`
- **Exports**: Design tokens (colors, spacing, typography), components
- **Storybook**: Available at `bun run storybook` for visual development
- **Testing**: Comprehensive tests for design tokens and components

**Key Components:**
- `TokenShowcase` — Visual display of design tokens
- Design tokens defined in `packages/design-system/src/tokens/index.ts`

## Testing

- **Framework**: Bun test
- **Pattern**: `*.test.ts` colocated alongside source files (e.g., `index.ts` → `index.test.ts`)
- **DOM Setup**: `bunfig.toml` preloads `test-setup.ts` for happy-dom globals
- **Backend**: No tests yet
- **Design System**: Full test coverage for tokens and components

## Resources

- @./SETUP_GUIDE.md — Complete setup from scratch (Google OAuth, Docker)
- @./README.md — Project overview and features
- @./config.example.yaml — Configuration reference
- @./docker-compose.yml — Production deployment
