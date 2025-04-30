# Rwandan Art Gallery Platform

A digital platform for Rwandan artists to showcase their artwork, connect with art experts, and sell their creations.

## Features

- User Authentication (Artists, Viewers, Art Experts)
- Artwork Management (CRUD operations)
- Artwork Showcase and Browsing
- Like and Comment System
- Direct Messaging between Artists and Art Experts
- Order Management System
- User Profiles and Portfolios

## Tech Stack

### Backend
- Java 17
- Spring Boot
- Spring Security
- Spring Data JPA
- PostgreSQL
- WebSocket (for chat functionality)

### Frontend
- React.js
- Material-UI
- Redux (for state management)
- Axios (for API calls)
- Socket.io-client (for real-time chat)

## Project Structure

```
rwandan-art-gallery/
├── backend/           # Spring Boot application
├── frontend/          # React application
└── README.md
```

## Setup Instructions

### Prerequisites
- Java 17 or higher
- Node.js 16 or higher
- PostgreSQL
- Maven
- npm or yarn

### Backend Setup
1. Navigate to the backend directory
2. Configure database properties in `application.properties`
3. Run `mvn spring-boot:run`

### Frontend Setup
1. Navigate to the frontend directory
2. Run `npm install`
3. Run `npm start`

## Development Guidelines

- Follow REST API best practices
- Implement proper error handling
- Use proper authentication and authorization
- Follow responsive design principles
- Implement proper security measures 