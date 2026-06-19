# syntax=docker/dockerfile:1.7

FROM eclipse-temurin:21-jdk-alpine AS build
WORKDIR /app

COPY mvnw .
COPY .mvn .mvn
COPY pom.xml .

RUN chmod +x mvnw

RUN --mount=type=cache,target=/root/.m2 \
    ./mvnw -B -ntp \
    -Dmaven.wagon.http.retryHandler.count=5 \
    -Dmaven.wagon.httpconnectionManager.ttlSeconds=120 \
    dependency:go-offline

COPY src src

RUN --mount=type=cache,target=/root/.m2 \
    ./mvnw -B -ntp \
    -DskipTests \
    -Dmaven.wagon.http.retryHandler.count=5 \
    -Dmaven.wagon.httpconnectionManager.ttlSeconds=120 \
    clean package

FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

ENV JAVA_TOOL_OPTIONS="-Xms128m -Xmx512m -XX:+UseG1GC"

COPY --from=build /app/target/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]