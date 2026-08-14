# User Enquiry Management Portal

A modern, full-stack web application for submitting and managing user enquiries through a public, responsive interface deployed on Netlify with serverless functions and managed Postgres database.

## Features

* **Public & Free Access**: Anyone can submit enquiries directly with zero login or setup required.
* **Full CRUD Operations**: Create, Read, Update, and Delete enquiries in real time.
* **Serverless Architecture**: Powered by Netlify Functions with automated routing.
* **Persistent Managed Database**: Backed by Netlify Database (Postgres) with Drizzle ORM and automatic migrations.
* **Search & Real-time Filtering**: Instant search across names, emails, phone numbers, and messages.
* **Sorting & View Modes**: Sort by newest, oldest, or alphabetical order; switch between Table and Grid Card views.
* **CSV Export**: One-click export of all enquiries into CSV spreadsheet format.
* **One-Click Demo Fill**: Convenient pre-fill feature to quickly test enquiry submissions.
* **Modern UI & Responsive Design**: Polished with Tailwind CSS, Flowbite React, and Plus Jakarta Sans typography.

## Tech Stack

**Frontend**
* React 19 + Vite
* Tailwind CSS + Flowbite React
* Axios

**Backend & Infrastructure**
* Netlify Functions (TypeScript / ES Modules)
* Netlify Database (Managed Postgres)
* Drizzle ORM

## Project Structure

```text
User-Enquiry-Form/
├── client/
│   └── vite-project/         # React frontend with Vite & Tailwind
├── db/
│   ├── schema.ts             # Drizzle database schema
│   └── index.ts              # Netlify Database client initialization
├── netlify/
│   ├── functions/
│   │   └── enquiries.mts     # Serverless API endpoints for enquiries
│   └── database/
│       └── migrations/       # Automated SQL migrations
├── server/                   # Legacy Express backend (reference)
├── netlify.toml              # Netlify build & routing configuration
├── drizzle.config.ts         # Drizzle ORM migration configuration
└── package.json              # Root dependencies & scripts
```

## Running Locally with Netlify CLI

```bash
# Install dependencies
npm install
npm install --prefix client/vite-project

# Run local development server with Netlify emulation
npx netlify dev
```

## License

This project is intended for educational and portfolio purposes.

## Author

**Akash Karmakar**  
Computer Science & Engineering Student | West Bengal, India

* GitHub: [Mysterious-Magici](https://github.com/Mysterious-Magici)
* Repository: [User-Enquiry-Form](https://github.com/Mysterious-Magici/User-Enquiry-Form)
