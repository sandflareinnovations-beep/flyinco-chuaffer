# Deploying Flyinco to Render

## Prerequisites
1.  **GitHub Account**: You need to host your code on GitHub.
2.  **Render Account**: Sign up at [render.com](https://render.com).

## Step 1: Push Code to GitHub
1.  Create a **new repository** on GitHub (e.g., `flyinco-app`).
2.  Open your terminal inside this project folder (`car_services`) and run:
    ```bash
    git remote add origin https://github.com/sandflareinnovations-beep/flyinco-chuaffer.git
    git push -u origin main
    ```

## Step 2: Deploy Backend (Node.js/Express)
1.  Go to Render Dashboard -> **New +** -> **Web Service**.
2.  Connect your GitHub repository.
3.  **Name**: `flyinco-server` (or similar).
4.  **Root Directory**: `Server` (Important!).
5.  **Build Command**: `npm install`.
6.  **Start Command**: `node server.js`.
7.  **Environment Variables** (Add these):
    - `MONGO_URI`: `(Paste your MongoDB Connection String here)`
    - `JWT_SECRET`: `(Paste your JWT Secret here)`
    - `NODE_ENV`: `production`
8.  Click **Create Web Service**.
9.  Wait for deployment. Once live, copy the **onrender.com URL** (e.g., `https://flyinco-server.onrender.com`).

## Step 3: Deploy Frontend (React)
1.  Go to Render Dashboard -> **New +** -> **Static Site**.
2.  Connect the same GitHub repository.
3.  **Name**: `flyinco-client`.
4.  **Root Directory**: `Clients/Flyinco` (Important!).
5.  **Build Command**: `npm run build`.
6.  **Publish Directory**: `dist`.
7.  **Environment Variables**:
    - `VITE_API_URL`: `https://flyinco-server.onrender.com/api` (Use the backend URL from Step 2, and append `/api` if your frontend expects it, or just base URL if axios base includes `/api`. Note: Your local setup uses `VITE_API_URL` as base. Check `src/lib/api.js`).
      *Currently `api.js` uses `VITE_API_URL || "http://localhost:5000/api"`. So set `VITE_API_URL` to `https://flyinco-server.onrender.com/api`.*
8.  **Redirects/Rewrites** (Crucial for React Router):
    - Go to **Redirects/Rewrites** tab in Render for this Static Site.
    - Add Rule:
        - **Source**: `/*`
        - **Destination**: `/index.html`
        - **Action**: `Rewrite`
9.  Click **Create Static Site**.

## Step 4: Final Config
1.  Once Frontend is live, copy its URL (e.g., `https://flyinco-client.onrender.com`).
2.  Go back to Backend (Web Service) -> **Environment**.
3.  Add/Update `CORS_ORIGIN` if your backend uses it (currently it allows all `*` mostly, but good to check).
4.  Test the live site!
