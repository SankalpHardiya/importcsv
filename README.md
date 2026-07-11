
# AI-Powered CSV Importer

An intelligent, modern web application built for **GrowEasy CRM** that dynamically maps messy CSV files with unknown column structures into clean, standardized CRM records using AI.

🚀 **Live Application:** [https://importcsv44.vercel.app/]

---

## 🧠 The Challenge

Standard CSV parsers fail when column names change (e.g., "User Email" vs. "Email Address"). This application bypasses fixed mapping by sending CSV data to Google's Gemini AI. The AI intelligently identifies context, extracts required fields, formats dates, handles multiple contacts, and strictly enforces GrowEasy's CRM rules.

## ✨ Key Features

- **Advanced AI Mapping:** Accurately maps ambiguous columns (Facebook Leads, Google Ads, custom exports) to 15 specific CRM fields.
- **Strict Rule Enforcement:** AI is prompted to strictly use only allowed values for `crm_status` and `data_source`. 
- **Smart Data Handling:** If multiple emails/phones exist, the primary is extracted and extras are automatically appended to `crm_note`.
- **Resilient Backend Architecture:** Processes records in batches of 10. Includes an intelligent retry mechanism that reads Google's rate-limit headers to pause and retry seamlessly.
- **Stateless Validation:** Skips records lacking both an email and a phone number, providing clear reasons for skips.
- **Premium UI/UX:** Built with Next.js 16, Tailwind CSS v4, and shadcn/ui. Features dark/light mode, smooth drag-and-drop, realistic progressive loading bars, and dynamic table filtering.

## 🛠️ Tech Stack

**Frontend**
* Next.js 16 (App Router)
* TypeScript
* Tailwind CSS v4 & shadcn/ui
* PapaParse (Client-side preview)
* Axios

**Backend**
* Node.js & Express
* Multer (File handling)
* PapaParse (Server-side parsing)
* Google Generative AI (Gemini 2.5 Flash)

---

## 🛠️ Local Setup Instructions

Follow these steps to run the project locally. You will need [Node.js](https://nodejs.org/) installed.

### 1. Clone the repository
```bash
git clone https://github.com/YOUR_GITHUB_USERNAME/YOUR_REPO_NAME.git
cd YOUR_REPO_NAME
```

### 2. Backend Setup
```bash
cd backend
npm install
```
Create a `.env` file in the `backend` folder and add your Gemini API key:
```env
PORT=5000
GEMINI_API_KEY=your_gemini_api_key_here
```
Start the backend server:
```bash
node server.js
```
*(Server will run on http://localhost:5000)*

### 3. Frontend Setup
Open a **new terminal** and navigate to the frontend folder:
```bash
cd frontend
npm install
```
Create a `.env.local` file in the `frontend` folder:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```
Start the development server:
```bash
npm run dev
```
*(Application will open at http://localhost:3000)*

---

## 📁 Project Structure

The project follows a strictly separated Frontend/Backend architecture.

```text
├── frontend/               # Next.js Application
│   ├── src/
│   │   ├── app/            # Next.js App Router & Layouts
│   │   ├── components/     # React UI Components
│   │   ├── services/       # API communication layer
│   │   ├── types/          # TypeScript interfaces
│   │   └── utils/          # Constants & CSV parsing logic
│   └── package.json
│
├── backend/                # Node.js/Express Application
│   ├── controllers/        # Request handlers & Multer setup
│   ├── routes/             # API endpoint definitions
│   ├── services/           # AI batch processing & retry logic
│   ├── prompts/            # Gemini Prompt Engineering logic
│   └── server.js           # Express entry point
│
└── README.md
```

## 📧 Submission Details


- **Hosted URL:** [https://importcsv44.vercel.app/](https://importcsv44.vercel.app/)
```
