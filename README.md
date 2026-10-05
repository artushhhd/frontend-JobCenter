# JobCenter — Frontend

Next.js 16 / React 19 client for the JobCenter REST API.

**Backend:** https://github.com/artushhhd/backend-JobCenter

## Highlights

- Next.js App Router
- React 19 with JavaScript
- Centralized API client
- Bearer-token authentication
- Role-aware navigation
- Job search, filtering, sorting, pagination
- Likes and comments
- Profile and CV management
- Backend-driven authorization
- Structured API error handling

## Stack

Next.js 16 · React 19 · JavaScript · Tailwind CSS 4 · Fetch API · Laravel Sanctum

## API Client

All HTTP communication is centralized in `lib/api.js`.

```env
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
```

The frontend handles presentation and UX; Laravel remains the authorization source of truth.

## Architecture

```text
Next.js App Router
  -> Routes / Components
  -> Hooks
  -> lib/api.js
       |
       v
  Laravel REST API
  -> Authentication / Authorization / Validation
```

## Routes

| Route | Access |
|---|---|
| / | Public |
| /Register | Public |
| /Login | Public |
| /Jobs | Authenticated |
| /AddJob | Job posters |
| /Likes | Authenticated |
| /Profile | Authenticated |
| /Settings | Moderator+ |

## Run Locally

```bash
npm install
copy .env.example .env.local
npm run dev
```

Quality checks:

```bash
npm run lint
npm run build
```
