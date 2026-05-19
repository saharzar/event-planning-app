# Event Planning API (Spring Boot)

Backend REST API for the Evently event planning platform.

## Run

```bash
cd backend
./mvnw spring-boot:run
```

On Windows:

```bash
mvnw.cmd spring-boot:run
```

Server: **http://localhost:8081**

Swagger UI: **http://localhost:8081/swagger-ui.html**

## Stack

- Spring Boot
- H2 in-memory database
- HTTP session authentication (`JSESSIONID` cookie)
- Spring Data JPA

## API base path

All endpoints are under `/api`.

Auth, events, and attendance controllers are documented in Swagger.
