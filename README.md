# Yun Hai — Chinese Restaurant

A full-stack restaurant website with online reservations, takeaway/delivery ordering, and an admin dashboard.

## Features

- Public site: menu, gallery, reservations, contact, online ordering
- **Reservations** — real-time table availability and auto-assignment
- **Takeaway & delivery** — browse menu, cart checkout, order tracking in admin
- **Admin** (`/admin/login`) — bookings, orders kanban, schedule, settings

## Local development

```bash
npm install
npm run dev
```

- Site: [http://localhost:5174](http://localhost:5174)
- API: [http://localhost:3002](http://localhost:3002)
- Admin password (dev): `yunhai-admin`

## Production build

```bash
npm run build
npm start
```

The Express server serves the built React app from `dist/` and handles `/api` routes.

## Deploy on Render

1. Push this repo to GitHub or GitLab.
2. In [Render](https://render.com), create a **New Web Service** and connect the repo.
3. Render will detect `render.yaml`, or set manually:
   - **Build command:** `npm install && npm run build`
   - **Start command:** `npm start`
   - **Runtime:** Node 20+
4. Add an environment variable:
   - `ADMIN_PASSWORD` — a strong password for staff login (required in production)
5. Deploy. Render sets `PORT` automatically.

### Render notes

- Bookings and orders are stored in JSON files on the server. On Render’s free tier the filesystem is ephemeral — data resets on redeploy. For persistent production data, attach a [Render Disk](https://render.com/docs/disks) or migrate to a database later.
- The first deploy seeds `config.json` from default table settings if it does not exist.

## Tech stack

- React + Vite + Tailwind CSS
- Express API
- JSON file storage (reservations, orders, config)
