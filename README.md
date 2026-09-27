# JobCenter Frontend

Next.js frontend for JobCenter, connected to the JobCenter Laravel REST API.

## Stack

- Next.js 16
- React 19
- JavaScript
- Tailwind CSS 4
- Laravel Sanctum bearer-token authentication

## Features

- Registration and login
- Job seeker and recruiter account flows
- Job marketplace with search and sorting
- Recruiter job creation with draft/publish workflow
- Job likes
- Job discussions/comments
- Profile and private CV management
- Staff settings for jobs and users
- Responsive UI
- Client-side validation with server-side API validation as the source of truth

## Project structure

```text
app/
├── AddJob/
├── Jobs/
├── Likes/
├── Login/
├── Profile/
├── Register/
└── Settings/

components/
├── AppHeader.jsx
├── JobCard.jsx
├── JobComments.jsx
├── JobForm.jsx
├── JobLikeButton.jsx
└── ...

hooks/
├── useComments.js
├── useJobs.js
├── useProfile.js
└── useUsers.js

lib/
├── api.js
├── jobs.js
├── labels.js
├── permissions.js
└── validation.js
```

## Requirements

- Node.js 20+ recommended
- npm

## Installation

Clone the repository:

```bash
git clone https://github.com/artushhhd/frontend-JobCenter.git
cd frontend-JobCenter
```

Install dependencies:

```bash
npm install
```

Create the environment file:

```bash
copy .env.example .env.local
```

Set the Laravel API URL:

```text
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
```

The frontend intentionally does not hard-code the backend URL. Configure it through `NEXT_PUBLIC_API_URL`.

## Development

Start the development server:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

## Production

Build:

```bash
npm run build
```

Start:

```bash
npm start
```

Lint:

```bash
npm run lint
```

## Authentication

The frontend stores the Sanctum personal access token in browser `localStorage` under the `jobcenter_token` key.

Authenticated requests send:

```http
Authorization: Bearer <token>
Accept: application/json
```

The backend remains responsible for the real authorization checks. Frontend permission helpers only control navigation and UI visibility.

## API integration

All HTTP communication is centralized in `lib/api.js`.

The client provides methods for:

- authentication
- profile and CV operations
- jobs
- likes
- comments
- staff job management
- staff user management

The frontend expects the Laravel API to be available under `NEXT_PUBLIC_API_URL`.

## Routes

| Route | Purpose |
|---|---|
| `/Login` | Sign in |
| `/Register` | Create an account |
| `/Profile` | Current user profile |
| `/Jobs` | Job marketplace |
| `/AddJob` | Recruiter job creation |
| `/Likes` | Liked jobs |
| `/Settings` | Staff management |

## Environment

Required:

```text
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
```

Do not commit `.env.local` or other files containing environment-specific secrets.

## Backend

This frontend is designed to work with:

https://github.com/artushhhd/backend-JobCenter

Start the Laravel API first, configure its CORS `FRONTEND_URL`, then start this application.

## License

This project is licensed under the MIT License.
