# 📱 Smart College Event Management System

A **professional, enterprise-grade React Native** application for managing college events, built with **Expo** and **TypeScript**.

---

## 🚀 Getting Started

### Prerequisites
Make sure you have **Node.js** (v18+) and **npm** installed.
- Download from: https://nodejs.org/

### Installation & Run

```bash
# 1. Open terminal in this directory
cd "/Users/kaveen/Documents/Clg event"

# 2. Install all dependencies
npm install

# 3. Start the development server
npx expo start

# 4. On your phone, install "Expo Go" (iOS/Android) and scan the QR code
# Or press 'w' to open in web browser
```

---

## 🔐 Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| **Student** | student@college.edu | student123 |
| **Admin** | admin@college.edu | admin123 |

---

## 📁 Project Structure

```
├── app/                    # All screens (Expo Router)
│   ├── (auth)/             # Login & Register
│   ├── (student)/          # 5-tab student app (Home, Events, Dashboard, Notifications, Profile)
│   ├── (admin)/            # Admin screens (Dashboard, Create Event, QR Attendance)
│   └── event/[id].tsx      # Event Details with Registration
├── components/             # Reusable UI components
│   ├── ui/                 # Button, Card, Badge, SearchBar, CountdownTimer
│   └── events/             # EventCard, CategoryChip
├── context/                # Global state (Auth, Events, Notifications)
├── data/                   # TypeScript types + Rich mock data (10 events, 5 users)
└── constants/              # Colors.ts, Theme.ts (Design system)
```

---

## ✨ Features

### Student Features
- 🏠 **Home** — Hero banner, stats, featured events carousel, quick links
- 📅 **Event Listing** — Search, filter by category/status/sort
- 📋 **Event Details** — Countdown timer, registration modal, organizer info
- 🎓 **Dashboard** — Registered events, reminders, certificates, badges
- 🔔 **Notifications** — Grouped Today/Earlier, unread badges, mark all read
- 👤 **Profile** — Edit info, participation history, achievement badges, settings

### Admin Features
- 📊 **Dashboard** — Metrics, bar chart by category, event table, registration list
- ✏️ **Create/Edit Event** — Full form with category picker, validation, featured toggle
- 📷 **QR Attendance** — Event selector, QR scanner UI, attendance stats, manual mark

### Core
- 🔒 Role-based auth (Student / Admin)
- 🎨 Light Blue (#4DA6FF) premium design system
- ⚡ Context API state management
- 📱 Expo Router file-based navigation
- 💯 TypeScript throughout

---

## 🎨 Design System

| Token | Value |
|-------|-------|
| Primary | `#4DA6FF` |
| Primary Dark | `#2E8FE8` |
| Background | `#F5F8FF` |
| Text Primary | `#1A2340` |
| Card Shadow | Light Blue tinted |

---

## 📦 Key Dependencies

- `expo` ~51.0.0
- `expo-router` ~3.5.0
- `expo-linear-gradient` ~13.0.2
- `react-native-reanimated` ~3.10.1
- `@expo/vector-icons` ^14.0.2
- `expo-barcode-scanner` ~13.0.1
