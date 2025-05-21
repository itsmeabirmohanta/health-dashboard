# Health Dashboard

A comprehensive health metrics monitoring dashboard that simulates real-time data from wearable devices and visualizes it using interactive charts and various health management tools.

## 🚀 Features

**Core Dashboard & Metrics:**
- **Real-time Health Metrics**: View your heart rate, blood oxygen, steps, sleep, body temperature, and blood pressure (systolic/diastolic).
- **Comprehensive Overview Tab**: Includes quick stats, a detailed `MetricsGrid`, a `HealthGraph` for a selected metric, `DeviceStatusCard`, `HealthTrendCard`, and a `ScheduleCard` showing upcoming activities.
- **New Dashboard Components**:
    - `GoalProgressCard`: Track health and fitness goals.
    - `NutritionSummaryCard`: Log meals and monitor macronutrient intake.
    - `MedicationCard`: Manage medication schedules and log doses.
    - `HydrationTrackerCard`: Monitor water intake against daily targets.
- **Detailed Metrics Page (`/metrics`)**:
    - Select and view individual health metrics with detailed graphs.
    - Time range selection (24h, 7d, 30d, 90d).
    - Responsive graph display.
- **Interactive Data Visualization**: Recharts-based graphs with zoom, toggle, and tooltip features.
- **Wearable Device Simulation**: Automatic generation of realistic health data.
- **Health Alerts**: Warnings when metrics fall outside healthy ranges (conceptual, data generation supports it).

**Application Pages & Functionality:**
- **AI Insights Page (`/ai-insights`)**: Provides mock AI-driven health insights and recommendations.
- **User Profile Page (`/profile`)**: Basic form to update user profile information.
- **Settings Page (`/settings`)**: Configure notification preferences, appearance (theme), account security (mock 2FA, password change), and data/privacy settings.
- **Login & Signup Pages (`/login`, `/signup`)**: Secure user authentication (mock implementation).
- **Messages Page (`/messages`)**: Basic messaging interface with conversation list, chat area, and message input (mock data).
- **Reports Page (`/reports`)**: Generate and view mock health reports with type selection and date range.
- **Schedule Page (`/schedule`)**: Full-page calendar view with event management, allowing adding/editing of appointments and activities.
- **Activity Log Page (`/activity-log`)**: Log and view various health-related activities with filtering and sorting.

**Technical Features:**
- **Responsive Design**: Works on desktop, tablet, and mobile.
- **Dark Mode Support**: Easy on the eyes for nighttime viewing (via Tailwind CSS).
- **Global Stylesheet**: Consolidated common styles in `app/globals.css`.

## 🔧 Tech Stack

- **Frontend**: Next.js 14 with React 18, TypeScript
- **Styling**: Tailwind CSS with dark mode support, `clsx` for conditional classes.
- **Charts**: Recharts for interactive data visualization.
- **State Management**: Zustand for global client-side state.
- **Date Utilities**: `date-fns` for date manipulations.
- **Icons**: `lucide-react` for UI icons.
- **Data Handling**: Custom data generation utilities for mock data.

## 🚀 Getting Started

### Prerequisites

- Node.js 18.0.0 or higher
- npm (comes with Node.js)

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/yourusername/health-dashboard.git
    cd health-dashboard
    ```
    *(Replace `yourusername` with your actual GitHub username after creating the repository)*

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Run the development server:
    ```bash
    npm run dev
    ```

4.  Open [http://localhost:3000](http://localhost:3000) (or the port specified in your console, often 3001 if 3000 is busy) in your browser.

## 📄 Pages & Usage

The application is structured into several key pages:

-   **`/` (Dashboard)**: The main landing page. Provides an overview of all key health metrics and quick access to various tools like schedule, goals, nutrition, medication, and hydration.
-   **`/metrics`**: Dive deeper into individual health metrics. Select a metric and a time range to see detailed historical data visualized in a graph.
-   **`/ai-insights`**: View mock personalized health insights and recommendations based on your data.
-   **`/messages`**: A mock messaging interface for communication (e.g., with a health coach).
-   **`/reports`**: Generate and view mock health reports (e.g., weekly summaries, specific metric trends).
-   **`/schedule`**: A full calendar view to manage appointments, workouts, and other scheduled events.
-   **`/activity-log`**: Keep a log of various activities like workouts, meals, or symptoms.
-   **`/profile`**: Manage your user profile information.
-   **`/settings`**: Customize application settings, including notifications, appearance, and data privacy.
-   **`/login`**: User login page (mock functionality).
-   **`/signup`**: User registration page (mock functionality).

## 🔄 Data Simulation

The dashboard uses simulated data to mimic real wearable devices and user inputs. This is located primarily in `app/store/healthDataSets.ts` and `app/store/mockDashboardData.ts`. In a production environment, this would be replaced with API calls to actual health platforms and backend services.

## 🛣️ Roadmap (Potential Future Enhancements)

-   [ ] Full backend integration with a database.
-   [ ] Real user authentication and authorization.
-   [ ] Persistent storage for user data, goals, schedule, etc.
-   [ ] Exportable health reports (PDF, CSV).
-   [ ] Integration with real wearable device APIs (e.g., Fitbit, Apple Health, Google Fit).
-   [ ] Real-time notifications (in-app and potentially push notifications).
-   [ ] More advanced AI insights and predictive analytics.
-   [ ] I18n and localization support.
-   [ ] Comprehensive testing suite (unit, integration, e2e).

## 📄 License

This project is licensed under the MIT License. (You might want to create a `LICENSE` file with the MIT license text if one doesn't exist).
