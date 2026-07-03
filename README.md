# StatusNest Frontend

<img width="1568" height="759" alt="image" src="https://github.com/user-attachments/assets/4487b3a9-4219-4072-a56a-59f9777dfd04" />

<img width="1568" height="764" alt="image" src="https://github.com/user-attachments/assets/6545346f-90d5-494f-8747-06af165daba6" />


React SPA for the StatusNest multi-tenant service monitoring platform. Provides a real-time dashboard for managing services, incidents, and subscribers, plus a public status page for each user.

**Live Demo:** https://d1wwgn689544k.cloudfront.net  
**Public Status Page:** https://d1wwgn689544k.cloudfront.net/status/abood

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 |
| HTTP Client | Axios |
| Routing | React Router v6 |
| Styling | Inline CSS (Inter font, dark theme) |
| Hosting | AWS S3 + CloudFront |
| CDN / TLS | AWS CloudFront (HTTPS enforced) |
| WAF | AWS WAF v2 (via CloudFront) |

---

## Features

- **Login** — JWT-based authentication against the auth service

<img width="957" height="838" alt="image" src="https://github.com/user-attachments/assets/9aa937d1-4a93-405e-9ab0-5c280c115d21" />

 
- **Dashboard** — Manage services, incidents, and subscribers in a tabbed UI
  
<img width="1568" height="782" alt="image" src="https://github.com/user-attachments/assets/1ea23839-b265-4747-bfa9-a8712a02bbbc" />

  
- **Live Status Badges** — UP / DOWN / UNKNOWN per service, polled from Redis cache
- **Public Status Page** — `/status/:username` — no login required, shows all active services with response times and 24h history
- **Incident Management** — Create and update incidents with status transitions (investigating → identified → monitoring → resolved)
- **Subscriber Management** — Add email subscribers for status alerts

---

## Project Structure

```
src/
├── App.js                  # Routes: /, /login, /dashboard, /status/:username
├── pages/
│   ├── LandingPage.js      # Marketing landing page
│   ├── LoginPage.js        # JWT login form
│   ├── DashboardPage.js    # Authenticated dashboard (services, incidents, subscribers)
│   └── StatusPage.js       # Public status page
```

---

## API Connection

All API calls go through CloudFront which proxies to the ALB:

```
https://d1wwgn689544k.cloudfront.net
  /auth/*      → Auth ECS service (port 8000)
  /api/*       → Monitor / Status ECS services (ports 8001, 8002)
  default      → S3 frontend (React SPA)
```

The `ALB` constant in `DashboardPage.js` and `StatusPage.js` is set to the CloudFront URL:

```js
const ALB = 'https://d1wwgn689544k.cloudfront.net';
```

---

## Deploy

```powershell
npm run build
aws s3 sync build/ s3://statusnest-dev-frontend --delete
aws cloudfront create-invalidation --distribution-id E1PD475EXURYXL --paths "/*"
```

---

## Related Repos

| Repo | Description |
|---|---|
| [statusnest-api](https://github.com/aboodi679/statusnest-api) | FastAPI microservices (auth, monitor, status) |
| [statusnest-worker](https://github.com/aboodi679/statusnest-worker) | Lambda monitor + SQS processor |
| [statusnest-infra](https://github.com/aboodi679/statusnest-infra) | Terraform IaC for all AWS infrastructure |
