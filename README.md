# Gallerio - Rwandan Art Gallery Platform

A fullstack web application for showcasing and managing Rwandan art, built with Spring Boot and React.

## 🚀 Quick Start with Docker

### Prerequisites
- Docker Desktop installed and running
- Docker Compose (included with Docker Desktop)

### Running the Application

1. **Clone and navigate to the project:**
   ```bash
   git clone <repository-url>
   cd gallerio-fullstack-master
   ```

2. **Start all services:**
   ```bash
   docker compose up --build -d
   ```

3. **Access the application:**
   - **Frontend**: http://localhost:3000
   - **Backend API**: http://localhost:8080
   - **Database**: localhost:5432

## 👥 Default User Accounts

The application comes with pre-configured user accounts for testing:

### 🔐 Login Credentials

| Role | Email | Password | Description |
|------|-------|----------|-------------|
| **Admin** | `admin@gallerio.com` | `password123` | System administrator with full access |
| **Artist** | `artist@gallerio.com` | `password123` | Can upload and manage artworks |
| **Collector** | `collector@gallerio.com` | `password123` | Can browse and purchase artworks |

### 🎨 Sample Data

The database includes:
- **3 Default Users** (Admin, Artist, Collector)
- **2 Sample Artworks** uploaded by the artist
- **Roles and permissions** properly configured

## 🛠️ Development

### Backend (Spring Boot)
- **Port**: 8080
- **Database**: PostgreSQL
- **Framework**: Spring Boot 3.4.5
- **Security**: JWT Authentication

### Frontend (React)
- **Port**: 3000 (development) / 80 (production)
- **Framework**: React with Material-UI
- **State Management**: Redux Toolkit

### Database (PostgreSQL)
- **Port**: 5432
- **Database**: gallerio
- **Username**: postgres
- **Password**: Margot+250793833800

## 📋 Features

### For Artists:
- Upload and manage artworks
- Set pricing and descriptions
- View order history
- Manage profile and portfolio

### For Collectors:
- Browse available artworks
- Purchase artworks
- Message artists
- Manage orders and favorites

### For Admins:
- Manage all users
- Oversee artworks and orders
- System administration
- Analytics and reporting

## 🔧 Configuration

### Environment Variables
The application uses the following environment variables:

```yaml
# Database Configuration
DB_HOST: db
DB_PORT: 5432
DB_NAME: gallerio
DB_USERNAME: postgres
DB_PASSWORD: Margot+250793833800

# JWT Configuration
JWT_SECRET: mySecretKey
JWT_EXPIRATION: 86400000

# Spring Profile
SPRING_PROFILES_ACTIVE: prod
```

## 📊 Useful Commands

### Docker Commands
```bash
# View logs
docker compose logs -f

# View logs for specific service
docker compose logs -f backend
docker compose logs -f frontend
docker compose logs -f db

# Stop services
docker compose down

# Stop and remove volumes (WARNING: This will delete all data)
docker compose down -v

# Rebuild specific service
docker compose up --build -d backend
```

### Database Access
```bash
# Access PostgreSQL database
docker exec -it gallerio-postgres psql -U postgres -d gallerio

# View tables
\dt

# View users
SELECT * FROM users;
```

## 🎯 Testing the Application

1. **Login as Artist:**
   - Email: `artist@gallerio.com`
   - Password: `password123`
   - Upload new artworks, manage existing ones

2. **Login as Collector:**
   - Email: `collector@gallerio.com`
   - Password: `password123`
   - Browse artworks, make purchases

3. **Login as Admin:**
   - Email: `admin@gallerio.com`
   - Password: `password123`
   - Manage users, view system analytics

## 🔄 Creating New Users

If you want to create additional users:

1. **Register new account** through the frontend registration form
2. **Or use the admin panel** to create users directly
3. **Or access the database** and insert new records

## 🐛 Troubleshooting

### Common Issues

1. **Port conflicts**: Ensure ports 3000, 8080, and 5432 are available
2. **Database connection**: Check if PostgreSQL container is running
3. **Build failures**: Check Docker logs for specific error messages
4. **Frontend not loading**: Verify nginx container is running

### Reset Everything
```bash
# Stop and remove all containers and volumes
docker compose down -v

# Remove all images
docker compose down --rmi all

# Start fresh
docker compose up --build -d
```

## 📁 Project Structure

```
gallerio-fullstack-master/
├── backend/                 # Spring Boot API
│   ├── src/main/java/      # Java source code
│   ├── src/main/resources/ # Configuration files
│   └── Dockerfile          # Backend container config
├── frontend/               # React application
│   ├── src/               # React source code
│   ├── public/            # Static files
│   └── Dockerfile         # Frontend container config
├── docker-compose.yml     # Multi-container setup
└── README.md             # This file
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

---

**Happy Art Collecting! 🎨**