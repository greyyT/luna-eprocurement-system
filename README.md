# Luna eProcurement System

<p align='center'>
<img width=100 src="https://raw.githubusercontent.com/greyyT/luna-eprocurement-system/main/frontend/src/assets/icons/lunar-client.svg">
</p>

## Table of Contents

- [Overview](#overview)
- [Installation](#installation)
- [Features and Usages](#features-and-usages)

## Overview

<p align="justify">
The <b>Luna eProcurement System</b> is an open-source project designed to simplify company management tasks. It offers a user-friendly interface for managing several aspects of your organization (users, projects, tasks, etc.). This <b>README</b> provides an overview of the project, its features, and instructions on how to get started.
</p>

Check out [Luna eProcurement System](https://greyyt.github.io/luna-eprocurement-system/) for live demo.

## Installation

To run this project locally, follow these steps (make sure to have Docker Desktop or its related packages installed, check out at [Docker Desktop](https://www.docker.com/products/docker-desktop/):
1. Clone this repo:

```sh
git clone git@github.com:greyyT/luna-eprocurement-system.git
cd luna-eprocurement-system
```

2. Create a `.env` file in `./frontend` with these values

```ini
VITE_DEPLOYMENT=local
VITE_BACKEND_API=http://localhost:8000
```

3. Create a `.env` file in `./backend/core` with these values

```ini
SECRET_KEY=django-insecure-abc # replace abc with your secret
ALGORITHM=HS256 # Jwt encode method, recommend using HS256
# The following .env variables can be modified based on the settings in the ./backend/Dockerfile.
# You can modified it and change these .env values.
DB_NAME=luna-postgres
DB_USER=luna-postgres
DB_PASSWORD=luna-postgres
DB_HOST=postgres # Check the ./docker-compose.yml postgre service name.
DB_PORT=5432
```

4. Run the application (make sure to have port 5432 - default port of postgresql inactive)

```sh
make up
```

Access the application in your web browser ([http://localhost:3000/](http://localhost:3000/)).

You can check the `./Makefile` file for commands used in this project.

## Features and Usages


