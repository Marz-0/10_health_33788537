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

### Achievements Module

- Record fitness achievements (personal bests, streaks, strength milestones)
- Optional metrics with units (e.g. kg, minutes, reps)
- Achievement reporting by category and best recorded values
- Recent achievement feed

### Weather Integration

Uses OpenWeatherMap to show live weather + workout suggestions.

### User Accounts

- Registration with bcrypt
- Login / logout
- Protected routes

### Login Audit Logging

Tracks all login attempts with reason + IP + timestamp.

---

## Analytics Dashboard (New Feature)

This feature adds a new page that shows workout statistics using charts. It was not covered in the lectures or labs and uses an external library (**Chart.js**) to visualise data.

### What this feature includes

- A new protected page: **`/workouts/stats`**  
  Only logged-in users can access it. It shows charts based on the user's workout data.

- A new API endpoint: **`/api/workouts/stats`**  
  This returns summary information from the database, such as:
  - how many workouts were done each month  
  - how many workouts were of each activity type  
  - how many workouts were each intensity level  

- A new view: **`workout_stats.ejs`**  
  This page loads Chart.js from a CDN and displays three charts:
  1. **Workouts per month** (bar chart)  
  2. **Workouts by activity type** (doughnut chart)  
  3. **Workouts by intensity** (bar chart)

  If there is no workout data, the page shows a friendly message instead of empty charts.

- A new sidebar link: **Analytics**  
  Added to the navigation menu. It becomes highlighted when the user is on the stats page.

---

## How it works (server side)

- The server runs three SQL `GROUP BY` queries on the `workouts` table to summarise the data:
  - Count of workouts per month  
  - Count per activity type  
  - Count per intensity level  

- These results are returned as JSON from `/api/workouts/stats`.

- The stats page (`/workouts/stats`) uses the same login protection as other private routes.

---

## How it works (client side)

- Chart.js is loaded using a `<script>` tag.
- When the stats page loads, JavaScript calls:

  ```javascript
  fetch('/api/workouts/stats')
  ```

- The data returned by the server is used to fill the charts.
- If the data is empty (e.g., a new user), the page shows a “No workout data available yet” message.

---

## How to try the dashboard

1. Start the app (`node index.js`).
2. Log in to your account.
3. Click **Analytics** in the sidebar.
4. If you have not added any workouts yet, add some and refresh the page to see the charts update.


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

