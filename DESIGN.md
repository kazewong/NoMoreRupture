## 1. Introduction

This document outlines the technical design and architecture for NoMoreRupture, a web application designed to collect structured data on track and field athletes. The primary goal is to create a comprehensive database that can be used to study the correlation between physical testing numbers, reported injuries, and potentially predict future injury risks.

## 2. Goals and Scope

### 2.1. Core Goals

- **Data Collection:** Securely collect quantitative performance data (testing numbers) from athletes.
- **Injury Tracking:** Systematically record injury reports alongside performance data.
- **Predictive Analytics:** Provide a foundation for statistical analysis to predict potential injuries.
- **User Experience:** Offer a simple, guided questionnaire experience for data input.
- **Visibility:** Display real-time, aggregate statistics to aid research and monitoring.

### 2.2. Scope

The initial scope includes user authentication, a guided data entry flow, secure data storage, and a basic dashboard for displaying aggregate metrics.

## 3. Technical Architecture

We recommend a modern, decoupled microservice or three-tier architecture to ensure scalability, maintainability, and ease of development for both the frontend and backend services.

### 3.1. Components

- **Frontend (Client Layer):** Responsible for the User Interface (UI).
- _Technology Recommendation:_ Svelte, utilizing Tailwind CSS for utility styling and DaisyUI for pre-built, accessible components.
- _Purpose:_ Handles user interaction, routing, and presenting the questionnaire and dashboard views.
- _Location:_ `/var/home/kazewong/Projects/NoMoreRupture/frontend` (Based on existing structure).
- **Backend (API Layer):** The core business logic.
  - _Technology Recommendation:_ Rust (Axum/Actix-web). Rust provides memory safety and high performance, ideal for APIs.
  - _Purpose:_ Manages authentication, validates incoming data, processes business logic, and interacts with the database.
  - _Location:_ `/var/home/kazewong/Projects/NoMoreRupture/backend` (To be created).
- **Database (Data Layer):** Persistence layer for all data.
  - _Technology Recommendation:_ PostgreSQL. It is robust, supports complex data types, and is excellent for relational data that requires integrity (e.g., linking Users to Measurements).

### 3.2. Data Flow Diagram (Conceptual)

1.  **User Access:** User accesses the Frontend via the API Gateway.
2.  **Authentication:** Frontend calls `POST /api/v1/auth/login` (Backend).
3.  **Data Entry:** Frontend displays questionnaire form, collecting data. User submits data -> `POST /api/v1/data/measurement`.
4.  **Data Storage:** Backend validates data, sanitizes input, and writes records to the PostgreSQL Database.
5.  **Statistics:** Dashboard calls `GET /api/v1/stats/aggregate` -> Backend runs aggregation queries -> Frontend displays results.

## 4. Data Model (Schema Design)

We will establish several key entities to ensure data integrity.

### 4.1. `User` Table

- `user_id`: Primary Key (UUID)
- `email`: Unique Index (Used for login)
- `password_hash`: Stored hashed password
- `created_at`: Timestamp

### 4.2. `Measurement` Table (Testing Numbers)

- `measurement_id`: Primary Key (UUID)
- `user_id`: Foreign Key (Links to `User`)
- `date_recorded`: Date of the test
- `field_event_1_name`: e.g., "Vertical Jump"
- `field_event_1_value`: Numeric measurement
- `field_event_2_name`: e.g., "Broad Jump"
- `field_event_2_value`: Numeric measurement
- _(... additional fields for all relevant testing numbers)_
- `data_recorded_at`: Timestamp of submission

### 4.3. `InjuryReport` Table

- `injury_id`: Primary Key (UUID)
- `user_id`: Foreign Key (Links to `User`)
- `date_reported`: Date the injury was sustained/reported
- `injury_severity`: (Enum: Minor, Moderate, Severe)
- `body_area`: (String: e.g., "Knee", "Hamstring", "Shoulder")
- `description`: Text field for detailed description
- `is_active`: Boolean (Indicates if the injury is current)

## 5. Feature Design Details

### 5.1. Authentication Flow

- **Mechanism:** Email/Password authentication.
- **Implementation:** Backend utilizes secure hashing (e.g., bcrypt) for password storage. JWT (JSON Web Tokens) will be used for stateless authentication between the client and API.
- **Endpoint:** `/api/v1/auth/login`, `/api/v1/auth/logout`.

### 5.2. Questionnaire/Data Input Flow

- **Design:** The questionnaire should be dynamic, allowing the inclusion of new testing events without major backend overhaul.
- **Validation:** The backend must enforce data type validation (e.g., measurements must be numeric, dates must be valid).
- **UX Consideration:** The frontend should save form data state (drafting) so users can continue filling it out later.

### 5.3. Statistics Dashboard

- **Purpose:** To show aggregate, anonymized, or user-specific trends.
- **Data Required:**
  - Average performance per event across all users (Cohort Analysis).
  - Injury rate by body area over time.
  - Correlation visualization (e.g., how low vertical jump scores correlate with high knee injury reports).
- **Endpoint:** `/api/v1/stats/aggregate`.
- **Security:** Careful attention must be paid to **anonymization** and aggregation logic to prevent the identification of individual users.

## 6. Future Considerations (V2)

- **Mobile Integration:** Building dedicated mobile apps (iOS/Android).
- **Advanced Visualization:** Integrating a charting library (e.g., D3.js, Recharts) for complex trend analysis.
- **Machine Learning Model:** Developing and integrating a dedicated ML model endpoint for risk scoring.
- **API Access:** Providing a public or research API endpoint for authorized third parties.
