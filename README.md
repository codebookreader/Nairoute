 # Nairoute

**Nairoute** is a full-stack web-based public transport  booking and route information platform designed to save time spent waiting, provide fair pricing and help commuters discover new transit routes.

## Features
- Ticket booking
- Route and schedule discovery
- Commuter reviews

### Tools used
- **Frontend:** React, HTML5, CSS3
- **Backend:** Express.js
- **Database:** MySql *(Migration to postgresql in progress)* 

## Installation and Local setup 
### Prerequisites
- Node.js
- MySql / Postgresql service running locally
### Steps
**Clone the repository**
```
git clone https://github.com/codebookreader/Nairoute.git
cd nairoute
```
 **Install dependencies**
```
#Install frontend dependencies
npm install
cd backend
npm install
```
**Configure environment variables**
Create a .env file in root directory and configure your database credentials
```
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=nairoute_db
```
**Run the application**
```
#start the backend server
npm start
#start frontend(in a separate terminal)*
npm run dev
```

## Project Reflection and modernization Roadmap
Nairoute was originally build as a foundational Computer Science project in collaboration with a classmate to apply full-stack web development princples end-to-end.
Having evolved to a software developer, I am actively refactoring and modernizing the codebase.  
**Current Roadmap**  
[ ] Database Migration: Upgrade data layer from MySQL to PostgreSQL with structured migrations.
[ ] Update backend endpoints to be inline with the new database service
[ ] UI/UX Overhaul: Redesign the user interface for a modern, responsive experience.

[ ] Type Safety: Integrate TypeScript across backend API routes and React components.


