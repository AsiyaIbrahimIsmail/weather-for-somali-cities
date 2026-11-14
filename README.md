# 🌤️ Weather for Somali Cities

A modern, interactive weather web application that displays real-time weather data and 5-day forecasts for major Somali cities. Built with vanilla JavaScript, the app features a dynamic glassmorphism UI with animated backgrounds and full dark mode support.

## ✨ Features

- **Real-time Weather** — Current temperature, feels-like, humidity, wind speed, and atmospheric pressure via the OpenWeatherMap API
- **5-Day Forecast** — Daily temperature averages with weather condition icons
- **8 Somali Cities** — Mogadishu, Hargeisa, Kismayo, Baidoa, Garowe, Dhusamareb, Beledweyne, and Jijiga
- **User Accounts** — Register and log in (credentials saved in browser localStorage)
- **Dark / Light Mode** — Toggle with a persistent theme preference
- **Interactive UI** — Animated floating clouds, glassmorphism cards, smooth transitions, hover effects
- **Responsive** — Works on desktop, tablet, and mobile
- **Toast Notifications** — Slide-in alerts for success, error, and info messages
- **Back to Top** — Floating button appears on scroll

## 🛠️ Technologies

| Technology | Purpose |
|---|---|
| **HTML5** | Semantic page structure, forms, accessibility attributes |
| **CSS3** | Glassmorphism (`backdrop-filter`), CSS Grid/Flexbox, custom properties, keyframe animations, dark mode |
| **JavaScript (ES6+)** | Async/await API calls, DOM manipulation, localStorage, form validation, event handling |
| **Font Awesome** | Weather icons, UI icons (free tier) |
| **Google Fonts (Inter)** | Typography |
| **OpenWeatherMap API** | Real-time weather data and 5-day forecast |

## 🔧 How It Works

1. **Select a city** from the dropdown (Mogadishu, Hargeisa, etc.)
2. Click **Get Weather** to see current conditions, or **5-Day Forecast** for the outlook
3. The app fetches data from `api.openweathermap.org` and displays it in glass cards with animated icons
4. **Create an account** via Sign Up (credentials stored in your browser's localStorage)
5. **Log in** to see your username in the navbar with a logout button
6. Toggle **dark/light mode** with the moon/sun button (preference saved)

## 🚀 Getting Started

No build tools required — open any HTML file directly in a browser:

```
index.html      — Main weather dashboard
log-in.html     — Login page
sign-up.html    — Registration page
```

All assets (CSS, JavaScript, images) are organized in `css/`, `js/`, and `images/` folders.

## 🌐 API Reference

This app uses the [OpenWeatherMap](https://openweathermap.org/api) free tier:

- **Current weather:** `GET /data/2.5/weather?q={city}&units=metric&appid={key}`
- **5-day forecast:** `GET /data/2.5/forecast?q={city}&units=metric&appid={key}`

Before using the app, add your OpenWeatherMap API key to `js/config.local.js`. This local file is ignored by Git; use `js/config.example.js` as a template. Never commit your real key. Browser code is public, so use a backend proxy to protect the key in production.
