# DriveDesk OS

> A premium, mobile-first Fleet Management & Rental Operations Platform built for modern car rental businesses. 

DriveDesk OS is a comprehensive, production-ready React Native application designed for owner-operators and booking agents to manage their fleet, track real-time analytics, and process vehicle checkouts smoothly through an interactive step-by-step wizard.

---

## Visual Walkthrough & Features

*Note: You can view screenshots of the app screens in action below. (To update the screenshots, drop your PNG images named `01_login.png` to `11_analytics.png` into the `drivedesk-app/assets/screenshots/` folder).*

### Core Management & Analytics
Showcasing the login screen, clean dashboard metrics, and real-time vehicle lists.

| Login Screen | Owner Dashboard | Fleet Directory |
| :---: | :---: | :---: |
| ![Login](./drivedesk-app/assets/screenshots/01_login.png) | ![Dashboard](./drivedesk-app/assets/screenshots/02_dashboard.png) | ![Fleet](./drivedesk-app/assets/screenshots/03_fleet.png) |

---

### Step-by-Step Booking & Checkout Operations Flow
The core operational workflow, walking users through viewing specifications, vehicle selection, document uploads, physical inspections, agreement signing, and payment processing.

| Vehicle Specifications | Step 1: Customer Selection | Step 2: Verify Credentials |
| :---: | :---: | :---: |
| ![Vehicle Specs](./drivedesk-app/assets/screenshots/04_vehicle_detail.png) | ![Step 1](./drivedesk-app/assets/screenshots/05_booking_step1.png) | ![Step 2](./drivedesk-app/assets/screenshots/06_booking_step2.png) |

| Step 3: Inspection Grid | Step 4: Digital Contract | Step 5: Process Payment |
| :---: | :---: | :---: |
| ![Step 3](./drivedesk-app/assets/screenshots/07_booking_step3.png) | ![Step 4](./drivedesk-app/assets/screenshots/08_booking_step4.png) | ![Step 5](./drivedesk-app/assets/screenshots/09_booking_step5.png) |

---

### Bookings Log & Reports Graph

| Bookings Log List | Reports & Revenue Trend Graph |
| :---: | :---: |
| ![Bookings Log](./drivedesk-app/assets/screenshots/10_bookings_log.png) | ![Reports](./drivedesk-app/assets/screenshots/11_analytics.png) |

---

## Technical Stack & Architecture

*   **Framework:** [Expo](https://expo.dev) (React Native managed workflow) with **Expo Router** (File-based routing).
*   **Language:** TypeScript (Strict type safety across store databases, UI states, and navigation params).
*   **State Management:** [Zustand](https://github.com/pmndrs/zustand) (A lightweight reactive state store maintaining vehicle statuses, bookings, customer document states, and business metrics).
*   **Styling & Theme:** **NativeWind** (TailwindCSS integration for React Native) to achieve glassmorphism, modern dark slate typography, and consistent spacing tokens.
*   **Vector Graphics:** **React Native SVG** for rendering premium data visualization charts, dashboard graphs, and custom-designed vectors.
*   **Icons:** Expo Vector Icons (Feather package).

---

## How to Start the App Locally

### 1. Prerequisites
Ensure you have Node.js and the Android/iOS development environments configured.

### 2. Install Dependencies
Navigate to the `drivedesk-app` directory and run:
```bash
cd drivedesk-app
npm install
```

### 3. Start the Development Server
Launch the Expo CLI packager:
```bash
npx expo start
```

*   **Expo Go:** Scan the QR code displayed in the terminal using your phone's camera (iOS) or the Expo Go App (Android). Make sure both devices are on the same Wi-Fi network.
*   **USB Physical Device Debugging:** To compile and run directly on a physical phone connected over USB, ensure USB Debugging is turned on in Developer Options, and run:
    ```bash
    npx expo run:android
    ```

### 4. Build Standalone Release APK
To compile a native release APK locally:
```cmd
cd android
.\gradlew assembleRelease
```
The output file will be located at:
`drivedesk-app/android/app/build/outputs/apk/release/app-release.apk`
