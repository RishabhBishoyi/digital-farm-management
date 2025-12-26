# Deployment Guide for Digital Farm Management System

This guide will help you deploy your MERN stack application. We will deploy the **Frontend to Vercel** and the **Backend to Render**.

## Prerequisites

1.  **GitHub Account**: You need to push your code to a GitHub repository.
2.  **MongoDB Atlas Account**: You need a cloud database. Local MongoDB (`mongodb://localhost...`) will not work in production.

---

## Step 1: Prepare your Database (MongoDB Atlas)

1.  Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and create a free account.
2.  Create a new Cluster (Free Tier).
3.  Create a Database User (username and password). **Remember these!**
4.  In "Network Access", allow access from anywhere (`0.0.0.0/0`).
5.  Get your **Connection String**:
    *   Click "Connect" -> "Connect your application".
    *   Copy the string (e.g., `mongodb+srv://<username>:<password>@cluster0.mongodb.net/?retryWrites=true&w=majority`).
    *   Replace `<username>` and `<password>` with your actual user details.

---

## Step 2: Push to GitHub

1.  Initialize a git repository if you haven't already:
    ```bash
    git init
    git add .
    git commit -m "Initial commit"
    ```
2.  Create a new repository on GitHub.
3.  Push your code:
    ```bash
    git remote add origin <your-github-repo-url>
    git push -u origin master
    ```

---

## Step 3: Deploy Backend (Render)

1.  Go to [Render](https://render.com/) and sign up.
2.  Click **"New +"** and select **"Web Service"**.
3.  Connect your GitHub repository.
4.  **Settings**:
    *   **Name**: `farm-system-backend` (or similar)
    *   **Root Directory**: `server` (Important!)
    *   **Runtime**: `Node`
    *   **Build Command**: `npm install`
    *   **Start Command**: `node index.js`
5.  **Environment Variables** (Scroll down to "Advanced"):
    *   Add `MONGO_URI`: Paste your MongoDB Atlas connection string.
    *   Add `JWT_SECRET`: Enter a secure secret key (e.g., `mysecretkey123`).
    *   Add `PORT`: `5000` (Optional, Render sets this automatically, but good to be safe).
6.  Click **"Create Web Service"**.
7.  Wait for the deployment to finish. Copy the **Backend URL** (e.g., `https://farm-system-backend.onrender.com`).

---

## Step 4: Deploy Frontend (Vercel)

1.  Go to [Vercel](https://vercel.com/) and sign up.
2.  Click **"Add New..."** -> **"Project"**.
3.  Import your GitHub repository.
4.  **Project Settings**:
    *   **Framework Preset**: Vite (should be detected automatically).
    *   **Root Directory**: Click "Edit" and select `client`.
5.  **Environment Variables**:
    *   Add `VITE_API_URL`: Paste your **Render Backend URL** (e.g., `https://farm-system-backend.onrender.com`).
    *   *Note: Do not add a trailing slash `/` at the end.*
6.  Click **"Deploy"**.

---

## Step 5: Final Check

1.  Open your Vercel App URL.
2.  Try to Login/Register.
3.  If it works, you are live!

## Troubleshooting

*   **CORS Errors**: If you see CORS errors in the browser console, ensure your Backend is running and the URL in `VITE_API_URL` is correct.
*   **Database Connection**: Check Render logs to see if "MongoDB Connected" appears. If not, check your `MONGO_URI` and Network Access in MongoDB Atlas.
