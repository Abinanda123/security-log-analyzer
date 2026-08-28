<div align="center">
  <br />
  <h1>🛡️ Security Log Analyzer</h1>
  <p>
    <strong>A full-stack security dashboard for web access log analysis and threat detection</strong>
  </p>
  <br />
  <p>
    <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
    <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
    <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js" />
    <img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express" />
    <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
    <img src="https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E" alt="Vite" />
    <img src="https://img.shields.io/badge/Supabase-181818?style=for-the-badge&logo=supabase&logoColor=white" alt="Supabase" />
  </p>
  <p>
    <a href="#features">Features</a> •
    <a href="#architecture">Architecture</a> •
    <a href="#getting-started">Getting Started</a> •
    <a href="#scripts">Scripts</a> •
    <a href="#contributing">Contributing</a>
  </p>
</div>

<br />

<!--
> [!NOTE]
> Add a screenshot or GIF of the dashboard here:
> `![Dashboard Screenshot](./docs/screenshot.png)`
-->

## 🌟 Overview

The **Security Log Analyzer** is a modern, full-stack application designed to parse web access logs (such as Apache and Nginx), detect common attack vectors, and present actionable findings through an interactive and intuitive interface.

It identifies threats like SQL injection attempts, brute-force logins, and 404-flood behavior, providing automated remediation guidance powered by AI.

---

## ✨ Features

- **Log Parsing**: Seamlessly process standard Apache and Nginx web access logs.
- **Threat Detection**:
  - 💉 SQL Injection attempts
  - 🔐 Brute-force login activity
  - 🌊 404-flood behavior and directory traversal
- **Interactive Dashboard**: Visualize findings with rich charts and metrics using Recharts.
- **AI-Assisted Insights**: Generate natural language explanations and remediation guidance using Groq AI.
- **Top Attackers List**: Identify and flag the most aggressive IP addresses.
- **Automated Tests**: Built-in backend detection tests with Vitest.

---

## 🏗️ Architecture & Tech Stack

The project is structured as a monorepo containing a separate React frontend and Node.js/Express backend.

### Frontend
- **Framework**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS v4
- **Charts**: Recharts
- **HTTP Client**: Axios

### Backend
- **Runtime Environment**: Node.js 18+
- **Framework**: Express, TypeScript
- **Database/Auth**: Supabase
- **AI Integration**: Groq SDK
- **File Uploads**: Multer
- **Testing**: Vitest

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed on your local machine:
- [Node.js](https://nodejs.org/) (v18 or higher)
- [npm](https://www.npmjs.com/) (v9 or higher)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/security-log-analyzer.git
   cd security-log-analyzer
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   ```
   *Create a `.env` file in the `backend/` directory with your secrets (see Environment Variables).*
   ```bash
   npm run dev
   ```

3. **Frontend Setup**
   Open a new terminal window:
   ```bash
   cd frontend
   npm install
   ```
   *Create a `.env` file in the `frontend/` directory (if required).*
   ```bash
   npm run dev
   ```

### Environment Variables

You will need to configure environment variables for the backend services. Create a `.env` file in the `backend/` directory:

```env
# Supabase Configuration
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key

# Groq AI Configuration
GROQ_API_KEY=your_groq_api_key

# Server
PORT=3000
```
> ⚠️ **Security Warning**: Never commit secrets or API keys to version control. Always use `.env` files and include them in `.gitignore`.

---

## 📂 Project Structure

```text
security-log-analyzer/
├── backend/                  # Node.js / Express backend API
│   ├── src/                  # Backend source code
│   ├── vitest.config.ts      # Test configuration
│   └── package.json
├── frontend/                 # React / Vite frontend application
│   ├── public/               # Static assets
│   ├── src/                  # React source components and pages
│   ├── vite.config.ts        # Vite configuration
│   └── package.json
└── README.md                 # Project documentation
```

---

## 📜 Scripts

### Backend (`/backend`)

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts the backend development server using `tsx` |
| `npm run build` | Compiles the TypeScript backend into `dist/` |
| `npm start` | Starts the compiled production server |
| `npm test` | Runs backend tests using Vitest |

### Frontend (`/frontend`)

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts the Vite development server with HMR |
| `npm run build` | Creates an optimized production build |
| `npm run preview` | Previews the production build locally |
| `npm run lint` | Runs code quality checks using Oxlint |

---

## 🛡️ Security Note

This project is built for analysis and demonstration purposes. When deploying to production:
- Validate and sanitize all log sources.
- Protect the file upload endpoints.
- Configure restrictive CORS policies.
- Keep all AI and API credentials strictly server-side.

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!
Feel free to check out the [issues page](https://github.com/your-username/security-log-analyzer/issues).

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the [ISC License](LICENSE).
