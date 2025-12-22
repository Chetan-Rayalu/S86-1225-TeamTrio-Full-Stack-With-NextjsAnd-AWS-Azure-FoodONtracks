# Page Routing and Dynamic Routes Documentation

## Overview

This document outlines the complete routing structure implemented in FoodONtracks using Next.js 13+ App Router. The routing system supports public pages, protected routes, and dynamic parameters for a scalable food traceability platform.

## Route Architecture

### Route Map

```
app/
├── page.tsx                    → / (Home - public)
├── login/
│   └── page.tsx               → /login (Public)
├── dashboard/
│   └── page.tsx               → /dashboard (Protected)
├── users/
│   ├── page.tsx               → /users (Protected - list all users)
│   └── [id]/
│       └── page.tsx           → /users/[id] (Protected - dynamic user profile)
├── layout.tsx                 → Global layout with navigation
├── not-found.tsx              → Custom 404 error page
└── middleware.ts              → Auth middleware for protected routes
```

## Route Descriptions

### Public Routes (Accessible to Everyone)

#### 1. **Home Page** (`/`)
- **File**: `app/page.tsx`
- **Purpose**: Landing page for the application
- **Features**:
  - Welcome message
  - Links to login and dashboard
  - No authentication required

#### 2. **Login Page** (`/login`)
- **File**: `app/login/page.tsx`
- **Purpose**: User authentication
- **Features**:
  - Email and password input form
  - Form validation
  - Error handling and display
  - Redirects to dashboard on successful login
  - Stores JWT token in HTTP-only cookie

### Protected Routes (Requires Authentication)

#### 3. **Dashboard** (`/dashboard`)
- **File**: `app/dashboard/page.tsx`
- **Purpose**: Protected user dashboard
- **Access**: Requires valid JWT token in cookies
- **Features**:
  - Success indicator showing authentication status
  - Links to user profiles
  - Navigation to users list
- **Redirect**: Users without valid token are redirected to `/login`

#### 4. **Users List** (`/users`)
- **File**: `app/users/page.tsx`
- **Purpose**: Display all users in a table format
- **Access**: Requires valid JWT token
- **Features**:
  - Responsive data table
  - User information display (ID, Name, Email, Role)
  - Link to individual user profiles
  - Back navigation to dashboard

#### 5. **User Profile** (`/users/[id]`)
- **File**: `app/users/[id]/page.tsx`
- **Purpose**: Dynamic user profile page
- **Access**: Requires valid JWT token
- **Parameters**:
  - `[id]`: Dynamic segment representing user ID
- **Features**:
  - Display detailed user information
  - Mock data fetching (scalable to real API)
  - Navigation to next user
  - Breadcrumb navigation for SEO
  - Back navigation to dashboard

### Error Handling

#### 6. **404 Not Found Page** (`/not-found`)
- **File**: `app/not-found.tsx`
- **Purpose**: Custom error page for undefined routes
- **Features**:
  - User-friendly error message
  - Gradient background for visual appeal
  - Quick links to common pages
  - Navigation back to home and dashboard

## Middleware Implementation

### Authentication Middleware (`middleware.ts`)

The middleware enforces access control at the route level:

```typescript
// Routes handled:
// 1. Public routes (/) and (/login) - no restrictions
// 2. Protected page routes (/dashboard, /users) - require JWT in cookies
// 3. Protected API routes (/api/admin, /api/users) - require JWT in Authorization header
```

**Key Features**:
- Validates JWT token from cookies for page routes
- Validates JWT token from Authorization header for API routes
- Redirects unauthenticated users to `/login`
- Role-based access control for admin routes
- Attaches user info to request headers for downstream handlers

**Configuration**:
```typescript
export const config = {
  matcher: ['/dashboard/:path*', '/users/:path*', '/api/admin/:path*', '/api/users/:path*'],
};
```

## Global Layout

### Root Layout (`layout.tsx`)

The root layout provides consistent UI across all pages:

**Features**:
- **Navigation Bar**: Links to Home, Login, Dashboard, and Users
- **Footer**: Copyright information
- **Styling**: Tailwind CSS for responsive design
- **Metadata**: SEO optimization with title and description

**Navigation Structure**:
```
┌─────────────────────────────────────┐
│  🍔 FoodONtracks  │ Home │ Login │ Dashboard │ Users │
└─────────────────────────────────────┘
         ↓
      [Page Content]
         ↓
┌─────────────────────────────────────┐
│  © 2025 FoodONtracks. All rights reserved. │
└─────────────────────────────────────┘
```

## SEO and Breadcrumbs

### Breadcrumb Navigation

Breadcrumbs are implemented in dynamic routes (e.g., `/users/[id]`) to:
- Improve user experience and navigation
- Enhance SEO by showing site hierarchy
- Help users understand their location in the app

**Example Breadcrumb Trail**:
```
Home / Dashboard / User 1
```

### Metadata Strategy

Each page includes appropriate metadata:
- Titles for tab identification
- Descriptions for search engine indexing
- Structured markup for breadcrumbs (when applicable)

## Authentication Flow

### Login Flow

```
User (/)
   ↓
Click "Login" → /login page
   ↓
Enter credentials and submit
   ↓
POST /api/auth/login
   ↓
Validate credentials
   ↓
Generate JWT token
   ↓
Store token in HTTP-only cookie
   ↓
Redirect to /dashboard
```

### Protected Route Access

```
User attempts to access /dashboard
   ↓
Middleware checks for valid JWT in cookies
   ↓
Token valid? → Allow access to /dashboard
   ↓
No token or invalid? → Redirect to /login
```

## Error Handling

### Invalid Routes
- User tries to access undefined route (e.g., `/random-page`)
- **Result**: Custom 404 page is displayed with helpful links

### Expired Token
- User's JWT token expires
- **Result**: Middleware redirects to `/login` on next protected route access

### Login Failure
- Invalid credentials provided
- **Result**: Error message displayed on login page
- **No redirect**: User stays on login page to retry

## Dynamic Route Scalability

### Current Implementation
- Mock data fetching in `app/users/[id]/page.tsx`
- Easily adaptable to real API calls:

```typescript
// Replace mock data with:
const response = await fetch(`/api/users/${id}`);
const user = await response.json();
```

### Benefits
- **Scalability**: Supports unlimited user profiles with a single dynamic route
- **Performance**: Only renders requested user data
- **SEO**: Each user profile gets a unique URL for indexing

## User Experience Enhancements

### Navigation
- Clear visual hierarchy with navigation bar
- Consistent footer across all pages
- Breadcrumbs in dynamic routes
- Quick action buttons on each page

### Error States
- User-friendly error messages
- Helpful links to navigate out of errors
- Graceful handling of authentication failures

### Styling
- Responsive design using Tailwind CSS
- Consistent color scheme
- Visual feedback on interactive elements (hover states)
- Color-coded role badges and status indicators

## Testing the Routes

### Public Routes (No Login Required)
```
Visit: http://localhost:3000/               → Home page
Visit: http://localhost:3000/login          → Login page
Visit: http://localhost:3000/fake-route     → 404 page
```

### Protected Routes (Login Required)
```
1. Go to http://localhost:3000/login
2. Enter any email and password
3. Click "Login"
4. You'll be redirected to /dashboard
5. Explore:
   - http://localhost:3000/dashboard        → Dashboard
   - http://localhost:3000/users            → Users list
   - http://localhost:3000/users/1          → User profile (ID: 1)
   - http://localhost:3000/users/2          → User profile (ID: 2)
```

### Protected Route Access Without Login
```
1. Clear browser cookies (or open incognito window)
2. Try to access: http://localhost:3000/dashboard
3. You'll be redirected to /login
```

## Key Implementation Details

### Next.js Features Used
- **App Router**: File-based routing with folders and `page.tsx` files
- **Dynamic Routes**: `[id]` parameter for dynamic segments
- **Middleware**: Route-level authentication at the request level
- **Layouts**: Shared UI component wrapping all pages
- **Metadata**: SEO optimization with Next.js metadata API
- **Link Component**: Optimized client-side navigation

### Security Considerations
- **JWT Storage**: Tokens stored in HTTP-only cookies (sent by backend)
- **Token Validation**: Middleware validates token signature and expiration
- **Role-based Access**: Admin routes check user role
- **Secure Redirects**: Unauthenticated users redirected before page loads

### Performance Optimizations
- **Server Components**: Dynamic route page is a server component (by default)
- **Static Generation**: Static routes cached and reused
- **Link Prefetching**: Next.js Link component prefetches routes
- **Code Splitting**: Each route loads only necessary code

## Reflection: How Dynamic Routing Supports Scalability and SEO

### Scalability
1. **Code Reusability**: One `[id]/page.tsx` handles all user profiles
2. **Database Efficiency**: Server component can fetch data on-demand
3. **Growth Ready**: Adding 1 million users requires zero route changes
4. **API Integration**: Easy to connect to backend user service

### SEO Advantages
1. **Unique URLs**: Each user has a unique, indexable URL
2. **Breadcrumbs**: Help search engines understand site structure
3. **Structured Data**: Can add JSON-LD markup for rich snippets
4. **Metadata**: Each page has unique title and description
5. **Performance**: Server-side rendering improves indexing

### User Experience Improvements
1. **Breadcrumbs**: Users know where they are in the application
2. **Clear Navigation**: Consistent nav bar helps users explore
3. **Error Recovery**: 404 page provides helpful navigation options
4. **Fast Navigation**: Server-side rendering and prefetching improve perceived speed

## Future Enhancements

1. **Advanced Authentication**: OAuth2, multi-factor authentication
2. **Role-based UI**: Show/hide navigation based on user role
3. **Pagination**: Add pagination to users list
4. **Search Filtering**: Search users by name or email
5. **User Management**: Create, edit, delete user operations
6. **Notifications**: Toast notifications for actions
7. **Loading States**: Skeleton loaders for better UX
8. **Animations**: Page transitions and micro-interactions

---

**Last Updated**: December 22, 2025
**Framework**: Next.js 13+ App Router
**Styling**: Tailwind CSS
