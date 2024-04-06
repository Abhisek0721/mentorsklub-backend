# MentorsKlub Backend

This is the backend component of MentorsKlub, a virtual mentorship software developed using NestJS.

### Backend Live: https://mentorsklub-api.onrender.com
### Frontend Live: https://mentorsklub.vercel.app

## Features

- **Authentication:** User registration, login, and JWT-based authentication.
- **User Management:** CRUD operations for user.
- **Mentee Management:** CRUD operations for mentee (subpart of user).
- **Mentor Management:** CRUD operations for mentor (subpart of user).
- **Mentorship Sessions:** Schedule, join, and manage mentorship sessions.
- **Subscription Management:** Mentee can subscribe to mentor for upcoming sessions.
- **Messaging:** User can interact with each other throught messages.
- **Notifications:** Send notifications for session reminders and updates.

## Technologies Used

- **NestJS:** A progressive Node.js framework for building efficient, reliable, and scalable server-side applications.
- **MongoDB:** A NoSQL database for storing user and session data.
- **Mongoose:** An ODM for MongoDB, used for modeling application data.

## Installation

1. Clone the repository: `git clone https://github.com/Abhisek0721/mentorsklub-backend`
2. Install dependencies: `npm install`
3. Set up environment variables: Create a `.env` file and define the following variables:
   ```
      PORT=3001
      DATABASE_URI=mongodb://localhost:27017
      DATABASE_NAME=mentorsklub
      ENCRYPTION_KEY=your_encription_key
      JWT_SECRET=your_jwt_secret
      JWT_EXPIRY_TIME=3d
      BACKEND_URL=http://localhost:3001
      FRONTEND_URL=http://localhost:3000
      ZOOM_APP_CLIENT_ID=your_zoom_client_id
      ZOOM_APP_CLIENT_SECRET=your_zoom_client_secret
   ```
4. Run the server: `npm run dev`

## API Documentation

The API documentation for MentorsKlub Backend is available on Postman. You can view and interact with the API by clicking the buttons below:

- **Common Collection:** [Common Collection](https://documenter.getpostman.com/view/16254597/2sA35MxJVV)
- **Mentee Collection:** [Mentee Collection](https://documenter.getpostman.com/view/16254597/2sA35MxJVW)
- **Mentor Collection:** [Mentor Collection](https://documenter.getpostman.com/view/16254597/2sA35MxJVY)
- **Zoom Collection:** [Zoom Collection](https://documenter.getpostman.com/view/16254597/2sA35MxJVZ)

## License

This project is licensed under the MIT License - see the [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://github.com/Abhisek0721/mentorsklub-backend/blob/master/LICENSE)
 file for details.

</br></br>
Feel free to contact me: abhisek0721@gmail.com