# Teenage Engineering Portfolio

A modern, sleek personal portfolio website inspired by Teenage Engineering's design ethos. Built with Next.js, Tailwind CSS, and Framer Motion.

## Features

- **Projects** — GitHub repos displayed dynamically
- **Blog** — Markdown-powered blog with inline images
- **Photography** — Bento grid gallery with a fullscreen lightbox
- **Skills, Experience, Education** — Detailed professional sections
- **Dark / Light Mode** — Theme toggle with smooth transitions
- **Responsive** — Mobile-first with animated slide-out menu
- **Admin CMS** — Sign in at `/admin` to create blog posts & upload photos (persisted via Firebase)

## Tech Stack

- [Next.js 15](https://nextjs.org/) (Static Export)
- [Tailwind CSS 4](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [Firebase](https://firebase.google.com/) (Firestore + Auth)
- [Lucide Icons](https://lucide.dev/)

## Run Locally

**Prerequisites:** Node.js 20+

```bash
npm install
npm run dev
```

For local development with Firebase, create a `.env.local` file (see `.env.local.example`).

## Firebase Setup (One-Time)

1. Go to [Firebase Console](https://console.firebase.google.com/) → **Create a project**
2. In the project, go to **Build → Firestore Database** → **Create database** (start in test mode)
3. Go to **Build → Authentication** → **Get started** → Enable **Email/Password** provider
4. In **Authentication → Users** → **Add user** with your email + password
5. Go to **Project Settings** → **General** → scroll to **Your Apps** → click **Web** (`</>`) → Register app
6. Copy the `firebaseConfig` values into your `.env.local` file (see `.env.local.example`)

### Firestore Security Rules

In **Firestore → Rules**, set:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

This allows everyone to read (view posts/photos) but only authenticated users to write.

## Deploy to GitHub Pages

Deployment is automated via GitHub Actions.

1. Go to your repo **Settings → Pages → Source → GitHub Actions**
2. Go to **Settings → Secrets and variables → Actions** → add these secrets:
   - `FIREBASE_API_KEY`
   - `FIREBASE_AUTH_DOMAIN`
   - `FIREBASE_PROJECT_ID`
   - `FIREBASE_STORAGE_BUCKET`
   - `FIREBASE_MESSAGING_SENDER_ID`
   - `FIREBASE_APP_ID`
3. Push to `main` — the workflow handles the rest

Your site will be at: `https://<username>.github.io/<repo-name>/`

## License

MIT
