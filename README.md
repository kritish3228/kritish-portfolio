# Kritish Yadav — Developer Portfolio

A responsive, framework-free portfolio for Kritish Yadav, a Computer Science undergraduate focused on software engineering, machine learning, and AI research.

## Features

- Dark glassmorphism UI with responsive layouts and scroll-reveal animations
- About, experience, skills, projects, research, education, certifications, and contact sections
- Resume download and GitHub, LinkedIn, and email links
- Client-side form validation, loading state, duplicate-submit prevention, and accessible status messages
- `POST /api/contact` serverless endpoint with Firestore persistence and Resend notifications
- Input limits, HTML email escaping, rate limiting, and safe public errors

## Technology

- HTML5, CSS3, and vanilla JavaScript
- Node.js serverless functions on Vercel
- Firebase Cloud Firestore through the Firebase Admin SDK
- Resend email API

## Project structure

```text
.
├── api/contact.js          # Vercel contact endpoint
├── lib/firebase.js         # Lazy, reusable Firebase Admin initialization
├── assets/
│   ├── icons/
│   ├── images/
│   └── resume/resume.pdf
├── index.html
├── script.js
├── style.css
├── package.json
├── .env.example
├── vercel.json
└── README.md
```

## Firebase setup

1. Create or select a Firebase project.
2. Create a Cloud Firestore database in that project.
3. Create a service account and keep its JSON key outside the repository. The API does not read the JSON file directly; it uses the three credential environment variables below.
4. Copy `.env.example` to `.env.local` and fill in the values.

The API writes one document per valid submission to the `contact_messages` collection:

| Field | Type | Description |
| --- | --- | --- |
| `name` | string | Trimmed visitor name |
| `email` | string | Lowercase visitor email |
| `subject` | string | Trimmed subject |
| `message` | string | Trimmed message |
| `createdAt` | timestamp | Firestore server timestamp |
| `status` | string | Starts as `new` |
| `emailSent` | boolean | Set to `true` after Resend accepts the notification |

Firebase Admin runs only in the serverless API. Do not put service-account values in `index.html` or `script.js`, and do not disable Firestore security rules to work around configuration problems.

## Environment variables

| Variable | Description |
| --- | --- |
| `FIREBASE_PROJECT_ID` | Firebase project ID |
| `FIREBASE_CLIENT_EMAIL` | Service account client email |
| `FIREBASE_PRIVATE_KEY` | Service account private key; preserve escaped `\n` sequences in Vercel |
| `RESEND_API_KEY` | Resend API key |
| `CONTACT_RECEIVER_EMAIL` | Address that receives notifications |
| `CONTACT_SENDER_EMAIL` | Verified Resend sender, such as `Portfolio <contact@example.com>` |
| `ALLOWED_ORIGIN` | Optional allowed origin; defaults to `*` |

Never commit `.env`, `.env.local`, or a service-account JSON file.

## Local development

Requirements: Node.js 18+, a Firebase project with Firestore enabled, and a Resend account.

```bash
git clone https://github.com/kritish3228/kritish-portfolio.git
cd kritish-portfolio
npm install
```

Copy `.env.example` to `.env.local` and fill in the Firebase and Resend values. Run the Vercel local runtime so `/api/contact` is available:

```bash
npm start
```

Open the URL printed by Vercel. Opening `index.html` directly still renders the frontend, but the contact form requires the API runtime.

The syntax check can be run with:

```bash
npm test
```

## Contact API flow

`POST /api/contact` accepts JSON matching the existing form:

```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "subject": "Project collaboration",
  "message": "Hello!"
}
```

The endpoint validates and trims all fields, applies the existing in-memory IP rate limit, saves the message to Firestore, and then sends the Resend notification. A successful request returns `201`. Invalid input returns `400`, unsupported methods return `405`, rate-limited clients return `429`, and service failures return a safe `500` response. If Firestore succeeds but Resend fails, the message remains stored with `emailSent: false` and the API returns `202`.

## Vercel deployment

1. Import the GitHub repository into Vercel.
2. Open **Project → Settings → Environment Variables**.
3. Add every variable from `.env.example` for the environments where the site runs. For `FIREBASE_PRIVATE_KEY`, paste the service-account private key with its escaped `\n` line breaks.
4. Verify the sender domain/address in Resend and set `CONTACT_SENDER_EMAIL` to that verified sender.
5. Deploy and test the contact form from the production URL.

Vercel does not need the service-account JSON file or any `.env` file committed to the repository. The included `vercel.json` only sets a bounded function duration; static files are served directly.

## GitHub

Push source code and configuration templates to GitHub, but keep credentials in local/Vercel environment variables. Review the repository before publishing to ensure no secret files are staged.
