# Luna eProcurement System

> *A fullstack company web app for enhanced project control and management.*

<p align='center'>
<img width=100 src="https://raw.githubusercontent.com/greyyT/luna-eprocurement-system/main/frontend/src/assets/icons/lunar-client.svg">
</p>

## Table of Contents

- [Luna eProcurement System](#luna-eprocurement-system)
  - [Table of Contents](#table-of-contents)
  - [Overview](#overview)
  - [App Architecture](#app-architecture)
  - [Installation](#installation)
  - [Features](#features)

## Overview

<p align="justify">
The <b>Luna eProcurement System</b> is an open-source project designed to simplify company management tasks. It offers a user-friendly interface for managing several aspects of your organization (users, projects, tasks, etc.). This <b>README</b> provides an overview of the project, its features, and instructions on how to get started.
</p>

Check out [Luna eProcurement System](https://greyyt.github.io/luna-eprocurement-system/) for live demo.

## App Architecture

The figure below gives an overview of the tools, languages, or frameworks that will be used to build this application.

<p align="center">
<img src="https://raw.githubusercontent.com/greyyT/luna-eprocurement-system/main/static/architecture.png">
</p>

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
VITE_BACKEND_API=http://localhost:8080/
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

## Features

- **Authentication**: Users can sign up and sign in to the application.

<img src="https://raw.githubusercontent.com/greyyT/luna-eprocurement-system/main/static/accounts-features.png">
<img src="https://raw.githubusercontent.com/greyyT/luna-eprocurement-system/main/static/sign-up-features.png">

- **Legal Entity**: Users can create, join legal entity (company).

<img src="https://raw.githubusercontent.com/greyyT/luna-eprocurement-system/main/static/create-entity-feature.png">
<img src="https://raw.githubusercontent.com/greyyT/luna-eprocurement-system/main/static/join-entity-feature.png">

In the legal entity, there are 5 roles in total: **Manager**, **Member**, **Administrator**, **Supervisor** and **Viewer**. **Manager** is the highest role in the legal entity and given to the one who creates that legal entity. **Manager** has the following features:

- **Manager** can manage users in legal entity (delete user):

<img src="https://raw.githubusercontent.com/greyyT/luna-eprocurement-system/main/static/user-delete.png" width="100%">

- **Manager** can edit user role, department and team:

<img src="https://raw.githubusercontent.com/greyyT/luna-eprocurement-system/main/static/user-edit.png">

- **Manager** can manage departments in legal entity (delete department):

<img src="https://raw.githubusercontent.com/greyyT/luna-eprocurement-system/main/static/department-delete.png">

- **Manager** can create department with provided name and code:

<img src="https://raw.githubusercontent.com/greyyT/luna-eprocurement-system/main/static/create-department.png">

- **Manager** can create team in department with provided name and code:

<img src="https://raw.githubusercontent.com/greyyT/luna-eprocurement-system/main/static/create-team.png">

- **Manager** can configure roles in legal entity, give the role permession to *Reject* or *Approve* (see later in **Purchase Requisition** features):

<img src="https://raw.githubusercontent.com/greyyT/luna-eprocurement-system/main/static/config-role.png">

Only the manager can access this **Settings** page and manage user in the legal entity.

The following features are available for all roles in the legal entity. Begins with **Product** features:

- User can view list of products, search for products by vendor, SKU, code and name and delete product:

<img src="https://raw.githubusercontent.com/greyyT/luna-eprocurement-system/main/static/product-list.png">

- User can create product and upload product image:

<img src="https://raw.githubusercontent.com/greyyT/luna-eprocurement-system/main/static/create-product.png">

- User can view product detail:

<img src="https://raw.githubusercontent.com/greyyT/luna-eprocurement-system/main/static/product-detail.png">

- User can associate product with vendor by add a price for that product:

<img src="https://raw.githubusercontent.com/greyyT/luna-eprocurement-system/main/static/add-price.png">

- User can edit or delete the price of the vendor associated with the product:

<img src="https://raw.githubusercontent.com/greyyT/luna-eprocurement-system/main/static/edit-price.png">

Next is the **Vendor** features:

- User can view list of vendors, search for vendors by code, name or business number and delete vendor:

<img src="https://raw.githubusercontent.com/greyyT/luna-eprocurement-system/main/static/vendor-list.png">

- User can create vendor and upload vendor image:

<img src="https://raw.githubusercontent.com/greyyT/luna-eprocurement-system/main/static/create-vendor.png">

- User can view vendor detail and delete a contact of the vendor:

<img src="https://raw.githubusercontent.com/greyyT/luna-eprocurement-system/main/static/vendor-detail.png">

- User can add contact to the vendor:

<img src="https://raw.githubusercontent.com/greyyT/luna-eprocurement-system/main/static/add-contact.png">