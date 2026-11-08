# TheraDrive — Responsive Wellness Landing Page

**TheraDrive** is a responsive, French-language React frontend for a concept of mobile therapy and wellness sessions in Morocco. It presents the service and provides an interactive booking-request form.

> **Status: frontend prototype.** The booking form currently displays an on-page confirmation. It does **not** submit reservations to a server, save user data, send emails, or process payments.

## Live demo

[Visit TheraDrive](https://theradrivema.arbwij.workers.dev/)

This is the deployment URL previously associated with the project; live availability has not been verified as part of this documentation update.

## Tech stack

| Area | Technology |
| --- | --- |
| Frontend | React 19, JavaScript (JSX) |
| Tooling | Vite 8, npm |
| Icons | Lucide React |
| Styling | CSS and component-level styles in `src/App.jsx` |

**Not included in this repository:** Spring Boot backend, PostgreSQL, JWT authentication, REST API, or payment service.

## Features implemented

- Responsive French-language single-page marketing website.
- Service and concept presentation, navigation and booking section.
- Service selection and client-side booking form for name, phone, city, date, time and service.
- On-page confirmation state after submitting the form.
- Mobile navigation, scroll-triggered animations, animated counters and visual transitions.

### Booking limitations

The booking form stores input in React state. Submitting it prevents the browser's default action and changes the displayed step. **No reservation is transmitted or stored.** Text in the UI promising a callback or reservation confirmation is demonstration copy until a backend and notification system are integrated.

## Getting started

### Prerequisites

- Node.js compatible with Vite 8 (check the currently supported Node.js versions in the Vite documentation).
- npm.

### Install and run

```bash
git clone https://github.com/wijdane-ARB/theradrive.git
cd theradrive
npm ci
npm run dev
```

Open the URL printed by Vite (typically `http://localhost:5173`).

### Build and preview

```bash
npm run build
npm run preview
```

The production build is generated in `dist/` for hosting as static assets. `npm run preview` is for local preview, not a production server.

### Code quality

```bash
npm run lint
```

The repository includes a lint script. No automated test script is currently defined in `package.json`.

## Project structure

```text
theradrive/
├── public/                # Static assets
├── src/
│   ├── App.jsx            # Main interface, booking form and animations
│   ├── App.css            # Additional stylesheet (not imported by App.jsx)
│   ├── index.css          # Global stylesheet
│   └── main.jsx           # React entry point
├── index.html
├── vite.config.js
├── eslint.config.js
├── package.json
└── README.md
```

### Technical observations

Most of the customized TheraDrive styling is embedded in `src/App.jsx`. Some initial Vite starter styles remain in the other CSS files. Extracting UI components and their styles into smaller files would make the project easier to maintain.

## Roadmap

- [x] Responsive landing page and navigation.
- [x] Interactive client-side booking form.
- [x] Client-side confirmation display.
- [x] Mobile-friendly animations.
- [ ] Connect form submission to a secure backend.
- [ ] Implement availability checks and persist reservations.
- [ ] Add real notification and payment integrations, if required.
- [ ] Add automated component and end-to-end tests.
- [ ] Improve accessibility and reorganize components/styles.
- [ ] Update demo-only claims before public production use.

## Author

**Wijdane Aarroub** — Master's student in Distributed Systems and Artificial Intelligence, ENSET Mohammedia.

[GitHub](https://github.com/wijdane-ARB) · [LinkedIn](https://www.linkedin.com/in/aarroub-wijdane/)

---

*This repository demonstrates frontend development and UX implementation. Proposed backend capabilities are not implemented here.*
