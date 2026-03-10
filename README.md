# Sprint Capacity Calculator

A React-based web application for calculating team development capacity during sprint planning.

## Features

- Calculate individual and team capacity
- Account for annual leave and meetings
- Convert capacity to story points
- Export capacity data as CSV
- Offline-first with localStorage persistence
- Mobile-responsive design
- Real-time capacity recalculation

## Getting Started

### Prerequisites

- Node.js 16+ and npm/yarn

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

The application will open at `http://localhost:5173`

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Technology Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Vite** - Build tool
- **React Context API** - State management

## Project Structure

```
src/
├── components/     # React components
├── hooks/          # Custom React hooks
├── utils/          # Utility functions
├── context/        # React Context setup
├── types/          # TypeScript type definitions
├── constants/      # Application constants
├── App.tsx         # Root component
├── main.tsx        # Entry point
└── index.css       # Global styles
```

## Requirements

See `requirements.md` for detailed feature requirements.

## Design

See `design.md` for architecture and design decisions.
