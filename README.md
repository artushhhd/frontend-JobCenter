# JobCenter — Frontend

Next.js App Router frontend for the [JobCenter Laravel API](https://github.com/artushhhd/backend-JobCenter).

## Features

- React 19 and JavaScript
- Centralized API client in `lib/api.js`
- Bearer-token authentication flows
- Role-aware navigation and protected user workflows
- Job search, filtering, sorting, and pagination
- Likes and comments
- Profile and CV management
- Structured API error handling

## Technology

Next.js 16 · React 19 · JavaScript · Tailwind CSS 4 · Fetch API

## API Configuration

Create `.env.local` in the frontend root:

```env
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
```

Start the Laravel API on the matching address, or change the variable to the API's local base URL. Do not add endpoint paths to this value unless the API client expects them. Restart the development server after changing environment variables.

All HTTP communication is centralized in `lib/api.js`. Laravel remains the source of truth for authorization; frontend route visibility is only a user-experience feature.

## Main Routes

| Route | Intended access |
|---|---|
| `/` | Public |
| `/Register` | Public |
| `/Login` | Public |
| `/Jobs` | Authenticated |
| `/AddJob` | Job posters |
| `/Likes` | Authenticated |
| `/Profile` | Authenticated |
| `/Settings` | Moderator and above |

Route casing may matter depending on the deployment environment. Confirm the actual paths in the application before linking externally.

## Run Locally

Requirements: Node.js and npm, plus a running backend API.

```bash
npm install
```

Create `.env.local` using the configuration above, then run:

```bash
npm run dev
```

Open the local URL printed by Next.js, usually `http://localhost:3000`.

## Quality Checks

```bash
npm run lint
npm run build
```

See the [backend README](https://github.com/artushhhd/backend-JobCenter) for API setup.
