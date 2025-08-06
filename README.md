# 📝 Node Posts API

A scalable and robust RESTful API built with Node.js, Express, Prisma, and PostgreSQL for managing user authentication, media uploads (image/video), and post CRUD operations. The backend integrates AWS S3 for file storage and supports JWT-based authentication and pagination.

---

## 🚀 Features

- 🔐 JWT-based authentication (Login/Register)
- 📄 Post creation with optional media uploads
- 📤 Image & video uploads via AWS S3
- 🔄 Pagination support for post listing
- 📁 Organized file structure with middleware, routes, controllers, and utils
- 🧪 Prisma ORM with PostgreSQL
- 🛡️ Route protection via middleware
- 🧰 Utility functions for serialization and file handling

---

## 🏗️ Tech Stack

- **Backend Framework**: Node.js, Express
- **Database**: PostgreSQL with Prisma ORM
- **File Upload**: AWS S3 (via pre-signed URLs)
- **Authentication**: JWT
- **Environment**: dotenv
- **File Upload Parsing**: multer
- **Validation**: custom middleware
- **Cloud Hosting Ready**

---

## 📁 Project Structure

```
src/
├── config/               # Configuration settings
├── controllers/          # Request handlers (Auth, Post, User)
├── middleware/           # Auth & Upload middleware
├── routes/               # API route definitions
├── utils/                # Utility functions (S3, serializers, etc.)
├── app.js                # Express app setup
└── index.js              # Entry point

prisma/
├── schema.prisma         # Prisma DB schema
└── migrations/           # Database migrations

uploads/                  # Uploaded files (local dev only)
```

---

## ⚙️ Setup Instructions

### 1. Clone the Repo

```bash
git clone https://github.com/shakeeb416/node-apis.git
cd node-posts-api
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Create `.env` File

Use the provided `.env.example` to create your `.env`:

```bash
cp .env.example .env
```

Fill in all environment variables:

```env
PORT=5000
JWT_SECRET=your_jwt_secret
DATABASE_URL=postgresql://user:password@host:port/database
AWS_ACCESS_KEY_ID=your_aws_key
AWS_SECRET_ACCESS_KEY=your_aws_secret
AWS_REGION=your_aws_region
S3_BUCKET_NAME=your_bucket_name
```

### 4. Run Migrations

```bash
npx prisma migrate dev
```

### 5. Start the Server

```bash
npm start
```

The server will run on `http://localhost:5000`

---

## 📬 API Endpoints

### 🔐 Auth

| Method | Endpoint       | Description       |
|--------|----------------|-------------------|
| POST   | `/api/auth/register` | Register a new user |
| POST   | `/api/auth/login`    | Login and receive token |

### 👤 User

| Method | Endpoint         | Description        |
|--------|------------------|--------------------|
| GET    | `/api/users/get_all_users`  | Get all users |
| PUT    | `/api/users/profile`  | Edit user profile |

### 📝 Posts

| Method | Endpoint         | Description            |
|--------|------------------|------------------------|
| GET    | `/api/posts/get_all_posts`     | Get all posts (paginated) |
| GET    | `/api/posts/get_post_by_id` | Get post by ID         |
| POST   | `/api/posts/create_post`     | Create a new post (media optional) |

> 🔒 Both `/api/posts/create_post` & `/api/users/edit_profile` are protected by JWT auth middleware.

---

## 🖼️ File Uploads

- Files are uploaded using `multer`.
- Files are uploaded using the `upload.js` middleware.
- File name is saved in the database.
- `gets3FileUrl.js` is used to generate the AWS S3 public URL from the stored file name.

---

## 🛠️ Dev Scripts

```bash
npm run dev       # Start with nodemon
npm run prisma    # Run Prisma CLI
```

---

## 📦 Environment File Example

See `.env.example` for environment variable setup.

---

## ✨ Author

Built by **Muhammad Shakeeb**  
GitHub: [@shakeeb416](https://github.com/shakeeb416)

---

## 🪪 License

This project is licensed under the MIT License.
