# ── Stage 1: Build with Maven ────────────────────────────────────────────────
FROM maven:3.9.6-eclipse-temurin-21-alpine AS build

WORKDIR /app

# Copy pom.xml first — lets Docker cache the dependency layer
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy source and build the JAR (skip tests — no DB available at build time)
COPY src ./src
RUN mvn clean package -DskipTests -B

# ── Stage 2: Run with a slim JRE ─────────────────────────────────────────────
FROM eclipse-temurin:21-jre-alpine

WORKDIR /app

# Copy only the fat JAR from the build stage
COPY --from=build /app/target/backend-0.0.1-SNAPSHOT.jar app.jar

# Render injects $PORT at runtime; Spring Boot reads it via server.port=${PORT:8080}
EXPOSE 8080

ENTRYPOINT ["java", "-Xmx512m", "-Xms256m", "-jar", "app.jar"]
