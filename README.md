# COMP3000 - Arkora Time-Tracking

Arkora is an essential time tracking tool for organisationS that require full control over their tracking and budgeting requirements. It enables organisation managers to control who is assigned to each budget, can view cost related information and view insights into budget usage, expenses and profitability. Furthermore, it enables employees to track their time and gain insights into their daily and weekly tracking requirements set by the organsation.

Visit: https://arkora.co.uk

# Technology

Arkora uses Yarn Workspaces to construct a monorepo.

- `ReactJs` - Build the interactive UI through components
- `AdonisJs` - NodeJs framework for building RESTful APIs
- `Docker` - containerised MYSQL and mailhog services

# Requirements

- `node` version `16` or above.
- `docker` installed.
- `yarn` version `1` (recommended) or above.

# Setup

1. Clone the repo and go into the root directory.
2. Change directory to `apps/server` and create a `.env` file with the contents of `.env.example` for that package.
3. Go back to root directory.
4. Change directory to `apps/client` and create a `.env` file with contents of `.env.example` for that package.
5. Go back to root directory and run `yarn` to install project dependencies.
6. Change directory to `apps/server` and run `docker-compose up -d` to start MySQL and Mailhog containers.
7. Finally, go back to root directory and run `yarn start` run both the client and server applications.
8. Visit `localhost:3000` for client.

# Authors

- Tom Adams
