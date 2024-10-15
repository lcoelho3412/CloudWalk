# Cloudwalk Backend Service

## Description
A backend service using Fastify, Knex, and SQLite with TypeScript and Zod for building robust, type-safe endpoints.

## App Diagram 
![image](../Cloudwalk/images/App_Entity_Relationship.png)

## Features
- **User Creation**: Create a new user.
- **Emotion Logging**: Log emotions for users and update their credit limits.
- **Credit Limit Updates**: Automatically update users' credit limits based on logged emotions.

## Installation
1. **Clone the repository**:
    ```sh
    git clone github.com/yourusername/cloudwalk.git](https://github.com/lcoelho3412/CloudWalk
    cd cloudwalk
    ```
2. **Install dependencies**:
    ```sh
    npm install
    ```
3. **Run the application**:
    ```sh
    npm run dev
    ```

## Usage
Here are some example API requests and responses:

- **POST /users**: Create a user
    ```sh
    curl -X POST -H "Content-Type: application/json" -d '{"name": "John Doe"}' http://localhost:3000/users
    ```
    Response:
    ```json
    {
      "message": "User created successfully"
    }
    ```

- **POST /emotions**: Add an emotion and update the credit limit
    ```sh
    curl -X POST -H "Content-Type: application/json" -d '{"user_id": "user-uuid", "emotion_type": "positive", "intensity": 7}' http://localhost:3000/emotions
    ```
    Response:
    ```json
    {
      "message": "Emotion added and credit limit updated successfully"
    }
    ```

- **GET /emotions**: Retrieve all emotions
    ```sh
    curl http://localhost:3000/emotions
    ```
    Response:
    ```json
    [
      {
        "user_id": "user-uuid",
        "emotion_type": "positive",
        "intensity": 7,
        "created_at": "2023-01-01T00:00:00Z"
      },
      ...
    ]
    ```

- **GET /credit-limits**: Retrieve all credit limits
    ```sh
    curl http://localhost:3000/credit-limits
    ```
    Response:
    ```json
    [
      {
        "user_id": "user-uuid",
        "credit_limit": 5000,
        "updated_at": "2023-01-01T00:00:00Z"
      },
      ...
    ]
    ```

- **GET /credit-limit/:user_id**: Retrieve the credit limit for a specific user
    ```sh
    curl http://localhost:3000/credit-limit/user-uuid
    ```
    Response:
    ```json
    {
      "user_id": "user-uuid",
      "credit_limit": 5000,
      "updated_at": "2023-01-01T00:00:00Z"
    }
    ```

- **GET /users**: Retrieve all users
    ```sh
    curl http://localhost:3000/users
    ```
    Response:
    ```json
    [
      {
        "user_id": "user-uuid",
        "name": "John Doe"
      },
      ...
    ]
    ```

## Scripts
- **dev**: Runs the application in development mode.
    ```sh
    npm run dev
    ```
- **lint**: Lints the project files.
    ```sh
    npm run lint
    ```
- **knex**: Runs Knex commands with TypeScript support.
    ```sh
    npm run knex
    ```

## Dependencies
- **Fastify**: Fast and low overhead web framework.
- **Knex**: SQL query builder for relational databases.
- **SQLite3**: SQL database engine.
- **TypeScript**: Superset of JavaScript that
