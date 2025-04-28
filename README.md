# Task Management Application
# Database Setup

#### Log into PostgreSQL (using your username and port in command prompt)
psql -U your_postgres_username -p your_port

#### Create the database
CREATE DATABASE lumaa;

#### Exit PostgreSQL
\q

# Create a .env file in the backend directory with:  
DATABASE_URL=postgresql://postgres:password@localhost:5433/lumaa  
JWT_SECRET=JWT_SECRET_KEY  
PORT=5000

***Important***: Modify the DATABASE_URL according to your PostgreSQL setup:  
Replace postgres with your PostgreSQL username  
Replace password with your PostgreSQL password  
Replace 5433 with your PostgreSQL port (commonly 5432)  
The database name should remain lumaa unless you created it with a different name  


# Backend Setup

#### Navigate to the backend directory:  
cd backend

#### Install dependencies:  
npm install express sequelize pg pg-hstore bcryptjs jsonwebtoken dotenv cors

#### Start the server:  
node src/index.js

# Frontend Setup

#### Navigate to the frontend directory:  
cd frontend

#### Install dependencies:  
npm install

#### Start the development server:  
npm run dev


# Testing
1. Register a new user at http://localhost:5173/register  
2. Log in at http://localhost:5173/login  
3. Create, edit, and delete tasks on the task management page  
4. Tasks can be:  
- Created with title and optional description  
- Marked as complete/incomplete  
- Edited to change title or description  
- Deleted when no longer needed  

# Features
User authentication (register, login, logout)  
JWT token-based authentication  
Create new tasks  
Update existing tasks  
Mark tasks as complete/incomplete  
Delete tasks  
Responsive design  

# Demo  
https://www.youtube.com/watch?v=DJi-6b1tyDM

