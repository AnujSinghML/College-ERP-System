# College ERP System

## 🎓 Project Overview

A comprehensive Web-based College Enterprise Resource Planning (ERP) System designed to streamline academic operations through role-based access and robust database management.

### Key Features

#### User Roles
- **Admin**: Complete system management and data control
- **Faculty**: Course and student management tools
- **Students**: Personal academic progress tracking

### Technologies Used
- **Frontend**: HTML, CSS, JavaScript (Vanilla)
- **Backend**: Node.js, Express.js
- **Database**: MySQL
- **Authentication**: Role-based access control

## 🚀 System Capabilities

### Admin Functionalities
- Full CRUD operations on college data
- College information updates
- Comprehensive report generation
- User management
- System configuration

### Faculty Capabilities
- Schedule management
- Student enrollment tracking
- Course administration
- Performance monitoring

### Student Dashboard
- Personal information view
- Academic progress tracking
- Read-only access to relevant information

## 🔧 Prerequisites

### System Requirements
- Node.js (v14+ recommended)
- MySQL Server
- Web Browser
- Live Server Extension (for frontend)

### Required Software
- Visual Studio Code
- MySQL Workbench
- Web Browser (Chrome/Firefox)

## 📦 Installation Steps

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/college-erp-system.git
cd college-erp-system
```

### 2. Database Setup
#### Import MySQL Dump
1. Open MySQL Workbench
2. Create a new database named `college_erp`
3. Import the provided SQL dump file:
```bash
mysql -u root -p college_erp < database_dump.sql
```

### 3. Backend Configuration
1. Navigate to project directory
2. Install dependencies:
```bash
npm install
```

### 4. Database Credentials
Update `backend.js` with database connection:
```javascript
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'Anuj123',
  password: 'anuj123',
  database: 'college_erp'
});
```

### 5. Start the Application

#### Start Backend Server
```bash
node backend.js
```

#### Launch Frontend
1. Open `landing-page/index.html` with Live Server
2. Recommended: Use VS Code Live Server extension

### 6. Login Credentials
- **Username**: Anuj123
- **Password**: anuj123

## 🔒 Authentication Flow
1. Enter credentials
2. System validates user role
3. Redirects to role-specific dashboard
4. Access controlled based on permissions

## 📊 Database Schema
- Users Table
- Students Table
- Faculty Table
- Courses Table
- Enrollments Table
- Schedules Table

## 🛠 CRUD Operations
- Create: Add new records
- Read: Retrieve and display data
- Update: Modify existing records
- Delete: Remove records with proper authorization

## 🔍 Additional Features
- Responsive Design
- Secure Authentication
- Real-time Data Updates
- Comprehensive Reporting

## 🤝 Contributing
1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Open pull request

## 👥 Contact
- **Developer**: [Anuj Sanjay Singh]
- **Email**: [anujsanjaysinghwork@gmail.com]

## 📌 Project Status
Active Development - Version 1.0
(Was Temporarily deployed on AWS EC2 instance free tier.)
```
