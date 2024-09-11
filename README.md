# WTWR (What to Wear?): Back End

This back-end project focuses on building the server for the WTWR (What to Wear?) application. The goal is to enhance your skills in working with databases, implementing security, testing, and deploying a web server to a remote environment. You will create an API-driven server with user authentication and authorization.

## Project Overview

WTWR helps users decide what to wear based on current weather conditions.

## Features

- **Weather-Based Recommendations**: The server uses weather data to provide personalized clothing suggestions for users.
- **User Management and Security**: Features include user registration, authentication, and authorization using JWT.
- **CRUD Operations**: Users can add, update, and delete clothing items to their virtual wardrobe.
- **Database Integration**: All user information and wardrobe data are securely stored in a MongoDB database.
- **API Endpoints**: Provides RESTful API endpoints for managing users and clothing items.
- **Testing & Deployment**: Implements unit testing, along with setup for deploying the app to production environments.

## Technologies Used

- **Node.js**
- **Express.js**
- **MongoDB**
- **Mongoose**
- **nodemon** for development automation
- **ESLint** and **Prettier** for code quality and formatting
- **JWT (JSON Web Token)** for user authentication
- **Postman** for API testing

## Getting Started

### Installation

1. Clone the repository.
2. Install dependencies: `npm install`.
3. Set up environment variables in a `.env` file (e.g., `JWT_SECRET` and database connection URI).

### Running the Server

- `npm run start` — Launch the server in production mode.
- `npm run dev` — Run the server in development mode with hot-reloading.

### API Documentation

- **User Sign-Up & Login**: Secure registration and authentication with JWT.
- **Clothing Items**: Add, edit, delete, and retrieve clothing items.
- **Weather-Based Recommendations**: Personalized suggestions based on current weather conditions.
