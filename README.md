# TeamSync

A team management and collaboration web app. A team gets a workspace, the workspace has projects, and each project has tasks that can be assigned to teammates. Access is controlled by roles (Owner, Admin, Member).

Live demo: https://team-management-and-collaboration-client.onrender.com/

Source code: https://github.com/sureshchoudhary2003/Team-Management-and-Collaboration-Platform-

Note: the demo runs on Render's free tier, so if nobody has used it for a while the first load can take up to a minute.

## Table of Contents

- About the Project
- Features
- Built With
- Project Structure
- Getting Started
- Usage
- Roles and Permissions
- API Overview
- Known Issues
- Roadmap
- Contributing
- Contact

## About the Project

Work in a team usually ends up scattered across chats, notes and spreadsheets. TeamSync keeps it in one place. You sign up, a workspace is created for you, and you can start adding projects and tasks right away. Other people join through an invite link.

I built it to learn how a full-stack app is put together: authentication with JWT, role-based access control, a REST API with separate route, controller and service layers, and a React frontend that caches server data.

## Features

- Sign up, log in and log out. Passwords are hashed with bcrypt.
- Access token plus refresh token (stored in an httpOnly cookie) for sessions.
- A default "My Workspace" is created when you register. You can create more workspaces and switch between them.
- Projects with a name and an emoji.
- Tasks with title, description, status, priority, assignee and due date. Each task gets an automatic code.
- Task table with filters for status, priority, assignee and project, plus pagination. Filters are kept in the URL so you can share a filtered view.
- Dashboard with total, overdue and completed task counts.
- Members page with an invite link. The Owner can change a member's role.
- Permissions are checked in the UI and again on the server.

Not built yet: notifications (only the database schema exists), Google login, removing a member, resetting the invite link, comments and profile pictures.

## Built With

Frontend

- React 18 and Vite
- React Router
- TanStack Query and TanStack Table
- Axios
- React Hook Form and Zod
- Tailwind CSS with shadcn/ui

Backend

- Node.js and Express
- MongoDB with Mongoose (MongoDB Atlas)
- JSON Web Tokens
- bcrypt
- Zod

## Project Structure

```
backend/
  src/
    index.js        starts the server
    app.js          express setup, CORS, routes, error handler
    routes/         auth, user, workspace, member, project, task
    controllers/    read the request, check the role, send the response
    services/       business logic and database work
    models/         Mongoose schemas
    middlewares/    verifyJWT
    validation/     Zod schemas
    seeders/        creates the three roles
    utils/          helpers such as roleGuard and apiError

client/
  src/
    routes/         route lists and protected routes
    page/           auth, invite and workspace pages
    components/     sidebar, task, project and member components, ui
    hooks/api/      React Query hooks
    lib/            api.js and axios-client.js
    context/        auth provider (current user and permissions)
```

## Getting Started

### Prerequisites

- Node.js 18 or newer
- A MongoDB Atlas cluster. Registration uses transactions, which need a replica set, so a plain local MongoDB will not work.

### Installation

1. Clone the repository

```
git clone https://github.com/sureshchoudhary2003/Team-Management-and-Collaboration-Platform-.git
cd Team-Management-and-Collaboration-Platform-
```

2. Set up the backend

```
cd backend
npm install
```

Create a `.env` file in the backend folder:

```
PORT=8000
NODE_ENV=development
MONGODB_URI=your_mongodb_atlas_connection_string
ACCESS_TOKEN_SECRET=a_long_random_string
ACCESS_TOKEN_EXPIRY=1d
REFRESH_TOKEN_SECRET=another_long_random_string
REFRESH_TOKEN_EXPIRY=10d
CORS_ORIGIN=http://localhost:3000
FRONTEND_ORIGIN=http://localhost:3000
```

You can generate a secret with:

```
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

Create the roles. Run this once only:

```
npm run seed
```

Start the server:

```
npm run dev
```

The API runs on http://localhost:8000

3. Set up the frontend

Open a second terminal.

```
cd client
npm install
```

Create a `.env` file in the client folder:

```
VITE_API_BASE_URL=http://localhost:8000/api/v1
```

Start the app:

```
npm run dev
```

The app runs on http://localhost:3000

Two things that often go wrong:

- If you skip `npm run seed`, registration fails with "Owner role not found".
- The API URL must end with `/api/v1`. Without the `/v1`, every request returns 404.

## Usage

1. Open the app and sign up. A workspace called "My Workspace" is created for you.
2. Create a project from the sidebar and pick an emoji.
3. Open the project and add tasks. Choose a status, priority, assignee and due date.
4. Use the Tasks page to filter and search. Copy the URL to share the filtered view.
5. Open the Members page, copy the invite link and send it to a teammate. When they open it and log in, they join as a Member.
6. As Owner, change a teammate's role to Admin from the Members page if they need more access.
7. The Dashboard shows the total, overdue and completed counts.

## Roles and Permissions

| Action | Owner | Admin | Member |
|---|---|---|---|
| View workspace, projects, tasks, members | Yes | Yes | Yes |
| Create and edit tasks | Yes | Yes | Yes |
| Delete tasks | Yes | Yes | No |
| Create, edit and delete projects | Yes | Yes | No |
| See the invite link | Yes | Yes | No |
| Open workspace settings | Yes | Yes | No |
| Rename workspace | Yes | No | No |
| Delete workspace | Yes | No | No |
| Change a member's role | Yes | No | No |

A role belongs to the membership, not the user. The same person can be Owner in one workspace and Member in another.

## API Overview

All routes start with `/api/v1`. Everything except register, login and refresh-token needs an `Authorization: Bearer <token>` header.

| Area | Endpoints |
|---|---|
| Auth | `POST /auth/register`, `POST /auth/login`, `POST /auth/logout`, `POST /auth/refresh-token` |
| User | `GET /user/current` |
| Workspace | `POST /workspace/create/new`, `GET /workspace/all`, `GET /workspace/:id`, `GET /workspace/members/:id`, `GET /workspace/analytics/:id`, `PUT /workspace/update/:id`, `PUT /workspace/change/member/role/:id`, `DELETE /workspace/delete/:id` |
| Member | `POST /member/workspace/:inviteCode/join` |
| Project | `POST /project/workspace/:wid/create`, `GET /project/workspace/:wid/all`, `GET /project/:id/workspace/:wid`, `GET /project/:id/workspace/:wid/analytics`, `PUT /project/:id/workspace/:wid/update`, `DELETE /project/:id/workspace/:wid/delete` |
| Task | `POST /task/workspace/:wid/project/:pid/create`, `GET /task/workspace/:wid/all`, `GET /task/:id/project/:pid/workspace/:wid`, `PUT /task/:id/workspace/:wid/project/:pid/update`, `DELETE /task/:id/workspace/:wid/delete` |

## Known Issues

These came out of a code review and are still on my list:

- Validation errors and invalid ids return a 500 instead of a 400.
- Register and login do not use the Zod schemas yet, so password length is not checked on the server.
- No rate limiting or helmet, and the access token is kept in localStorage.
- The silent token refresh inside the auth middleware does not save the new refresh token, which can log users out when the access token expires.
- Updating a task does not check that the assignee belongs to the workspace.
- Task codes use only 3 random characters, so duplicates are possible.
- The task search puts user input straight into a regex.
- There are no tests yet.

## Roadmap

- Fix the issues above and add tests
- Kanban board view
- Comments and mentions
- Notifications and email reminders for due dates
- Remove member and reset invite link
- Google login
- An AI helper that can create tasks from a sentence and summarise project progress

## Contributing

Suggestions and fixes are welcome.

1. Fork the repository
2. Create a branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m "Add your feature"`
4. Push the branch: `git push origin feature/your-feature`
5. Open a pull request

If you find a bug, open an issue with the steps to reproduce it and what you expected to happen.

## Contact

Suresh Choudhary

GitHub: https://github.com/sureshchoudhary2003

Project link: https://github.com/sureshchoudhary2003/Team-Management-and-Collaboration-Platform-
