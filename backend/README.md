# ShopiNow Backend API

RESTful API backend for the ShopiNow e-commerce platform built with Spring Boot and PostgreSQL.

## 📋 Table of Contents

- [Tech Stack](#-tech-stack)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Database Setup](#-database-setup)
- [Configuration](#-configuration)
- [Running the Application](#-running-the-application)
- [API Documentation](#-api-documentation)
- [Project Structure](#-project-structure)
- [License](#-license)
- [Author](#-author)
- [Acknowledgments](#-acknowledgments)

## 🛠️ Tech Stack

- **Framework**: Spring Boot 3.2.0
- **Language**: Java 17
- **Database**: PostgreSQL
- **ORM**: Spring Data JPA / Hibernate
- **Security**: Spring Security + JWT
- **Build Tool**: Maven
- **API Documentation**: Swagger/OpenAPI 3
- **Logging**: Logback with file output

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Java 17** or higher
  ```bash
  java -version
  ```

- **Maven 3.6+**
  ```bash
  mvn -version
  ```

- **PostgreSQL 12+**
  ```bash
  psql --version
  ```

- **Git** (for cloning the repository)

## 🚀 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd backend
   ```

2. **Build the project**
   ```bash
   mvn clean install
   ```

3. **Set up the database** (see [Database Setup](#database-setup))

4. **Configure application properties** (see [Configuration](#configuration))

## 🗄️ Database Setup

### 1. Install PostgreSQL

- **Windows**: Download from [PostgreSQL Downloads](https://www.postgresql.org/download/windows/)
- **macOS**: `brew install postgresql@15`
- **Linux**: `sudo apt install postgresql postgresql-contrib`

### 2. Create Database

```sql
-- Connect to PostgreSQL
psql -U postgres

-- Create database
CREATE DATABASE shopinow;

-- Verify creation
\l
```

### 3. Database Configuration

Update `src/main/resources/application.properties` with your database credentials:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/shopinow
spring.datasource.username=postgres
spring.datasource.password=your_password
```

**Note**: The application will automatically create tables and seed initial data on first run.

## ⚙️ Configuration

### Application Properties

Key configuration in `src/main/resources/application.properties`:

```properties
# Server
server.port=8080

# Database
spring.datasource.url=jdbc:postgresql://localhost:5432/shopinow
spring.datasource.username=postgres
spring.datasource.password=your_password

# JWT
jwt.secret=YourSecretKeyMustBeAtLeast256BitsLong
jwt.expiration=86400000  # 24 hours in milliseconds

# CORS
cors.allowed-origins=http://localhost:4200

# Logging
logging.file.name=logs/shopinow-backend.log
```

### Environment Variables (Recommended for Production)

For production, use environment variables instead of hardcoded values:

```bash
export SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/shopinow
export SPRING_DATASOURCE_USERNAME=postgres
export SPRING_DATASOURCE_PASSWORD=your_password
export JWT_SECRET=your-secret-key
export CORS_ALLOWED_ORIGINS=https://yourdomain.com
```

## 🏃 Running the Application

### Development Mode

```bash
# Run with Maven
mvn spring-boot:run

# Or run the JAR
mvn clean package
java -jar target/backend-1.0.0.jar
```

The application will start on `http://localhost:8080`

### Verify Installation

- **Health Check**: `http://localhost:8080/api/products`
- **Swagger UI**: `http://localhost:8080/swagger-ui.html`
- **API Docs**: `http://localhost:8080/v3/api-docs`

## 📚 API Documentation

### Swagger UI

Once the application is running, access the interactive API documentation at:

```
http://localhost:8080/swagger-ui.html
```

## 📁 Project Structure

```
backend/
├── src/
│   ├── main/
│   │   ├── java/com/shopinow/
│   │   │   ├── config/          # Configuration classes
│   │   │   ├── controller/      # REST controllers
│   │   │   ├── dto/             # Data Transfer Objects
│   │   │   ├── exception/       # Exception handlers
│   │   │   ├── model/           # Entity models
│   │   │   ├── repository/     # JPA repositories
│   │   │   ├── service/         # Business logic
│   │   │   └── ShopiNowApplication.java
│   │   └── resources/
│   │       └── application.properties
│   └── test/                    # Test files
├── logs/                        # Application logs
├── pom.xml                      # Maven configuration
└── README.md                    # This file
```

## 📄 License

This project is part of the ShopiNow e-commerce platform.

## 👤 Author

ShopiNow Development Team

## 🙏 Acknowledgments

- Spring Boot team
- PostgreSQL community
- All contributors

---

**Note**: This backend is designed to work with the ShopiNow frontend application. Ensure the frontend is configured to point to the correct API URL.
