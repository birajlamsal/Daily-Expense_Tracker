# Daily Expense Tracker

A cross‑platform (iOS/Android) React Native app to log expenses, enforce daily/monthly spending limits, and generate reports with category breakdowns.

## Features
- Rolling daily allowance with carry-over inside the month.
- Expense logging with amount, date, category, payment method, and optional description.
- Automatic balance updates after every entry.
- Weekly, monthly, and daily spending reports.
- Category‑wise breakdown with charts.
- Alerts when approaching limits and when limits are exceeded.
- Optional PIN lock and daily reminder notification.
- Local data persistence with AsyncStorage.

## Getting Started
1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the app:
   ```bash
   npm run start
   ```


## Assumptions
- The app uses Expo SDK 54 and local device storage (AsyncStorage). Cloud sync is not implemented.
- Date input is a simple `YYYY-MM-DD` text field to avoid additional picker dependencies.
- Notifications are scheduled as a daily 9:00 AM reminder using Expo Notifications. If permissions are denied, reminders are skipped.
- Daily allowance defaults to Rs. 500 and carries over within a month; it resets to Rs. 500 at a new month.
- Charts use `react-native-chart-kit`; render sizes are based on device width.
- On first run, the app seeds one year of demo expenses if no data exists.
- Export/Import uses JSON with a version header, settings, and expense list.

## Project Structure
- `App.js` – App entry and navigation.
- `src/contexts` – Expense state and logic.
- `src/screens` – Main screens (Home, Add, Reports, Settings, Lock).
- `src/components` – Reusable UI components and charts.
- `src/data` – Defaults and storage helpers.
- `src/utils` – Date utilities.
