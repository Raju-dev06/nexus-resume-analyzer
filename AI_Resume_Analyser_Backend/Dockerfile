# Stage 1: Build the application
FROM maven:3.9.6-eclipse-temurin-21 AS build
WORKDIR /app

# Copy the pom.xml and download dependencies
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy the source code and package the application
COPY src ./src
RUN mvn clean package -DskipTests

# Stage 2: Run the application
FROM eclipse-temurin:21-jre
WORKDIR /app

# Copy the built JAR file from the build stage
COPY --from=build /app/target/resumeanalyzer-1.0.0-SNAPSHOT.jar app.jar

# Expose port 8080 (Render will map this automatically)
EXPOSE 8080

# Start the application
ENTRYPOINT ["java", "-jar", "app.jar"]
