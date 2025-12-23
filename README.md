# Spotistics 🎵

Spotistics is a modern React application that allows users to analyze their Spotify music taste, view their profile, and discover insights into their listening habits. It features a secure, premium user interface and adheres to the latest Spotify security standards.

![Status](https://img.shields.io/badge/status-active-success.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)

## ✨ Features

- **Secure Authentication**: Implements **Authorization Code Flow with PKCE** (Proof Key for Code Exchange), replacing the deprecated Implicit Grant flow.
- **Compliance**: Fully compliant with Spotify's 2025 security requirements (No `localhost` redirect URIs, secure token exchange).
- **User Profile**: Displays detailed user information including profile picture, followers, plan type (Premium/Free), and country.
- **Premium UI**: Uses a glassmorphism-inspired design with responsive layouts using Bootstrap.
- **Auto-Redirect**: Smart routing that automatically redirects logged-in users to their dashboard.
- **Error Handling**: Robust error handling for network issues, missing configuration, and authentication failures.

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- A Spotify Developer Account

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/yourusername/spotistics.git
    cd spotistics
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

3.  **Configure Environment Variables**
    Create a `.env` file in the root directory based on `.env.example`:
    ```bash
    cp .env.example .env
    ```
    
    Update `.env` with your Spotify Client ID:
    ```env
    REACT_APP_CLIENT_ID=your_spotify_client_id_here
    REACT_APP_REDIRECT_URI=http://127.0.0.1:3000
    ```

4.  **Spotify Dashboard Setup**
    - Go to your [Spotify Developer Dashboard](https://developer.spotify.com/dashboard).
    - Create an App or select an existing one.
    - Go to **Settings** -> **Edit**.
    - Add `http://127.0.0.1:3000` to the **Redirect URIs** whitelist.
    - Click **Save**.

### Running the App

Start the development server:

```bash
npm start
```

Open [http://127.0.0.1:3000](http://127.0.0.1:3000) in your browser.

> **Note**: Do not use `localhost:3000` as the Redirect URI in your browser, as Spotify specifically requires the explicit loopback IP `127.0.0.1` for security.

## 🛠️ Technology Stack

- **Frontend**: React.js (Create React App), React Router v6
- **Styling**: Bootstrap 5, CSS3 Custom Properties
- **Authentication**: OAuth 2.0 with PKCE via `spotifyAuth.js` helper module.
- **State Management**: React Hooks (`useState`, `useEffect`, `useCallback`)

## 🤝 Contributing

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
