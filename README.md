# Safety Event Management System

A client-side web application for managing and reporting safety events, built with React and TypeScript.

## Overview

This application provides tools for managing safety-related events. It includes:

- A set of statistic cards showing key information such as total reports
- A dashboard that lists all safety events with search and filtering options
- A guided multi-step form for creating new event reports
- A detailed single-event view, including edit options for authorized users

## Technologies Used

- **React** – Front-end library for building the user interface
- **TypeScript** – Adds static typing for improved reliability
- **Material UI (MUI)** – Component library used for layout and styling
- **React Router** – Handles client-side navigation between pages
- **Vite** – Development server and build tool for fast project setup

## Getting Started

### Prerequisites

Make sure you have **Node.js** installed.  
It can be downloaded from the official website: https://nodejs.org/

### Installation

Install all required dependencies:

```bash
npm install
```

### Running the Application

Start the development server:

```bash
npm run dev
```

The application should open at `http://localhost:5173`.

### Building for Production

Generate an optimized production build:

```bash
npm run build
```

### Additional Commands

- **npm run lint** – Run code quality checks
- **npm run preview** – Preview the production build locally

## Project Structure

- **src/pages/** – Main application pages (Dashboard, Event List, Event Form, Single Event)
- **src/components/** – Reusable UI components used across the app
- **src/layout/** – Layout components such as the Sidebar and TopBar
- **src/types/** – TypeScript type definitions
- **src/context/** – React Context for managing shared state (e.g., form data)
- **src/utils/** – Utility and helper functions
- **src/theme/** – Theme configuration, including dark mode and RTL support

## Features

- **Statistic Cards** – Display key safety-related metrics such as total reports
- **Dashboard** – Table view of all safety events with search and filter options
- **Multi-Step Event Form** – Guided form for submitting new event reports
- **Single Event View** – View full event details, with edit options for authorized users
- **Dark Mode** – Built-in light/dark theme support
- **RTL Support** – Optimized layout and typography for right-to-left languages like Hebrew

## Notes

- The application currently uses mock data for event records
- Form state is managed using React Context
- RTL and Hebrew support are built into the UI
