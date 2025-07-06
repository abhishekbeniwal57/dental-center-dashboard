# Dental Center Management Dashboard

A comprehensive dashboard application for dental centers to manage patients, appointments, and records. This frontend-only application simulates a fully functional dental center management system with role-based access control, localStorage-based data persistence, and responsive design.

## Features

- **Role-based Access Control**

  - Admin: Full access to all features and data
  - Patient: Access to own profile and appointments only

- **Admin Features**

  - Dashboard with key statistics and information
  - Patient management (add, edit, view, delete)
  - Appointment scheduling and management
  - Calendar view of appointments
  - File upload and management for patient records

- **Patient Features**

  - View personal profile information
  - Access personal medical history
  - View upcoming and past appointments
  - Access uploaded files/documents

- **Technical Features**
  - Responsive design for mobile and desktop
  - Data persistence using localStorage
  - File uploads stored as base64 data
  - Form validation
  - Modern UI with TailwindCSS

## Demo Accounts

The application comes with pre-configured demo accounts for testing:

- **Admin Account**

  - Email: admin@dental.com
  - Password: admin123

- **Patient Accounts**
  - Email: patient1@example.com
  - Password: patient123
  - Email: patient2@example.com
  - Password: patient123

## Technologies Used

- React 19 (Functional Components and Hooks)
- React Router v7 for navigation
- Context API for state management
- TailwindCSS for styling
- UUID for generating unique IDs

## Getting Started

### Prerequisites

- Node.js (v16+ recommended)
- npm or yarn

### Installation

1. Clone the repository

   ```bash
   git clone <repository-url>
   cd dental-center-dashboard
   ```

2. Install dependencies

   ```bash
   npm install
   ```

3. Start the development server

   ```bash
   npm start
   ```

4. Open your browser and navigate to http://localhost:3000

## Challenges and Solutions

### Calendar Implementation

**Challenge**: Creating an interactive calendar with both month and week views that properly updates when switching between views.

**Solution**: Implemented separate useEffect hooks for month and week views with proper dependencies. Added a specialized view mode change handler that forces calendar regeneration when switching views by temporarily changing state values.

### File Upload and Management

**Challenge**: Implementing file upload, storage, and viewing capabilities without a backend.

**Solution**: Created a robust file handling system using FileReader API to convert files to base64 strings for storage in localStorage. Implemented a dedicated utility function (viewFile) that safely converts stored data back to viewable files.

### Role-Based Navigation and Access Control

**Challenge**: Creating distinct experiences for admin and patient users while maintaining security.

**Solution**: Implemented a robust authentication context that controls access to routes and UI elements based on user role. Used conditional rendering and protected routes to ensure users can only access appropriate sections.

### Responsive Design for Complex UI

**Challenge**: Making complex UI components like the calendar, appointment details, and file uploads work well on mobile devices.

**Solution**: Used Tailwind's responsive utilities to create layouts that adapt to different screen sizes. Implemented mobile-specific UI patterns and tested extensively on various device sizes.

## Project Architecture

### Component Structure

The application follows a component-based architecture with the following key elements:

- **Context Providers**:

  - `AuthContext`: Manages authentication state, login/logout functionality, and role-based access control
  - `DataContext`: Handles data operations for patients, appointments, and file uploads with localStorage persistence

- **Core Components**:

  - `Layout`: Main layout component with responsive sidebar navigation based on user role
  - `Card`: Reusable container component for content sections with consistent styling
  - `Button`: Customizable button component with different variants and sizes
  - `FormInput`: Form input component with built-in validation support

- **Page Structure**:
  - Admin pages: Dashboard, Patients, PatientDetails, Appointments, AppointmentDetails, Calendar
  - Patient pages: MyProfile, MyAppointments
  - Shared: Login

### Data Flow

1. User authenticates via the Login screen
2. AuthContext verifies credentials and establishes user role (Admin/Patient)
3. Based on role, appropriate navigation and pages are displayed
4. DataContext provides methods to interact with patient and appointment data
5. All data changes are immediately persisted to localStorage
6. File uploads are converted to base64 and stored with their respective entities

## Technical Decisions

### Why Context API over Redux

The application uses React Context API for state management instead of Redux for several reasons:

- **Reduced Complexity**: Context API provides a simpler implementation for the scope of this application
- **Built-in Solution**: No additional libraries required, reducing bundle size
- **Sufficient for Needs**: The app's state requirements aren't complex enough to warrant Redux
- **Modern React Pattern**: Aligns with current React best practices for state management

### LocalStorage for Data Persistence

Since this is a frontend-only application, localStorage was chosen for data persistence:

- **No Backend Required**: Allows full functionality without server implementation
- **Persistent Between Sessions**: Data remains available when users return to the application
- **Simple Implementation**: Easy to implement and debug
- **Demo-Friendly**: Perfect for showcasing application capabilities

### File Upload Strategy

Files are handled as base64-encoded strings stored in localStorage:

- **Frontend-Only Solution**: Allows file upload/download without a backend
- **Seamless Experience**: Users can upload and view files without disruption
- **Preview Capability**: Files can be previewed directly in the application
- **Association**: Files can be linked to both patients and appointments

### Responsive Design Approach

The application is fully responsive using Tailwind CSS:

- **Mobile-First Design**: Designed to work on mobile devices first, then enhanced for larger screens
- **Collapsible Sidebar**: Navigation collapses to a hamburger menu on smaller screens
- **Flexible Layouts**: Card and form components adapt to available screen space
- **Consistent Experience**: Core functionality available regardless of device size

## Deployment

To create a production build:

```bash
npm run build
```

This will create a `build` folder with optimized production files that can be deployed to any static hosting service like Netlify, Vercel, GitHub Pages, or AWS S3.

### Simple Deployment with `serve`

You can quickly test the production build locally:

1. Install serve globally (if not already installed)

   ```bash
   npm install -g serve
   ```

2. Serve the production build

   ```bash
   serve -s build
   ```

3. Open your browser and navigate to the URL shown in the terminal (usually http://localhost:3000)

### Deploying to Netlify

1. Create an account on [Netlify](https://www.netlify.com/)
2. From the Netlify dashboard, click "New site from Git"
3. Connect your GitHub/GitLab/Bitbucket account
4. Select your repository
5. Set the build command to `npm run build`
6. Set the publish directory to `build`
7. Click "Deploy site"

### Deploying to GitHub Pages

1. Add homepage to package.json:

   ```json
   "homepage": "https://yourusername.github.io/dental-center-dashboard"
   ```

2. Install gh-pages:

   ```bash
   npm install --save-dev gh-pages
   ```

3. Add deploy scripts to package.json:

   ```json
   "scripts": {
     "predeploy": "npm run build",
     "deploy": "gh-pages -d build",
     // ...other scripts
   }
   ```

4. Deploy:
   ```bash
   npm run deploy
   ```

## Next Steps

- Implement dark mode theme support
- Add multi-language support
- Integrate with PDF generation for reports
- Add appointment reminders and notifications
- Enhance the calendar view with more features
- Implement data export/import functionality
- Add more detailed analytics for admin dashboard

## Project Structure

```
dental-center-dashboard/
├── public/                  # Public assets
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── Button.js        # Button component with variants
│   │   ├── Card.js          # Card container component
│   │   ├── FormInput.js     # Form input with validation
│   │   └── Layout.js        # Main layout with sidebar
│   ├── context/             # React Context providers
│   │   ├── AuthContext.js   # Authentication and user management
│   │   └── DataContext.js   # Data operations and persistence
│   ├── pages/               # Application pages
│   │   ├── Login.js         # Authentication page
│   │   ├── Dashboard.js     # Admin dashboard with KPIs
│   │   ├── Patients.js      # Patient listing and management
│   │   ├── PatientDetails.js # Individual patient view/edit
│   │   ├── Appointments.js  # Appointment listing
│   │   ├── AppointmentDetails.js # Individual appointment view/edit
│   │   ├── Calendar.js      # Calendar view with month/week modes
│   │   ├── MyProfile.js     # Patient profile view
│   │   └── MyAppointments.js # Patient appointment view
│   ├── utils/               # Utility functions
│   │   └── fileUtils.js     # File handling utilities
│   ├── App.js               # Main application component with routing
│   └── index.js             # Application entry point
├── package.json
├── tailwind.config.js       # Tailwind configuration
├── postcss.config.js        # PostCSS configuration
└── README.md
```

## License

This project is licensed under the MIT License.

