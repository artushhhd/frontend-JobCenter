# JobCenter frontend

Next.js 16 (App Router) client for the JobCenter API — https://github.com/artushhhd/backend-JobCenter.
Plain JavaScript, React 19, Tailwind 4. No UI kit, no data-fetching library.

## Running it

```bash
npm install
copy .env.example .env.local
npm run dev
```

`.env.local` needs one variable, the address of the Laravel server:

```
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
```

Without it every request fails on the client with "NEXT_PUBLIC_API_URL is not configured."
and nothing is sent. Restart `npm run dev` after changing the file — Next reads it once at
startup. Start the API first and make sure its `FRONTEND_URL` allows the origin you open
(`http://localhost:3000` or `http://127.0.0.1:3000`), otherwise the browser blocks the
responses on CORS.

`npm run build` compiles the pages, `npm run lint` runs eslint with `eslint-config-next`.

## Pages

| Path | Who sees it |
|---|---|
| `/` | landing with links to login and register |
| `/Register` | public, picks job seeker or job poster |
| `/Login` | public |
| `/Jobs` | signed in — search, sort, comments under a card |
| `/AddJob` | job posters, drafts and publish |
| `/Likes` | saved jobs |
| `/Profile` | own data, resume upload for job seekers |
| `/Settings` | moderator and above — jobs and accounts |

## How it talks to the API

`lib/api.js` is the only place that does `fetch`. It attaches the bearer token, turns a non
2xx answer into an `ApiError` that keeps the backend `errors` object, and on 401 clears the
token and sends the visitor to `/Login` (except on the auth pages, where the message is
just shown). The token itself sits in `localStorage` under `jobcenter_token`.

Data loading lives in `hooks/`: `useProfile`, `useJobs` (also used by `/Likes` and the
staff lists), `useComments`, `useUsers`. They all append pages on "show more" instead of
replacing the list, and each one ignores responses from a request it already abandoned.

Server answers stay the source of truth: `lib/validation.js` only mirrors the Form Request
rules so an obvious mistake does not cost a round trip. `lib/permissions.js` decides which
menu items and buttons to render, but the API re-checks everything anyway.

## Layout

```
app/          routes and one css file per page
components/   header, job card, job form, comments thread, settings tables
hooks/        fetching
lib/          api client, filters, labels, permissions, validation
```
