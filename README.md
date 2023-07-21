# Globant Code Challenge - Rodrigo Guadalupe
This repository includes the implementation of `Globant Backend Developer Code Challenge`, that consists on an API that manages Organizations, Tibres, Repositories and Metrics. The challenge also includes a verification API used to validate the status of Repositories.
## Tech Stack
- Typescript
- Node.js + Express.js
- Prisma ORM + [CockroachDB](https://www.cockroachlabs.com/) (Postgres)
- Docker

## Project Structure
The project structure is organized in the following directories: 
```
.
├── verification-service     # Verification service Express app
    ├── src                 # Source files of the solution
    └── test                # Tests for solution services
├── repository-service      # Repository Express app
    ├── src                 # Source files of the solution
    ├── prisma              # Prisma ORM schema definition and migrations
    └── test                # Tests for solution services
├── .gitignore
├── docker-compose.yml
└── README.md
```

## Environment Variables
The project has 2 main environment variables: 
```
VERIFICATION_SERVICE_URL    # URL of the verification service API
DATABASE_URL                # CockroachDB Postgres database connection url
```

## Execution
Here we could find guides to test, build and execute the solution.
### Run tests
In order to run the project unit tests, we first need to go to `repository-service` directory.
```sh
cd repository-service
```
Then, we need to install the project's dependencies.
```sh
yarn install 
# or
npm install
```
Finally, to execute the unit test we run:
```sh
yarn test
# or
npm test
```
Tests run will be shown on CLI and a jest `coverage` report will be displayed and saved on a `coverage` directory.

We would follow the same steps to run the unit tests from the Anti-Fraud service, but this time with the `verification-service` directory.
```sh
cd verification-service
yarn install  or  npm install
yarn test  or  npm test
```

### Build package
In order to generate a deployment ready build, we would follow the next steps for both applications:
```sh
cd repository-service
#or
cd verification-service
```
Then, we need to install the project's dependencies.
```sh
yarn install 
# or
npm install
```
Finally, to create the build run the following command:
```sh
yarn build
# or
npm build
```
This will first execute the following steps: 
 - Run project's tests
 - Create a Typescript build using the tsconfig.build.json file

## Docker Execution
Before starting the execution process: 
 - Make sure that you have docker already installed (it could be [docker-desktop](https://docs.docker.com/desktop/) or [docker-engine](https://docs.docker.com/engine/)).
 - Make sure you have docker Compose plugin installed (install [compose-plugin](https://docs.docker.com/compose/install/)). IMPORTANT: If you have a docker-desktop installation, the Compose plugin is already included.

First, we need to be on project `root` directory. There, we need to run the following command to build the services specified on the `docker-compose.yml` file: 

```sh
docker compose -f "docker-compose.yml" up -d --build 
```

The compose file will create and run the following: 
```
- Repository Service    (PORT:'3000')
- Verification Service   (PORT:'3005')
```

After the execution is completed, there is one last step to start using the application. We will call a seed function to populate some data in the database for the `Repository Service`.

```sh
yarn prisma db seed
# or
npm prisma db seed
```
This seed will create the following:
```
- 3 Organizations
- 2 Tribes for each Organization (6 total)
- 4 Repositories for each Tribe (24 total)
- 1 Metric for each Repository (24 total)
```

#### That's All !!

Now you can download and import the [Postman Collection](./res/Globant%20Challenge.postman_collection.json) to start testing the app services. 

Also you can find a published online version of the [documentation here](https://documenter.getpostman.com/view/5443228/2s946k7rHp).


### Other useful commands:

- Stop all the services
```sh
docker compose -f "docker-compose.yml" down 
```

- Restart all the services (It would execute down and up sequentially)
```sh
docker compose -f "docker-compose.yml" down 
docker compose -f "docker-compose.yml" up -d --build 
```