# Health Tracker App

A fitness and wellbeing web application built for the **Dynamic Web Applications** module.

Powered by **Node.js**, **Express**, **MySQL**, and **EJS**.

---

## Key Technologies

- **Backend**: Node.js with Express framework
- **Database**: MySQL with mysql2 driver
- **Template Engine**: EJS (Embedded JavaScript)
- **Authentication**: bcrypt for password hashing, express-session for session management
- **Validation**: express-validator for input validation
- **Sanitisation**: express-sanitizer for XSS protection
- **Charting**: Chart.js (loaded via CDN)
- **External API**: OpenWeatherMap for weather data

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

- `workouts` - stores workout/exercise records
- `users` - stores user accounts
- `login_audit` - tracks login attempts
- `achievements` - stores fitness milestones and personal records

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

Validation has been added to protect data integrity and ensure users enter valid information. We use the **express-validator** module to validate fields with checks based on each field type. 

Validation is implemented in:

- **Registration fields** (username, email, password)
- **Search fields** (workout search queries)
- **Workout form fields** (title, duration, intensity, date)
- **Achievement form fields** (title, metric value, date)

## Sanitisation

Sanitisation has been added to prevent Cross-Site Scripting (XSS) attacks. We use the **express-sanitizer** module to sanitise user input by wrapping request body fields with `req.sanitize()`.

The following pages have been sanitised:

- **Register page:**
    - First name
    - Last name
    - Email

- **Workout page:** 
    - Title 
    - Notes 

- **Achievement page:**
    - Title
    - Description
    - Category
    - Metric unit 

---

## API Endpoints

### Weather API

This application uses the OpenWeatherMap API to get live weather data for cities and provide workout suggestions based on weather conditions.

### Internal API

The application also provides its own REST API to get workout data from the database.

#### List all workouts
```
/api/workouts
```

#### Search workouts
```
/api/workouts?search=run
```

#### Filter by duration
```
/api/workouts?max_duration=30
```

#### Filter by intensity
```
/api/workouts?intensity=high
```

#### Sort workouts
```
/api/workouts?sort=duration
```

#### Workout statistics (for charts)
```
/api/workouts/stats
```
Returns JSON with workout counts grouped by month, activity type, and intensity level.



---

## Testing the App


1. Ensure the DB schema is created (run `create_db.sql`).
2. Start the app:

```powershell
node index.js
```


Useful URLs:

- Home: `/`
- About: `/about`
- Register: `/users/register`
- Login: `/users/login`
- Add workout: `/workouts/addworkout`
- All workouts: `/workouts/list`
- Search workouts: `/workouts/search`
- Short workouts: `/workouts/shortworkouts`
- Workout Analytics: `/workouts/stats`
- Add achievement: `/achievements/add`
- List achievements: `/achievements/list`
- Achievement report: `/achievements/report`
- Weather: `/weather`
- Users list: `/users/list`
- Login audit: `/users/audit`



Currently the app runs on the Goldsmiths virtual servers with the following link:

https://doc.gold.ac.uk/usr/360/ 

---

