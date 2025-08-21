# Shipzy Backend

Shipzy Backend is an Express.js REST API for a parcel delivery platform.

## Features

- User registration and login (email/password & Google OAuth)
- Role-based access control (Admin, Sender, Receiver)
- Parcel creation, tracking, and status updates
- Secure JWT authentication with refresh tokens
- Global error handling and request validation
  


## Project Structure

```
├── src/
│ ├── app.ts
│ ├── server.ts
│ └── app/
│ ├── config/
│ ├── errorHelpers/
│ ├── helpers/
│ ├── interfaces/
│ ├── middleware/
│ ├── modules/
│ ├── routes/
│ └── utils/
├── .env
├── .gitignore
├── package.json
├── tsconfig.json
├── vercel.json
```

### Prerequisites

- Node.js (v18+ recommended)
- MongoDB database (local or cloud)
- Vercel account (for deployment)


### Installation
```bash
git clone https://github.com/maufdev09/shipzy-backend.git
cd shipzy-backend
npm install
npm run build
npx ts-node-dev src/server.ts
```
### Configure environment variables:
- PORT
- DB_URL
- JWT_ACCESS_SECRET,
- JWT_REFRESH_SECRET
- SUPER_ADMIN_EMAIL,
- SUPER_ADMIN_PASSWORD
- GOOGLE_CLIENT_ID,
- GOOGLE_CLIENT_SECRET,
- GOOGLE_CALLBACK_URL
- FRONTEND_URL

-# API Endpoints

- `POST /api/v1/user/register` — Register a new user
- `POST /api/v1/user//all- users` — Register a new user(Admin)
- `POST /api/v1/auth/login` — Login with email/password
- `POST /api/v1/auth/refresh`- token — Get new access token
- `POST /api/v1/auth/logout` — Logout user
- `POST /api/v1/auth/reset- password` — Reset password
- `GET /api/v1/auth/google` — Google OAuth login
- `POST /api/v1/parcels` — Create a parcel (Sender/Admin)
- <!--  `note`: for creating percel you must have include valid sender and - reciver id  -- >
- `PATCH /api/v1/parcels/cancel/:id` — Cancel a parcel
- `GET /api/v1/parcels/me ` — Get parcels sent by user
- `GET /api/v1/parcels/incoming` — Get parcels received by user
- `PATCH /api/v1/parcels/confirm/:id` — Confirm parcel delivery
- `GET /api/v1/parcels/:id/status`-log — Get parcel status log

```json
{
"email":"marufdev05@gmail.com",
"password":"Maruf6589@",
"role":"RECEIVER"
},
<!-- or login as a Admin  -->
{
"email":"marufdev10@gmail.com",
"password":"marufdev90@gmail.com"

}
```