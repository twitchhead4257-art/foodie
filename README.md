# Online Food Ordering System

A simple full-stack web application for ordering food online.

## Tech Stack
- **Frontend:** HTML, CSS, JavaScript
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (Mongoose)
- **Authentication:** JWT, Bcrypt

## Features
- User Registration & Login
- Food List & Search
- Cart Management
- Order Placement & History
- Admin Panel (Add/Edit/Delete Food)
- Contact Form

## Run Steps
1. Install dependencies: `npm install`
2. Set up environment variables in `.env` (see `.env.example`)
3. Run the application: `npm run dev`
4. Open `http://localhost:3000` in your browser.

## Git Steps
```bash
git init
git add .
git commit -m "food project"
git branch -M main
git remote add origin YOUR_REPO_URL
git push -u origin main
```

## Deploy Steps
1. Push code to GitHub.
2. Connect to a hosting platform (e.g., Render, Heroku, Vercel).
3. Set environment variables (MONGODB_URI, JWT_SECRET).
4. Build and start the application.
