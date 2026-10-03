# JobCenter Frontend

Next.js 16 client for the [JobCenter REST API](https://github.com/artushhhd/backend-JobCenter).

## What this project demonstrates

- Next.js App Router with plain JavaScript
- Centralized API communication
- Bearer-token authentication
- Role-aware navigation
- Search, filtering, sorting, and pagination
- Comments, likes, profile, and CV flows
- Backend-driven authorization with frontend UX guards
- Structured handling of API validation and authentication errors

## Tech Stack

- Next.js 16
- React 19
- JavaScript
- Tailwind CSS 4
- Native Fetch API
- Laravel Sanctum

## Application Areas

| Area | Responsibility |
|---|---|
| Authentication | Registration, login, session/token handling |
| Jobs | Browse, search, filter, sort, paginate, create/edit |
| Social | Likes and paginated comments |
| Profile | User data and CV management |
| Staff | Role-aware job and user management |

The frontend controls presentation and user experience. **Laravel remains the security boundary and source of truth for authorization.**

## API Client

All HTTP communication is centralized in:

~~~text
lib/api.js
~~~

It is responsible for:

- API base URL configuration
- Bearer-token headers
- JSON and FormData requests
- Non-2xx response handling
- Structured validation errors
- 401 Unauthorized handling
- Token cleanup and redirect behavior

Configure the backend URL with:

~~~env
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
~~~

The URL is not duplicated throughout the application.

## Application Structure

~~~text
app/
components/
hooks/
lib/
~~~

| Directory | Responsibility |
|---|---|
| app/ | Routes and page-level UI |
| components/ | Reusable UI |
| hooks/ | Data loading and client-side behavior |
| lib/ | API client, validation, filters, labels, permissions |

Data hooks cover jobs, comments, profile, and users. Paginated data can be appended incrementally, while abandoned requests are prevented from overwriting newer UI state.

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
| /Settings | Moderator and above |

## Screenshots

<img width="1919" height="1079" alt="Register" src="https://github.com/user-attachments/assets/c96eb5cf-242c-4f0f-abdb-24c06e43531d" />

<img width="1919" height="1079" alt="Login" src="https://github.com/user-attachments/assets/c5a0cead-70af-4247-955a-0a8c6e49f665" />

<img width="1900" height="909" alt="Profile" src="https://github.com/user-attachments/assets/0d9f5dc8-e200-4c77-b178-83beb9976c79" />

<img width="1901" height="1079" alt="Job details" src="https://github.com/user-attachments/assets/cb65d2e9-4fe7-4950-a14c-c6f56ee5e9e0" />

## Local Development

### Requirements

- Node.js
- npm
- Running JobCenter Laravel API

### Installation

~~~bash
npm install
copy .env.example .env.local
~~~

Set:

~~~env
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
~~~

Run:

~~~bash
npm run dev
~~~

Open http://localhost:3000.

### Quality Checks

~~~bash
npm run lint
npm run build
~~~

## Architecture

~~~text
Next.js App Router
      |
      +-- Pages / Components
      +-- Hooks
      +-- lib/api.js
              |
              | HTTP / JSON / FormData
              v
       Laravel REST API
              |
              +-- Authentication + Authorization
~~~

The separation keeps frontend and backend independently testable and deployable.

## Related Repository

**Laravel backend:** https://github.com/artushhhd/backend-JobCenter
