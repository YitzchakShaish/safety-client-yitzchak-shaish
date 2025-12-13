# Safety Event Management System - Client

A web application for managing and reporting safety events. Built with React and TypeScript.

## What This Application Does

This is the client-side (frontend) part of a safety event management system. It allows users to:

- View statistics and overview of safety events
- Create new safety event reports with a multi-step form
- View and manage all safety events in a table
- View detailed information about a single event
- Edit and delete events (based on user permissions)
- Upload images for event reports
- Manage user profile and view statistics
- Login and signup to access the system

## Technologies Used

- **React** - Frontend library for building the user interface
- **TypeScript** - Adds type checking for better code quality
- **Material UI (MUI)** - Component library for UI elements and styling
- **React Router** - Handles navigation between pages
- **Vite** - Fast development server and build tool
- **Fetch API** - Makes HTTP requests to the backend server

## Getting Started

### What You Need

You need **Node.js** installed on your computer.  
Download it from: https://nodejs.org/

### Installation

1. Open a terminal in the `safety-client-yitzchak-shaish` folder
2. Install all required packages:

```bash
npm install
```

### Running the Application

**Important:** The backend server must be running first!

1. Make sure the backend server is running on `http://localhost:3000`
2. Start the client application:

```bash
npm run dev
```

3. The application will open in your browser at `http://localhost:5173`

### Building for Production

To create a production-ready version:

```bash
npm run build
```

### Other Commands

- **npm run lint** - Check code for errors and style issues
- **npm run preview** - Preview the production build locally

## Project Structure

- **src/pages/** - Main pages:
  - `HomePage.tsx` - Overview page with statistics cards
  - `EventsDashboard.tsx` - Table view of all events
  - `EventEntry.tsx` - Form for creating new events
  - `SingleEventPage.tsx` - Detailed view of one event
  - `UserProfilePage.tsx` - User profile and statistics
  - `LoginSignupPage.tsx` - Login and registration

- **src/components/** - Reusable UI components
  - `common/` - Common components like buttons and cards
  - `eventForm/` - Form components for event entry
  - `eventsTable/` - Table components for displaying events
  - `singeleEvent/` - Components for single event view

- **src/layout/** - Layout components
  - `Layout.tsx` - Main layout wrapper
  - `SideBar.tsx` - Navigation sidebar
  - `TopBar.tsx` - Top navigation bar
  - `UserProfileCard.tsx` - User profile card in sidebar

- **src/api/** - Functions for communicating with the backend
  - `auth.api.ts` - Login and signup
  - `eventReport.api.ts` - Create, read, update, delete events
  - `eventReportImages.api.ts` - Upload images for events
  - `overview.api.ts` - Get statistics and overview data

- **src/context/** - React Context for shared state
  - `UserContext.tsx` - Current user information
  - `EventFormContext.tsx` - Form data when creating events

- **src/hooks/** - Custom React hooks
  - `useUser.ts` - Access user data
  - `useEventForm.ts` - Manage event form state

- **src/types/** - TypeScript type definitions

- **src/utils/** - Helper functions
  - `storage.ts` - Browser storage operations
  - `validate.ts` - Form validation
  - `filterEvents.ts` - Event filtering logic

- **src/permissions/** - Permission system
  - `getPermissionLevel.ts` - Determines user permission level based on rank
  - `editableFields.ts` - Which fields can be edited by each permission level

- **src/theme/** - Theme configuration
  - `ThemeContext.tsx` - Dark mode and theme management
  - `theme.ts` - Theme settings

- **src/styles/** - Styling files

## Main Features

### User Authentication
- Login and signup pages
- JWT token-based authentication
- Protected routes (redirects to login if not authenticated)
- User information stored in browser storage

### Overview Page (Home)
- Welcome message with user's name
- Statistics cards showing:
  - Total event reports
  - Events by status
  - Other key metrics

### Event Management
- **Create Events**: Multi-step form to create new safety event reports
- **View All Events**: Table with search, filter, and pagination
- **View Single Event**: Detailed view of one event with all information
- **Edit Events**: Edit event details (permission-based)
- **Delete Events**: Delete events (permission-based)
- **Upload Images**: Attach images to event reports

### User Profile
- View user information
- Upload profile picture
- View user statistics (reports created, updated, deleted)

### Permission System
The system uses a rank-based permission system:
- **Basic** (טוראי, טוראי ראשון): Can create and view events
- **Advanced** (סמל, סמל ראשון, רב סמל): Can edit more fields
- **Admin** (סרן and above): Full access to all fields

### Additional Features
- **Dark Mode**: Toggle between light and dark themes
- **RTL Support**: Right-to-left layout for Hebrew
- **Responsive Design**: Works on different screen sizes

## Important Notes

- The client connects to the backend at `http://localhost:3000`
- Authentication tokens are stored in browser storage
- All API requests include authentication tokens
- The app uses protected routes - you must be logged in to access most pages
- Form data is saved in React Context while filling out multi-step forms
- Images are uploaded separately after creating an event report
