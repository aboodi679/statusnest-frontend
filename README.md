# StatusNest Frontend

> React dashboard for StatusNest — hosted on AWS S3 + CloudFront

A clean, dark-themed React application that serves as the public-facing frontend for StatusNest. Users can view live status pages for any registered tenant.

**Live:** http://statusnest-dev-frontend.s3-website.us-east-1.amazonaws.com

---

## Features

- **Landing page** — enter any username to view their live status page
- **Public status page** — shows all monitored services with UP/DOWN status and latency
- **Incident banner** — displays active incidents at the top
- **Service history** — 24h status history per service
- **Real-time data** — reads from Redis via Status Page Service (updated every 60s)

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 18 |
| Styling | Inline CSS + Google Fonts (Inter) |
| Hosting | AWS S3 Static Website |
| Build | Create React App |
| CI/CD | GitHub Actions |

---

## Project Structure

```
statusnest-frontend/
├── public/
│   └── index.html
├── src/
│   ├── pages/
│   │   └── StatusPage.js      # Public status page view
│   ├── components/
│   │   └── ServiceCard.js     # Individual service status card
│   ├── App.js                 # Landing page + routing
│   └── index.js
├── .github/
│   └── workflows/
│       └── deploy.yml         # S3 deploy on push to main
└── package.json
```

---

## Local Development

```bash
git clone https://github.com/aboodi679/statusnest-frontend
cd statusnest-frontend
npm install
npm start
```

Opens at `http://localhost:3000`

---

## Deployment

Build and sync to S3:

```bash
npm run build
aws s3 sync build/ s3://statusnest-dev-frontend --region us-east-1
```

CI/CD via GitHub Actions — auto deploys on every push to `main`.

---

## API Connection

The frontend calls the Status Page Service directly via the ALB:

```
http://statusnest-dev-alb-1293848550.us-east-1.elb.amazonaws.com/status/{username}
```

---

## Related Repos

| Repo | Description |
|------|-------------|
| [statusnest-api](https://github.com/aboodi679/statusnest-api) | FastAPI backend — 3 microservices |
| [statusnest-infra](https://github.com/aboodi679/statusnest-infra) | Terraform IaC |
| [statusnest-worker](https://github.com/aboodi679/statusnest-worker) | Lambda monitor + processor |

---

*Built by [Muhammad Abdullah](https://github.com/aboodi679) · Powered by AWS S3*
