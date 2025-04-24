# AdvancedDB Project

## Overview

This project is a full-stack application with a backend server using Node.js, Express, and MongoDB, and a frontend React application. It supports CRUD operations on items, activity logging, and comments associated with items.

## Backend

- The backend server is located in the `backend/` directory.
- It uses Express and Mongoose to manage items stored in MongoDB.
- Items have embedded comments.
- New endpoints added:
  - `POST /items/:id/comments`: Add a comment to a specific item.
  - `GET /items`: Returns items with embedded comments.
- Activity log is available at `GET /activity`.

### Running the backend

1. Navigate to the `backend/` directory.
2. Run `npm install` to install dependencies.
3. Run `npm start` to start the server on `http://localhost:3000`.

## Frontend

- The frontend React app is located in the `frontend/` directory.
- The main component `CrudWindow` manages items and their comments.
- Comments are displayed per item.
- Users can add comments to specific items via a form under each item.
- Activity log is displayed in a separate section.

### Running the frontend

1. Navigate to the `frontend/` directory.
2. Run `npm install` to install dependencies.
3. Run `npm start` to start the development server.

## Features

- Create, read, update, and delete items.
- View activity log of item operations.
- View and add comments associated with each item.

## Notes

- Ensure MongoDB is running locally on `mongodb://localhost:27017/advanceddb`.
- The backend and frontend servers should be running concurrently for full functionality.
