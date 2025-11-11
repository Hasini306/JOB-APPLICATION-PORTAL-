# Job Portal (Frontend + Backend)

This project was prepared automatically by ChatGPT.

## What was added
- A Node.js + Express backend in `/server` using MongoDB (Mongoose).
- Models: User, Job, Application.
- APIs:
  - POST /api/auth/register
  - POST /api/auth/login
  - GET  /api/auth/me
  - GET  /api/jobs
  - GET  /api/jobs/:id
  - POST /api/jobs (employer only, requires JWT)
  - POST /api/apply/:jobId (multipart/form-data, resume file with field name `resume`)
- A small frontend glue script at `PROJECT/assets/js/main.js` that:
  - Loads jobs into an element with id `jobs-list`
  - Handles login form with id `login-form`
  - Handles Apply button with class `apply-btn` on jobs

## How to run (backend)
1. Install Node.js (v16+ recommended).
2. Open terminal and navigate to `/server`.
3. Copy `.env.example` to `.env` and set `MONGO_URI` and `JWT_SECRET`.
4. Run:
   ```
   npm install
   npm run seed      # optional: creates demo users & jobs
   npm run dev       # starts server with nodemon
   ```
5. By default server runs on port 5000.

## Notes
- The frontend was not heavily modified, only a small JS file was added and included.
- If your HTML uses different form ids or structures, the JS may need tweaks.
- Uploaded resumes are stored in `/server/uploads`.

