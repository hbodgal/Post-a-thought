# Microservices Architecture with Event-Driven Communication

This app allows users to share their thoughts and comment on posts. It includes a robust content moderation system to ensure the platform is used appropriately and safely.

## Overview
This project implements a microservices architecture using Node.js and Express, orchestrated with Kubernetes (K8s) and managed with Skaffold. It utilizes an event-driven approach for communication between services.
This architecture provides flexibility, scalability, and fault tolerance through asynchronous event-driven communication, suitable for modern cloud-native applications.

## Services
1. **Post Service**: Manages creation and listing of posts.
2. **Comment Service**: Handles creation and listing of comments associated with posts.
3. **Moderation Service**: Responsible for moderating comments (pending, approved, rejected).
4. **Query Service**: Aggregates data from Post and Comment services for efficient querying.

## Event Bus
An event bus facilitates asynchronous communication between microservices:
- **Implementation**: Custom event-bus using Express to emit and listen for events.
- **Integration**: Each service emits events on actions (e.g., new post, new comment) which are consumed by the Query Service for data aggregation.

## State Management
1. **Initial State**: Posts and comments are stored in respective databases (SQL/NoSQL) per service.
2. **Event Store**: Events are persisted in the event bus data store for later processing in case of service failures.

## Deployment and Scalability
- **Dockerization**: Containerized microservices and client applications using Docker for consistency across environments.
- **Kubernetes**: Deployed microservices on Kubernetes for orchestration, utilizing Ingress Nginx for external access and Skaffold for automated builds and deployments.

## Handled Failures
1. **Service Dependencies**: Minimized through asynchronous communication via the event bus.
2. **Fault Tolerance**: Event store ensures events are not lost, allowing services to catch up on missed events during downtime.

## Usage
1. **Local Development**: Use Skaffold for local development, ensuring changes are reflected in Docker containers and Kubernetes pods.
2. **Deployment**: Deploy using Kubernetes YAML files and Helm charts, managing resources and scaling rules.
