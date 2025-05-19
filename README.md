# Health Dashboard

A comprehensive health metrics monitoring dashboard that simulates real-time data from wearable devices and visualizes it using interactive charts.

![Health Dashboard Screenshot](./docs/screenshot.png)

## 🚀 Features

- **Real-time Health Metrics**: View your heart rate, blood oxygen, steps, sleep, and more
- **Interactive Data Visualization**: Recharts-based graphs with zoom, toggle, and tooltip features
- **Historical Data Analysis**: View trends over different time ranges (24h, 7d, 30d, 90d)
- **Wearable Device Simulation**: Automatic generation of realistic health data
- **Health Alerts**: Warnings when metrics fall outside healthy ranges
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Dark Mode Support**: Easy on the eyes for nighttime viewing

## 🔧 Tech Stack

- **Frontend**: Next.js 14 with React 18, TypeScript
- **Styling**: Tailwind CSS with dark mode support
- **Charts**: Recharts for interactive data visualization
- **State Management**: Zustand for simple, efficient state
- **Data Handling**: Custom data generation utilities

## 🚀 Getting Started

### Prerequisites

- Node.js 18.0.0 or higher
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/health-dashboard.git
   cd health-dashboard
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📱 Usage

- **Dashboard**: View all health metrics at a glance
- **Metrics**: Detailed view of individual health metrics
- **Analytics**: Advanced analytics and historical trends
- **Settings**: Configure thresholds, units, and sync intervals

## 🔄 Data Simulation

The dashboard uses simulated data to mimic real wearable devices. In a production environment, this would be replaced with API calls to actual wearable device platforms like Fitbit, Apple Health, or Google Fit.

## 📋 Roadmap

- [ ] User authentication
- [ ] Exportable health reports
- [ ] Additional health metrics
- [ ] Integration with real wearable APIs
- [ ] Mobile app with notifications

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
