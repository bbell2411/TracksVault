# 🎧 TracksVault

**TracksVault** is a Fullstack mobile-first music app backend built with Node.js and PostgreSQL. It handles user authentication, music uploads/downloads, and stores metadata. A React Native frontend is planned for mobile users.

- Built with Node.js, Express, and PostgresSQL.

- This project follows MVC architecture and includes fully tested endpoints using jest.

## 📌 Features

- 🧑‍💻 User registration and login
- 🔐 Custom token-based authentication 
- 🎵 Upload and download music files
- 📄 Store and manage track metadata (eg title, artist)
- 🧪 Backend tested with Jest and Supertest
- 📱 Frontend in progress using React Native

## 🛠️ Tech Stack

- **Backend**: Node.js, Express
- **Database**: PostgreSQL
- **Auth**: Hashed passwords (bcrypt) and secure random token generation
- **Testing**: Jest, Supertest
- **Frontend**: React Native (planned)

## 📂 File Structure

- `db/`: PostgreSQL connection setup
- `app/`: Main application logic for users and music management
- `controllers/`: Business logic for users and music
- `models/`: SQL queries for users and tracks
- `__tests__/`: Tests for auth and core functionality

## Requirements to run the project

- Ensure you have the minimum versions of NODE.js and Postgres.

## 🚀 Getting Started

1. **Clone the repository:**

```bash
   git clone https://github.com/bbell2411/TracksVault.git
   cd TracksVault/BE
```
2. **Install dependencies:**

```bash
npm install
```
3. **Set up your PostgreSQL database**
Create 2 .env files in root:

**.env.test**
 ```env
   PGDATABASE=trackvault_test
 ```
**.env.development**
```env
PGDATABASE=trackvault
```
4. **Setup**
``` bash
npm run setup-dbs
``` 

5. **Seed dev environment:**
``` bash
npm run seed-dev
```
6. **Seed test environment:**
``` bash
npm run test-seed
```
🧪 Testing
To run tests:
``` bash
npm test
```
Uses Jest and Supertest to test endpoints and functionality.

🛣️ Roadmap
 Build mobile frontend with React Native

 Add music search by title/artist

 Create playlists and user libraries

 Support music streaming (not just downloads)
 
💡 Motivation
I built TracksVault to explore API integration, improve my frontend skills with React, and create a fun, functional app that i would use day-to-day.

🛣️ Future Improvements
-  User Profiles: Add user profile functionality where users can save favorite tracks, view upload history, and customize their experience.
-  Improved Authentication: Add OAuth integration (e.g., Google or Facebook login) for easier user registration and login.
-  Real-Time Notifications: Implement push notifications for user interactions, such as when a new track is uploaded
-  Unit and Integration Tests: Enhance test coverage by adding more unit and integration tests for all major features.
- Trending Tracks: Implement a feature that sorts tracks based on popularity (e.g., number of listens, likes, or uploads in a certain period).
- Genre-based Sorting: Allow users to filter and sort tracks based on their genre (e.g., rock, pop, electronic). Users should be able to browse tracks in specific genres.
- Artist-based Sorting: Implement a feature to sort and display tracks by artists. This will allow users to find and browse tracks uploaded by their favorite artists.
- Custom Sorting: Allow users to sort tracks by multiple criteria, such as:
- Newest to Oldest (e.g., latest track uploads)
- Most Played (tracks with the highest play count)
- Most Liked (tracks with the most likes or ratings)
- Search and Filter Enhancements: Along with sorting, enhance the search feature to allow users to search for tracks by multiple filters, such as:
Track name, Artist name, Genre










