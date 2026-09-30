# 🌐 ShareSphere

**ShareSphere** is a full-stack content-sharing application designed around secure authentication, distributed data synchronization, and cloud-based file storage.

The project combines **React, Node.js, MongoDB, CouchDB, PouchDB, and Amazon S3** to explore how modern applications can handle authentication, persistent data, file storage, and synchronization across different environments.

---

## ✨ Features

- 🔐 **Secure Authentication**
  - User registration and login.
  - JWT-based authentication.
  - Protected authentication verification.
  - Token expiration.

- 🔄 **Offline-First Data Synchronization**
  - PouchDB is used on the client side.
  - CouchDB provides the synchronization layer.
  - Data can be synchronized between the client and server-side database.
  - Designed to support working with data even when connectivity is unreliable.

- ☁️ **Cloud File Storage**
  - Amazon S3 is used for storing uploaded files and media.
  - Application data and large binary files are separated from the primary database.
  - S3 provides scalable object storage for user-generated content.

- 🗄️ **Persistent Application Data**
  - MongoDB is used for application/user-related data.
  - CouchDB is used as part of the synchronization architecture.

- ⚡ **REST APIs**
  - Node.js and Express.js provide backend APIs.
  - Frontend communicates with the backend through HTTP requests.

- 🌍 **Production Deployment**
  - Frontend deployed on Vercel.
  - Backend deployed on Render.
  - Cloud services used for database synchronization and file storage.

---

## 🛠️ Tech Stack

### Frontend

- React.js
- JavaScript
- PouchDB
- HTML
- CSS

### Backend

- Node.js
- Express.js
- REST APIs
- JWT
- Mongoose

### Databases

- MongoDB
- CouchDB

### Synchronization

- PouchDB
- CouchDB

### Storage

- Amazon S3

### Deployment

- Vercel
- Render

---

## 🏗️ Architecture

```text
                         ┌───────────────────────┐
                         │        Browser        │
                         │                       │
                         │    React Frontend     │
                         │                       │
                         │      PouchDB          │
                         └───────────┬───────────┘
                                     │
                              Sync / Replication
                                     │
                                     ▼
                         ┌───────────────────────┐
                         │       CouchDB         │
                         │                       │
                         │ Synchronization Layer │
                         │      Replication      │
                         └───────────┬───────────┘
                                     │
                                     │
                         ┌───────────▼───────────┐
                         │     Node.js + Express │
                         │        Backend        │
                         │                       │
                         │ Authentication        │
                         │ REST APIs             │
                         │ Application Logic     │
                         └───────┬────────┬──────┘
                                 │        │
                         ┌───────▼───┐    │
                         │ MongoDB   │    │
                         │           │    │
                         │ App Data  │    │
                         └───────────┘    │
                                          │
                                   ┌──────▼──────┐
                                   │  Amazon S3  │
                                   │             │
                                   │ Files/Media │
                                   └─────────────┘
```

---

## 🔄 Data Synchronization

One of the key architectural features of ShareSphere is the use of **PouchDB and CouchDB for data synchronization**.

```text
             Client
               │
               ▼
          ┌─────────┐
          │ PouchDB │
          └────┬────┘
               │
        Replication / Sync
               │
               ▼
          ┌─────────┐
          │ CouchDB │
          └─────────┘
```

PouchDB acts as a local database in the browser, while CouchDB provides a server-side database that can synchronize with it.

This architecture makes it possible to design parts of the application around an **offline-first approach**, where local data can remain available and synchronize when connectivity is restored.

---

## ☁️ File Storage with Amazon S3

ShareSphere separates application data from large files and media.

Instead of storing binary files directly inside the application database:

```text
User
 │
 ▼
Upload File
 │
 ▼
Backend
 │
 ▼
Amazon S3
 │
 ▼
Object URL / Reference
 │
 ▼
Application Database
```

The database can store the relevant file metadata/reference while **Amazon S3 handles the actual object storage**.

This keeps the application database focused on structured application data while using dedicated object storage for files.

---

## 🔐 Authentication Flow

ShareSphere uses JWT-based authentication.

### Registration

```text
User
 ↓
Signup
 ↓
Express API
 ↓
Validate User
 ↓
MongoDB
```

### Login

```text
User
 ↓
Login
 ↓
Express API
 ↓
Validate Credentials
 ↓
Generate JWT
 ↓
Client
```

The JWT is then used to authenticate protected requests.

Authentication state can also be verified through:

```text
GET /auth/verify
```

---

## 📁 Storage Architecture

ShareSphere uses different storage technologies for different purposes:

| Technology | Purpose |
|---|---|
| **MongoDB** | Application/user data |
| **PouchDB** | Local browser-side data |
| **CouchDB** | Data synchronization |
| **Amazon S3** | File and media storage |

This separation allows each storage system to handle the type of workload it is designed for.

---

## 📂 Project Structure

```text
ShareSphere/
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── database/
│   │   ├── hooks/
│   │   └── ...
│   │
│   ├── public/
│   └── package.json
│
├── server/
│   ├── models/
│   ├── routes/
│   ├── controllers/
│   ├── middleware/
│   ├── services/
│   │   ├── s3/
│   │   └── ...
│   ├── config/
│   └── package.json
│
└── README.md
```

> Adjust this structure to match the actual repository.

---

## ⚙️ Getting Started

### Prerequisites

Make sure you have:

- Node.js
- npm
- MongoDB
- CouchDB
- AWS account with S3 access
- Git

### Clone the repository

```bash
git clone https://github.com/htyagi5/ShareSphere.git

cd ShareSphere
```

### Install dependencies

```bash
cd client
npm install

cd ../server
npm install
```

---

## 🔑 Environment Variables

Configure the required environment variables in the backend.

Example:

```env
MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret

COUCHDB_URL=your_couchdb_url
COUCHDB_USERNAME=your_couchdb_username
COUCHDB_PASSWORD=your_couchdb_password

AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=your_aws_region
AWS_S3_BUCKET=your_bucket_name
```

**Never commit credentials or `.env` files to GitHub.**

---

## ▶️ Running Locally

### Start the backend

```bash
cd server
npm run dev
```

### Start the frontend

```bash
cd client
npm run dev
```

Make sure MongoDB and CouchDB are available before starting the application.

---

## 🌍 Deployment

ShareSphere uses a distributed deployment architecture:

```text
                  ShareSphere
                       │
          ┌────────────┴────────────┐
          │                         │
          ▼                         ▼
       Vercel                    Render
      Frontend                   Backend
                                    │
                  ┌─────────────────┼────────────────┐
                  │                 │                │
                  ▼                 ▼                ▼
               MongoDB           CouchDB          AWS S3
              App Data            Sync           File Storage
```

---

## 🧠 Key Engineering Concepts

ShareSphere helped me work with concepts beyond traditional CRUD applications.

### 🔄 Data Synchronization

Understanding how local browser data can synchronize with a remote database using PouchDB and CouchDB.

### 📦 Distributed Storage

Using different storage systems according to the type of data:

```text
Structured Data  → MongoDB
Local Data       → PouchDB
Sync Database    → CouchDB
Files / Media    → Amazon S3
```

### 🔐 Authentication

Implementing JWT-based authentication and protected backend routes.

### ☁️ Cloud Storage

Integrating Amazon S3 for scalable object storage.

### 🌐 Full-Stack Deployment

Deploying frontend and backend separately while connecting them to cloud databases and storage services.

---

## 📚 What I Learned

Building ShareSphere gave me practical experience with:

- React.js
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT authentication
- PouchDB
- CouchDB
- Database replication and synchronization
- Offline-first application design
- Amazon S3
- Cloud object storage
- REST API development
- Environment configuration
- CORS
- Frontend/backend integration
- Production deployment

---

## 🔮 Future Improvements

Possible improvements include:

- Real-time synchronization indicators
- Conflict-resolution strategies for concurrent edits
- Resumable file uploads
- File previews
- Image optimization
- CDN integration
- Better offline-state handling
- Sharing permissions
- User roles
- Notifications
- Real-time collaboration

---

## 👨‍💻 Author

**Harshit Tyagi**

Computer Science & Engineering @ AKGEC

Interested in:

- Backend Development
- Full-Stack Development
- Distributed Systems
- Real-Time Applications
- Cloud Infrastructure
- GenAI

GitHub: **@htyagi5**

---

## ⭐ Support

If you find ShareSphere interesting, consider giving the repository a ⭐.

Built to explore full-stack development, authentication, distributed data synchronization, and cloud-based file storage.
