Overview
This project implements a microservices architecture using Node.js and Express, orchestrated with Kubernetes (K8s) and managed with Skaffold. It utilizes an event-driven approach for communication between services.

Services
Post Service: Manages creation and listing of posts.
Comment Service: Handles creation and listing of comments associated with posts.
Moderation Service: Responsible for moderating comments (pending, approved, rejected).
Query Service: Aggregates data from Post and Comment services for efficient querying.
Event Bus
An event bus facilitates asynchronous communication between microservices:

Implementation: Custom event-bus using Express to emit and listen for events.
Integration: Each service emits events on actions (e.g., new post, new comment) which are consumed by the Query Service for data aggregation.
State Management
Initial State: Posts and comments are stored in respective databases (SQL/NoSQL) per service.
Event Store: Events are persisted in the event bus data store for later processing in case of service failures.
Deployment and Scalability
Dockerization: Containerized microservices and client applications using Docker for consistency across environments.
Kubernetes: Deployed microservices on Kubernetes for orchestration, utilizing Ingress Nginx for external access and Skaffold for automated builds and deployments.
Handling Failures
Service Dependencies: Minimized through asynchronous communication via the event bus.
Fault Tolerance: Event store ensures events are not lost, allowing services to catch up on missed events during downtime.
Database Access: Query Service can directly access databases to fetch data in case of service unavailability.
Future Improvements
Performance: Optimize event handling and data aggregation in the Query Service for scalability.
Monitoring: Implement monitoring and alerting for service health and event processing.
Security: Enhance security measures, including authentication and authorization for microservices.
Usage
Local Development: Use Skaffold for local development, ensuring changes are reflected in Docker containers and Kubernetes pods.
Deployment: Deploy using Kubernetes YAML files and Helm charts, managing resources and scaling rules.