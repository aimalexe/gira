# Gira 📋

A modern project management application built with Next.js and Node.js. Gira helps teams organize projects, manage tasks, and collaborate efficiently.

## ✨ Features

- 👥 **User Management** - Registration, authentication, and user profiles
- 🏗️ **Project Management** - Create, edit, and manage projects
- ✅ **Task Tracking** - Add tasks, assign to users, and track progress
- 📎 **File Attachments** - Upload and manage task attachments
- 🎨 **Modern UI** - Clean and responsive interface with Tailwind CSS
- 🔐 **Secure Authentication** - JWT-based authentication system
- 📧 **Email Notifications** - Automated email notifications

## 🛠️ Tech Stack

### Frontend
- **Next.js 15** - React framework with server-side rendering
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **Formik & Yup** - Form handling and validation
- **Zustand** - State management
- **Headless UI** - Accessible UI components

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database with Mongoose ODM
- **JWT** - JSON Web Token authentication
- **Multer** - File upload handling
- **Nodemailer** - Email service
- **Bcrypt** - Password hashing

## 📁 Project Structure

```
gira/
├── client/                 # Next.js frontend application
│   ├── src/
│   │   ├── app/           # App router pages
│   │   ├── components/    # Reusable components
│   │   ├── types/         # TypeScript type definitions
│   │   ├── validators/    # Form validation schemas
│   │   └── styles/        # Global styles
│   └── package.json
├── server/                # Node.js backend application
│   ├── src/
│   │   ├── controllers/   # Request handlers
│   │   ├── models/        # Database models
│   │   ├── routes/        # API routes
│   │   ├── middlewares/   # Custom middleware
│   │   ├── validators/    # Input validation
│   │   ├── utils/         # Helper functions
│   │   └── configs/       # Configuration files
│   └── package.json
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/aimalexe/gira.git
   cd gira
   ```

2. **Install dependencies**
   ```bash
   # Install server dependencies
   cd server
   npm install

   # Install client dependencies
   cd ../client
   npm install
   ```

3. **Environment Setup**
   
   Create `.env` file in the `server` directory:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/gira
   JWT_SECRET=your_jwt_secret_key
   JWT_EXPIRES_IN=7d
   
   # Email configuration (optional)
   EMAIL_SERVICE=gmail
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_app_password
   ```

4. **Start the development servers**
   
   **Backend server:**
   ```bash
   cd server
   npm run dev
   ```
   
   **Frontend application:**
   ```bash
   cd client
   npm run dev
   ```

5. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## 📝 Usage

1. **Register** a new account or **login** with existing credentials
2. **Create projects** and invite team members
3. **Add tasks** to projects and assign them to users
4. **Upload files** and attach them to tasks
5. **Track progress** and manage project workflows

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- **Aimal Khan** - Main Developer
- **Abdullah TRS** - Project Maintainer

Built with ❤️ using Next.js and Node.js
