# 🩺 Schedula Backend

Schedula is a medical appointment booking system built with a modular, scalable backend using **NestJS** and **PostgreSQL**. The backend supports role-based authentication, doctor availability scheduling, time slot generation, and secure appointment booking — with features tailored for stream and wave consultation modes.

> 🚀 Developed as part of a backend internship at Pearl Thoughts  
> 🧑‍💻 Contributor: Arnav Mahajan (June 15, 2025 – July 15, 2025)

---

## 📌 Features

- 🔐 **Custom JWT Auth & Google OAuth**  
  Role-based authentication for Patients, Doctors, and Admins.

- 📆 **Doctor Scheduling**  
  Stream/Wave mode scheduling with dynamic slot generation.

- 🧠 **Smart Booking Logic**  
  Ensures valid booking windows based on IST + UTC conversion.

- 🧾 **Time Slot & Appointment Models**  
  Support for max patients per wave, booking status, and availability control.

- 📊 **Admin-Ready Architecture**  
  Scalable structure designed to support dashboards, scorecards, and audit logs.

---

## 🛠️ Tech Stack

| Tool           | Purpose                            |
|----------------|------------------------------------|
| **NestJS**     | Backend framework (TypeScript)     |
| **PostgreSQL** | Relational DB for structured data  |
| **Passport.js**| Authentication (JWT + Google OAuth)|
| **Render**     | Cloud deployment                   |
| **Zod**        | Schema validation (optional)       |
| **Docker**     | Containerization (planned)         |

---

## 🗂️ Project Structure

```
src/
│
├── auth/               # Custom JWT + Passport strategy
├── doctor/             # Doctor models, scheduling logic
├── patient/            # Patient info, secure routes
├── appointment/        # Booking logic (WIP)
├── common/             # Enums, decorators, guards
├── utils/              # Date/time & helper functions
└── main.ts             # App entry point
```

---

## 📦 Installation & Setup

```bash
# Clone the repo
git clone https://github.com/arnavmahajan630/schedula-backend.git
cd schedula-backend

# Install dependencies
npm install

# Environment setup
cp .env.example .env
# Edit .env with DB credentials, JWT secret, etc.

# Run locally
npm run start:dev
```

---

## 🔐 Authentication

Schedula uses a hybrid authentication system:

- **Local Auth**: Email + password with role-based token issuance.
- **JWT**: Custom access tokens include `user_id` and `role`, verified via `JwtAuthGuard`. Tokens are used to authorize doctor/patient access per route.
- **Google OAuth**: 
  - Implemented using `passport-google-oauth20`.
  - On successful login, user details are matched or created in the database.
  - A custom JWT is then issued for internal auth flows.

➡️ OAuth is mainly used for **patient login** to simplify onboarding.

---

## 🕒 Scheduling Logic

Doctors can set availability in **stream** or **wave** mode:
- **Stream Mode**: Each 30-min slot = 1 patient.
- **Wave Mode**: Slots accept up to `max_patients`, all booked at the same time.

Bookings are only allowed:
- Within doctor’s available slots.
- Before consultation start time (with UTC-IST checks).

---

## 📤 Deployment

> **URL**: https://schedula-backend-arnav.onrender.com  
Live API hosted on **Render**.

---

## 🧪 Testing (Planned)

- Unit tests with **Jest**
- Test cases for auth, scheduling, booking
- Postman collection for API testing

---

## 📝 License

MIT License © 2025 Arnav Mahajan

---

## 🙋‍♂️ Intern Takeaways

- Architected core scheduling logic and time slot system.
- Implemented secure, role-based APIs from scratch.
- Gained production experience deploying and testing a real-world system.

---

## 🤝 Connect

> [LinkedIn](www.linkedin.com/in/arnavmahajan630)  
> [GitHub](https://github.com/arnavmahajan630)
