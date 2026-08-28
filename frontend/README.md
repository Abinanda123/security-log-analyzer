# Security Log Analyzer - Frontend

This is the frontend application for the **Security Log Analyzer**, built to provide an interactive and responsive dashboard for visualizing web access logs and detecting security threats.

## 🛠 Tech Stack

- **Framework:** [React 19](https://react.dev/)
- **Build Tool:** [Vite](https://vitejs.dev/)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Charts:** [Recharts](https://recharts.org/)
- **HTTP Client:** [Axios](https://axios-http.com/)

## 🚀 Quick Start

1. **Install dependencies**
   Ensure you are in the `frontend` directory, then run:
   ```bash
   npm install
   ```

2. **Run the development server**
   ```bash
   npm run dev
   ```
   The application will be accessible at `http://localhost:5173` (or the port specified by Vite).

## 📜 Available Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts the Vite development server with Hot Module Replacement (HMR). |
| `npm run build` | Compiles TypeScript and creates an optimized production build in the `dist` folder. |
| `npm run preview` | Boots up a local static web server that serves the files from `dist` to preview the production build. |
| `npm run lint` | Runs [Oxlint](https://oxc.rs/) to check code quality and catch errors quickly. |

## 📁 Directory Structure

```text
frontend/
├── public/               # Static assets that bypass Vite's build pipeline
├── src/                  # React source components, pages, and utilities
├── index.html            # Main HTML entry point
├── package.json          # Frontend dependencies and scripts
├── tsconfig.json         # TypeScript configuration
└── vite.config.ts        # Vite configuration
```

## 📝 Notes

For full project documentation, architecture details, and backend setup, please refer to the [root README.md](../README.md).
