# TravelWise - Your AI Travel Genie

## 📌 Overview

TravelWise is a Next.js application that uses AI to generate personalized travel itineraries. Users can input their destination, travel dates, and preferences to receive a custom travel plan. The app also allows users to explore destinations to discover popular attractions, restaurants, and hotels.

This project is built with:

*   **Frontend:** Next.js, React, TypeScript
*   **Styling:** Tailwind CSS, shadcn/ui
*   **AI:** Google Gemini via Genkit
*   **Deployment:** Firebase App Hosting

---

## 🚀 Features

*   **Personalized Itinerary Generation:** AI-powered itinerary creation based on user preferences.
*   **Destination Exploration:** Discover points of interest, restaurants, and hotels for any location.
*   **Personalized Recommendations:** Get tailored suggestions for activities, dining, and lodging.
*   **Modern UI:** A clean and responsive interface built with modern web technologies.

---

## 🛠️ Tech Stack

*   **Framework:** [Next.js](https://nextjs.org/)
*   **UI Components:** [shadcn/ui](https://ui.shadcn.com/)
*   **Styling:** [Tailwind CSS](https://tailwindcss.com/)
*   **AI Integration:** [Genkit](https://firebase.google.com/docs/genkit)
*   **Language:** [TypeScript](https://www.typescriptlang.org/)

---

## 🔧 Project Structure

The project uses the Next.js App Router structure.

```
root/
 ├── src/
 │   ├── app/               # Main application pages and routes
 │   │   ├── explore/
 │   │   ├── itinerary/
 │   │   ├── layout.tsx
 │   │   └── page.tsx
 │   ├── ai/                # Genkit AI flows and configuration
 │   │   └── flows/
 │   ├── components/        # Reusable React components (UI, layout, etc.)
 │   ├── contexts/          # React context providers
 │   ├── lib/               # Utility functions and shared libraries
 ├── public/                # Static assets
 ├── next.config.ts
 ├── tailwind.config.ts
 └── package.json
```

---

## 🔥 Local Development

### 1. Prerequisites

*   Node.js and npm installed.
*   A Firebase project with the Gemini API enabled.
*   An `.env` file with your `GEMINI_API_KEY`.

### 2. Install dependencies

```bash
npm install
```

### 3. Run the development server

This command starts the Next.js app and the Genkit development server simultaneously.

```bash
npm run dev
```

The application will be available at `http://localhost:9002`.

---

## 📦 Deployment

This application is configured for deployment on **Firebase App Hosting**. Pushing your code to a linked GitHub repository will trigger an automatic build and deploy process.

---

## 💬 Support

For issues or feature requests, please open a GitHub issue in the repository.
