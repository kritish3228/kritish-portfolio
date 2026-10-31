# Kritish Yadav — Developer Portfolio

A responsive, framework-free portfolio for Kritish Yadav, a Computer Science undergraduate focused on software engineering, machine learning, and AI research.

## Features

- Dark glassmorphism UI with responsive layouts and scroll-reveal animations
- About, experience, skills, projects, research, education, certifications, and contact sections
- Resume download and GitHub, LinkedIn, and email links
- Client-side form validation, loading state, duplicate-submit prevention, and accessible status messages
- `POST /api/contact` serverless endpoint with MySQL persistence and Resend notifications
- Prepared SQL statements, input limits, HTML email escaping, rate limiting, and safe public errors

## Technology

- HTML5, CSS3, and vanilla JavaScript
- Node.js serverless functions on Vercel
- MySQL with `mysql2`
- Resend email API

## Project structure

```text
.
├── api/contact.js          # Vercel contact endpoint
├── assets/
│   ├── icons/
│   ├── images/
│   └── resume/resume.pdf
├── database/schema.sql     # MySQL database and table
├── index.html
├── script.js
├── style.css
├── package.json
├── .env.example
├── vercel.json
└── README.md
```

## Local setup

Requirements: Node.js 18+, a MySQL instance, and a Resend account.

```bash
git clone https://github.com/kritish3228/kritish-portfolio.git
cd kritish-portfolio
npm install
```

Copy `.env.example` to `.env` and fill in the values. Never commit `.env`.

## MySQL setup

Create the database and table with a MySQL client:

```bash
mysql -u YOUR_USER -p < database/schema.sql
```

The API stores `name`, `email`, `subject`, `message`, delivery status, and a timestamp in `contact_messages`. It uses prepared statements and a small connection pool suitable for serverless reuse.

## Environment variables

| Variable | Description |
| --- | --- |
| `DB_HOST` | Hostname of the hosted MySQL server |
| `DB_PORT` | MySQL port, normally `3306` |
| `DB_USER` | MySQL username |
| `DB_PASSWORD` | MySQL password |
| `DB_NAME` | Database name, normally `portfolio_db` |
| `DB_SSL` | Set to `true` when the provider requires TLS |
| `RESEND_API_KEY` | Resend API key |
| `CONTACT_RECEIVER_EMAIL` | Address that receives notifications |
| `CONTACT_SENDER_EMAIL` | Verified Resend sender, for example `Portfolio <contact@example.com>` |
| `ALLOWED_ORIGIN` | Optional allowed origin; defaults to `*` |

## Contact API

`POST /api/contact` accepts JSON:

```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "subject": "Project collaboration",
  "message": "Hello!"
}
```

Successful requests return `201` and a JSON message. Invalid input returns `400`, unsupported methods return `405`, rate-limited clients return `429`, and service failures return a safe `500` response. If MySQL succeeds but Resend fails, the message remains stored and the API returns `202`.

## Run locally

Use Vercel's local runtime so `/api/contact` is available:

```bash
npm start
```

Open the URL printed by Vercel. Opening `index.html` directly still renders the frontend, but the contact form requires the API runtime.

The syntax check can be run with:

```bash
npm test
```

## Vercel deployment

1. Import the GitHub repository into Vercel.
2. Add every variable from `.env.example` in the project Environment Variables settings.
3. Use a separately hosted MySQL database; Vercel does not provide a persistent local MySQL server.
4. Verify the sender domain/address in Resend and set `CONTACT_SENDER_EMAIL` to that verified sender.
5. Deploy and test the contact form from the production URL.

No credentials, `.env` files, or `node_modules` are required in the repository. The included `vercel.json` only sets a bounded function duration; static files are served directly.

## GitHub

Push source code and configuration templates to GitHub, but keep credentials in local/Vercel environment variables. Review the repository before publishing to ensure no `.env` or provider secrets are staged.
