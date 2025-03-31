# MotiMate Backend

MotiMate is a backend service built with the [NestJS Framework](https://nestjs.com/) that enables users to set, track, and commit to their workout goals in a social and motivating environment. Users can join groups, participate in group chats, and contribute to a shared fund as part of an accountability system.

## Features

- **User Authentication**: Secure authentication system for users.
- **Workout Goal Setting**: Users can set their personal weekly workout goals (number of exercise days per week).
- **Group Management**: Users can create or join groups to track goals together.
- **Goal Commitment & Penalties**: Users commit to their weekly goals, and those who fail to meet their commitment must pay a penalty into the group fund.
- **Group Fund & Payouts**: The collected fund can be used for group activities and payouts.
- **Group Chat**: Messaging system for group communication, including text and image sharing.
- **Workout Logging**: Users log workouts with a photo that is shared with the group.

## Getting Started

### Prerequisites

Ensure you have the following installed:

- [Node.js](https://nodejs.org/) (LTS)
- [NestJS CLI](https://docs.nestjs.com/cli/overview)
    ```bash
    npm i -g @nestjs/cli
    ```

### Installation

1. Clone the repository:

    ```sh
    git clone https://github.com/your-repo/motimate-backend.git
    cd motimate-backend
    ```

2. Install dependencies:

    ```sh
    npm install
    ```

3. Create an environment file and configure it with the variables available @SturmDerLiebe:

    ```sh
    touch .env.dev
    ```

### Running the Server

- Start the development server with:

    ```sh
    npm run start:dev
    ```

The server will run at `http://localhost:3000` by default.

- Start the Production server locally with:

    ```sh
    npm run start:prod
    ```

### Run tests

```sh
# unit tests
npm run test

# e2e tests
npm run test:e2e

# test coverage
npm run test:cov
```

## Tech Stack

- **Framework**: NestJS
- **Database**: PostgreSQL
- **ORM**: TypeORM
- **Authentication**: Session-based authentication
- **Messaging**: WebSockets for real-time chat

## Contributing

If you are part of the MotiMate Team:

1. Create a branch based on `main` locally
    1. The branch naming should follow the format `<TICKET_NUMBER>/<ShortTitleInPascalCase>` so for example `20/AddPasswordEncryption`
2. Push your changes from that branch
3. Create a Pull Request from with that branch onto `main`. Make sure to connect the ticket with your related branch

---

We also welcome external contributions! Please fork the repository and create a pull request with your changes.

## License

This project is licensed under the GPL-3.0 License.

---

For any questions or support, reach out to the MotiMate team!
