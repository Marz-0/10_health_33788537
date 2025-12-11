# Health Tracker App

A fitness and wellbeing web application built for the **Dynamic Web Applications** module.

Powered by **Node.js**, **Express**, **MySQL**, and **EJS**.

---

## Setup & Installation

### 1. Install dependencies

```bash
npm install
```

### 2. Prepare the MySQL database

Start MySQL:

```bash
mysql -u root -p
```

Run the setup script:

```sql
SOURCE create_db.sql;
```

This creates the **health** database and the tables:

- `workouts`
- `users`
- `login_audit`

### 3. Insert sample data

```sql
SOURCE insert_test_data.sql;
```

### 4. Configure environment variables

Create a `.env` file:

```
HEALTH_HOST='localhost'
HEALTH_USER='health_app'
HEALTH_PASSWORD='qwertyuiop'
HEALTH_DATABASE='health'
HEALTH_BASE_PATH='http://localhost:8000'
```

### 5. Start the server

```bash
npm start
```

---

## Features

### Workouts Module

- Add workouts
- View all workouts
- Search workouts
- Short workouts (< 30 mins)
- Weather-based exercise suggestions

### Weather Integration

Uses OpenWeatherMap to show live weather + workout suggestions.

### User Accounts

- Registration with bcrypt
- Login / logout
- Protected routes

### Login Audit Logging

Tracks all login attempts with reason + IP + timestamp.

---

## Validation

Validation has been added in text boxes where uses must enter text or information to add to the database. We use the express-validator module to validate fields. This is done using "checks" based on each feild. In my code, I have added validation to:

- Registration fields
- Search fields
- Workout form fields

## Sanitisation

Sanitation has been added in text boxes to prevent users from any Cross-Site Scripting (XSS) attacks. 

We use the express-sanitizer module to sanitise our fields. This is done by wrapping any request body with req.sanitize. This prevents any XSS attacks in our website. 

The following pages have been sanitized:

- The register page:
    - First name
    - Fast name
    - Email

- Workout page: 
    - title 
    - notes 

---

## API Endpoints

In this Application, we use an API for get data of the live weather in Cities using OpenWeatherMap

We also create our own API to get data of workouts that have been added to our databases. 

### List all workouts
```
/api/workouts
```

### Search workouts
```
/api/workouts?search=run
```

### Filter by duration
```
/api/workouts?max_duration=30
```

### Filter by type
```
/api/workouts?type=Running
```

### Sort workouts
```
/api/workouts?sort=duration
```



---

## Testing the App


1. Ensure the DB schema is created (run `create_db.sql`).
2. Start the app:

```powershell
node index.js
```


Useful URLs:

- Register: `/users/register`
- Login: `/users/login`
- Add workout: `/workouts/addworkout`
- All workouts: `/workouts/list`
- Weather: `/weather`
- Users list: `/users/list`
- Login audit: `/users/audit`



Currently the app runs on the Goldsmiths virtual servers with the following link:

https://doc.gold.ac.uk/usr/360/ 

---

