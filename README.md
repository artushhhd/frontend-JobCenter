# JobCenter Frontend

Next.js 16 frontend for the JobCenter REST API.

**Backend:** https://github.com/artushhhd/backend-JobCenter

## Overview

JobCenter is a full-stack job board with separate Laravel and Next.js applications. This repository contains the frontend application responsible for the user interface, client-side state, API communication, validation feedback, and role-aware navigation.

The frontend is written in plain JavaScript and uses the Next.js App Router.

## Tech Stack

- Next.js 16
- React 19
- JavaScript
- Tailwind CSS 4
- Native Fetch API
- Laravel Sanctum

## Core Features

### Authentication

- Registration and login
- Bearer-token authentication
- Persistent authenticated sessions
- Automatic handling of expired/invalid authentication
- Profile management

### Job Board

- Browse published jobs
- Search and filtering
- Sorting
- Pagination with incremental loading
- Job details
- Create and edit job listings for job posters
- Save jobs with likes

### Comments

- View paginated comments
- Add comments
- Edit and delete owned comments
- Role-aware controls

### Profile & CV

- View profile data
- Upload a CV
- Replace the current CV
- Download or delete the current CV

### Staff Area

- Job management
- User management
- Role-aware navigation and actions

Frontend permissions control what is displayed in the UI, while the Laravel API remains the source of truth for authorization.

## Screenshots

The screenshots below show the main user flows of the JobCenter frontend.

### Authentication

<img width="1919" height="1079" alt="Register" src="https://github.com/user-attachments/assets/c96eb5cf-242c-4f0f-abdb-24c06e43531d" />

<img width="1919" height="1079" alt="Login" src="https://github.com/user-attachments/assets/c5a0cead-70af-4247-955a-0a8c6e49f665" />

### Profile

<img width="1900" height="909" alt="Profile" src="https://github.com/user-attachments/assets/0d9f5dc8-e200-4c77-b178-83beb9976c79" />

### Job Details

<img width="1901" height="1079" alt="Job details" src="https://github.com/user-attachments/assets/cb65d2e9-4fe7-4950-a14c-c6f56ee5e9e0" />


<img width="1918" height="1079" alt="like" src="https://github.com/user-attachments/assets/c0e998ac-cf6d-438a-9a0e-92107c3f1180" />

<img width="1892" height="914" alt="image" src="https://github.com/user-attachments/assets/26b1fac6-c6c9-4cd7-94c4-706cf5d967e5" />

<img width="1897" height="901" alt="image" src="https://github.com/user-attachments/assets/0cedbea8-cc60-4b80-a7eb-23e0eee32857" />

<img width="1896" height="908" alt="image" src="https://github.com/user-attachments/assets/0b68a763-98fa-494b-9411-0c1a97dfafb9" />

<img width="1898" height="916" alt="image" src="https://github.com/user-attachments/assets/9b812446-ad04-4059-8b23-5b8420f8174d" />





**Backend repository:** https://github.com/artushhhd/backend-JobCenter

## API Integration

All HTTP communication is centralized in:

```text
lib/api.js
```

The API client handles:

- Base URL configuration
- Bearer-token authentication
- JSON and FormData requests
- Non-2xx responses
- Structured validation errors
- `401 Unauthorized` handling
- Token cleanup and redirect behavior

The backend URL is configured through an environment variable:

```env
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
```

The value is intentionally not hardcoded across the application.

## Application Structure

```text
app/
components/
hooks/
lib/
```

| Directory | Responsibility |
|---|---|
| `app/` | Routes and page-level UI |
| `components/` | Reusable interface components |
| `hooks/` | Data loading and client-side behavior |
| `lib/` | API client, validation, filters, labels, and permissions |

The data hooks include profile, jobs, comments, and users. Paginated responses can be appended incrementally, and abandoned requests are ignored to prevent stale responses from updating the UI.

## Routes

| Route | Access |
|---|---|
| `/` | Public landing page |
| `/Register` | Public |
| `/Login` | Public |
| `/Jobs` | Authenticated users |
| `/AddJob` | Job posters |
| `/Likes` | Authenticated users |
| `/Profile` | Authenticated users |
| `/Settings` | Moderator and above |

## Local Development

### Requirements

- Node.js
- npm
- Running JobCenter Laravel API

### Installation

```bash
npm install
copy .env.example .env.local
```

Configure:

```env
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
```

Start the development server:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

### Quality Checks

```bash
npm run lint
npm run build
```

Make sure the Laravel API is running and its CORS configuration allows the frontend origin.

## Architecture Notes

The project keeps API communication in one client, separates data loading into hooks, and keeps backend authorization authoritative. Client-side validation mirrors backend rules to provide faster feedback without treating the frontend as a security boundary.
