# AI Travel Genie – README

## 📌 Overview

AI Travel Genie is a personalized travel-planning application built with Next.js, Firebase, and Genkit. It uses AI to generate custom travel itineraries based on user preferences.

* **AI itinerary generation**
* **Location exploration**
* **Personalized recommendations**

The project integrates **Next.js**, **Firebase**, and **Genkit** with Google's Gemini models.

---

## 🚀 Features

### ✈️ Travel Planning

* Generate detailed, day-by-day travel itineraries.
* Explore destinations to learn about popular attractions, restaurants, and hotels.
* Get personalized recommendations for activities and dining based on your interests.

### 🤖 AI Capabilities

* **Itinerary Generation**: Creates personalized trip plans using AI.
* **Location Exploration**: Provides curated information about any destination.
* **Personalized Recommendations**: Suggests activities, restaurants, and accommodations based on user preferences.

---

## 🛠️ Tech Stack

**Frontend:** Next.js, React, Tailwind CSS, shadcn/ui
**AI:** Genkit, Google Gemini
**Platform:** Firebase App Hosting

---

## 🔧 Project Structure

The project uses a standard Next.js App Router structure.

```
root/
 ├── src/
 │   ├── app/                # Next.js pages and layouts
 │   ├── components/         # React components
 │   ├── contexts/           # React context providers
 │   ├── ai/                 # Genkit flows and configuration
 │   ├── lib/                # Utility functions and libraries
 ├── public/               # Static assets
 ├── next.config.ts        # Next.js configuration
 ├── tailwind.config.ts    # Tailwind CSS configuration
 └── README.md
```

---

## 🔥 Local Development

### 1. Prerequisites

* Node.js and npm
* Firebase CLI (for future backend features)

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Create a `.env` file in the root of the project and add your Google AI API key:

```
GEMINI_API_KEY=YOUR_API_KEY
```

### 4. Run the Development Server

The application runs on port 9002.

```bash
npm run dev
```

### 5. Run the Genkit Developer UI

To inspect and test your AI flows, run the Genkit developer UI in a separate terminal:

```bash
npm run genkit:watch
```

This will start the Genkit UI, typically on port 4000.

---

## 📦 Build & Deploy

### Build for Production

```bash
npm run build
```

### Deploy to Firebase App Hosting

This project is configured for deployment to Firebase App Hosting. Ensure you have the Firebase CLI installed and configured.

```bash
firebase deploy --only hosting
```

---

## 🔮 Roadmap

* User authentication with Firebase Auth
* Saving and managing itineraries in Firestore
* Chat-based travel assistant
* Real-time price prediction

---

**Made with ❤️ using Next.js, Firebase + AI**
