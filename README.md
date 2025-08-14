# VI-Predict - Football Prediction Platform

A modern, responsive football prediction platform built with React, TypeScript, and Tailwind CSS.

## Features

- **User Authentication**: Sign up, sign in, forgot password, and Google OAuth
- **Prediction System**: Make match predictions with banker picks for double points
- **League Management**: Create and join public/private leagues
- **Real-time Scoring**: Track your performance with detailed statistics
- **Responsive Design**: Optimized for desktop and mobile devices
- **Modern UI**: Clean, professional design with smooth animations

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS
- **Authentication**: Supabase Auth
- **Database**: Supabase (PostgreSQL)
- **State Management**: React Query
- **Routing**: React Router
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd vi-predict
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

4. Update `.env` with your Supabase credentials:
```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

5. Start the development server:
```bash
npm run dev
```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   └── Layout/         # Layout components (Header, Sidebar, etc.)
├── hooks/              # Custom React hooks
├── lib/                # Utility functions and configurations
├── pages/              # Page components
│   ├── Auth/          # Authentication pages
│   └── ...            # Other pages
├── types/              # TypeScript type definitions
└── App.tsx            # Main application component
```

## Key Features

### Authentication
- Email/password authentication
- Google OAuth integration
- Password reset functionality
- Protected routes

### Prediction System
- Weekly gameweek predictions
- Banker picks for double points
- Real-time deadline tracking
- Score calculation system

### League Management
- Create public/private leagues
- Join leagues with invite codes
- Multiple league types (Global, Country, Club)
- Real-time leaderboards

### User Dashboard
- Personal statistics and performance
- Hot/cold teams analysis
- Recent gameweek history
- Responsive data visualization

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.