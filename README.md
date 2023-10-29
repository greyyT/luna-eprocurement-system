# Luna eProcurement System

<p align='center'>
<img width=100 src="https://raw.githubusercontent.com/greyyT/luna-eprocurement-system/main/frontend/src/assets/icons/lunar-client.svg">
</p>

## Table of Contents

- [Overview](#overview)
- [Installation](#installation)

## Overview

<p align="justify">
The **Luna eProcurement System** is an open-source project designed to simplify company management tasks. It offers a user-friendly interface for managing several aspects of your organization (users, projects, tasks, etc.). This **README** provides an overview of the project, its features, and instructions on how to get started.
</p>

## Installation

To run this project locally, follow these steps:
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
DB_NAME=luna-postgres
DB_USER=luna-postgres
DB_PASSWORD=luna-postgres
DB_HOST=postgres
DB_PORT=5432
```
