# Room Selection App - HomeSlice

## Introduction

HomeSlice is a modern web application designed to streamline the process of room selection and auction management for organizations, universities, or housing communities. The app allows users to view available rooms, participate in auctions, and manage room assignments in real time. Built with React, TypeScript, and Firebase, it provides a responsive and intuitive user experience across devices.

## Features

- Real-time room and auction state management using Firebase Realtime Database
- Secure authentication and data access
- Responsive UI for desktop and mobile
- Easy deployment and scalability with Firebase Hosting and Functions

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm (v9 or higher recommended)
- Firebase CLI (`npm install -g firebase-tools`)

### Installation

1. **Clone the repository:**
    ```sh
    git clone https://github.com/<your-username>/room-selection-app.git
    cd room-selection-app
    ```

2. **Install dependencies:**
    ```sh
    npm install
    ```

3. **Set up environment variables:**
    - Create a `.env.local` file in the project root.
    - Add your Firebase project credentials:
      ```env
      VITE_FIREBASE_API_KEY=your-api-key
      VITE_FIREBASE_AUTH_DOMAIN=your-auth-domain
      VITE_FIREBASE_PROJECT_ID=your-project-id
      VITE_FIREBASE_STORAGE_BUCKET=your-storage-bucket
      VITE_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
      VITE_FIREBASE_APP_ID=your-app-id
      VITE_FIREBASE_MEASUREMENT_ID=your-measurement-id
      VITE_FIREBASE_DATABASE_URL=your-database-url
      ```

### Running the App Locally

```sh
npm run dev
```

### Deployment

1. **Build the app:**

    ```sh
    npm run build
    ```

2. **Deploy to Firebase:**

    ```sh
    firebase deploy
    ```
