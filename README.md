API Management Platform

A full-stack web application for managing APIs, generating API keys, monitoring API traffic, and checking API health from a single dashboard.

Live Demo

Live Application: Add your deployed frontend URL here

GitHub Repository: https://github.com/Madan2423/api-management-platform

Project Overview

The API Management Platform provides a centralized interface where users can:

Register and log in securely

Create and manage APIs

Generate API keys for APIs

Revoke API keys

Test protected APIs using API keys

Check API health and response time

Monitor API traffic and performance

View request statistics and recent requests

The project uses a React frontend, Node.js/Express backend, and SQLite database.

Features

Authentication

User registration

User login

JWT-based authentication

Logout

Protected application routes

API Management

Create APIs

View APIs

Update API details

Delete APIs

Store API name, base URL, and description

API Key Management

Generate API keys for registered APIs

View API keys

Revoke API keys

Protect API requests with the X-API-Key header

API Health

The platform can check the health of a configured API and display:

Health status

HTTP status code

Response time

Last checked time

API Monitoring

The monitoring dashboard provides:

Total requests

Successful requests

Failed requests

Success rate

Failure rate

Average response time

Fastest response

Slowest response

Rate-limit violations

Request volume by endpoint

Response time by endpoint

HTTP status-code breakdown

HTTP method breakdown

Top endpoints

Recent API requests

Tech Stack

Frontend

React.js

React Router

JavaScript

HTML

CSS

Vite

Backend

Node.js

Express.js

REST APIs

JWT authentication

Database

SQLite

Development Tools

VS Code

Git

GitHub

npm

Deployment

Render

Architecture

                  ┌─────────────────────────┐
                  │       React Frontend    │
                  │                         │
                  │ Login / Register        │
                  │ Dashboard               │
                  │ API Management          │
                  │ API Keys                │
                  │ Monitoring              │
                  │ API Health              │
                  └────────────┬────────────┘
                               │
                               │ REST API
                               ▼
                  ┌─────────────────────────┐
                  │    Node.js + Express    │
                  │                         │
                  │ Authentication          │
                  │ API Management          │
                  │ API Keys                │
                  │ Health Checks            │
                  │ Monitoring              │
                  └────────────┬────────────┘
                               │
                               ▼
                  ┌─────────────────────────┐
                  │        SQLite DB        │
                  │                         │
                  │ Users                   │
                  │ APIs                    │
                  │ API Keys                │
                  │ Request Logs             │
                  └─────────────────────────┘

Authentication Flow

User
  │
  ▼
Register / Login
  │
  ▼
Backend validates credentials
  │
  ▼
JWT token generated
  │
  ▼
Token stored by frontend
  │
  ▼
Protected requests include:
Authorization: Bearer <token>

API Key Flow

User
  │
  ▼
Select API
  │
  ▼
Generate API Key
  │
  ▼
API Key stored by backend
  │
  ▼
Client sends:
X-API-Key: <api-key>
  │
  ▼
Backend validates API key
  │
  ├── Valid   → API request allowed
  │
  └── Invalid → Request rejected

Example Protected API Request

A protected API request requires the API key in the request header:

X-API-Key: YOUR_API_KEY

If the header is missing, the backend returns:

{
  "message": "X-API-Key header is required"
}

If the API key is invalid, the backend returns:

{
  "message": "Invalid API key"
}

Example API

The project was tested with the JSONPlaceholder API:

https://jsonplaceholder.typicode.com

Example endpoint:

/users/1

The monitoring dashboard can display request information such as:

Total Requests: 23
Successful Requests: 23
Failed Requests: 0
Success Rate: 100%
Failure Rate: 0%

Main Application Pages

Dashboard

Provides access to:

APIs

API Keys

Monitoring

API Health

API Management

Users can create, update, view, and delete APIs.

API Keys

Users can generate and revoke API keys associated with APIs.

Monitoring

Displays API traffic and performance statistics.

API Health

Displays the current operational status and response time of configured APIs.

Local Setup

1. Clone the repository

git clone https://github.com/Madan2423/api-management-platform.git
cd api-management-platform

2. Backend setup

cd backend
npm install

Create a .env file:

PORT=5000
JWT_SECRET=your_secret_key

Start the backend:

npm run dev

The backend runs on:

http://localhost:5000

3. Frontend setup

Open another terminal:

cd frontend
npm install
npm run dev

The frontend will run on the Vite development server.

Environment Variables

Backend

PORT=5000
JWT_SECRET=your_secret_key

Frontend

The frontend API configuration points to the deployed backend:

https://api-management-platform.onrender.com/api

For local development, it can point to:

http://localhost:5000/api

Do not commit real secrets, passwords, or private API keys to GitHub.

Deployment

The project is deployed using Render.

Backend

The Node.js/Express backend is deployed as a web service.

Frontend

The React/Vite frontend is deployed as a static site.

The GitHub repository is connected to Render with automatic deployment enabled.

The deployment workflow is:

Local Changes
     ↓
Git Commit
     ↓
Git Push
     ↓
GitHub
     ↓
Render Automatic Deployment
     ↓
Live Application

Git Workflow

After making changes:

git status
git add .
git commit -m "Describe your changes"
git push origin main

Render automatically detects the new commit and deploys the updated application.

Project Structure

api-management-platform/
│
├── backend/
│   ├── routes/
│   ├── middleware/
│   ├── database/
│   ├── server.js
│   ├── package.json
│   └── .env
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── APIs.jsx
│   │   │   ├── ApiKeys.jsx
│   │   │   └── Monitoring.jsx
│   │   │
│   │   ├── services/
│   │   │   └── api.js
│   │   │
│   │   └── App.jsx
│   │
│   ├── package.json
│   └── vite.config.js
│
├── .gitignore
└── README.md

API Functionality

The frontend communicates with the backend through REST endpoints for:

Authentication

API management

API key management

Monitoring

API health

The frontend service layer centralizes these requests in:

frontend/src/services/api.js

Security Considerations

Authentication uses JWT tokens.

Protected backend routes require authentication.

API access is controlled using API keys.

API keys should not be committed to source control.

Environment secrets should be stored in environment variables.

Production secrets should never be placed directly in frontend source code.

Future Improvements

Possible future enhancements include:

API request analytics charts

Pagination for request logs

Search and filtering

API usage alerts

Rate-limit configuration

API response caching

Role-based access control

API documentation generation

Improved dashboard analytics

Automated API uptime monitoring

Author

Madan Kumar

B.Tech — Electronics and Communication Engineering

GitHub: https://github.com/Madan2423
