# Deplosit Plan

## Pre requisites

Node Version: 18.16.1

NPM version: 9.5.1

## Setup

1. npm install

2. Populate your `.env`

```
NODE_ENV=development
JWT_SECRET=
MONGO_URL=
CLIENT_DOMAIN_URL=http://localhost:3000
```

## Run

Local: `npm run start:dev`

Production Build: `npm run start:prod`

## Testing

Unit Test: `npm run test`

E2E Integration: `npm run e2e`

## Authentication

1. See [Sign Up](#1-sign-up) or [Login](#2-login) on how to obtain a `token`

2. In your request `Header`, attach a key of `Authorization` and value of `Bearer [your token]`

## Endpoints:

### 1. Sign Up:

```bash
POST localhost:5000/api/auth/signup
```

Body (raw/json) :

```json
{
  "email": "john@mail.com",
  "name": "Johny",
  "password": "1234"
}
```

Response:

```json
{
  "_id": "6560514a6b7613df1a6c748f",
  "name": "Johny",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImpvaG5AbWFpbC5jb20iLCJpYXQiOjE3MDA4MTEwODMsImV4cCI6MTcwNTk5NTA4M30.LYuNZc_8gmUQ7XJUwcNHc7eebrXvAioL7_96WQUMBOA",
  "email": "john@mail.com",
  "isAdmin": false
}
```

### 2. Login

```
POST localhost:5000/api/auth/signin
```

Body (raw/json) :

```json
{
  "email": "john@mail.com",
  "password": "1234"
}
```

Response:

```json
{
  "_id": "6560514a6b7613df1a6c748f",
  "name": "Johny",
  "email": "john@mail.com",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImpvaG5AbWFpbC5jb20iLCJpYXQiOjE3MDA4MTEyODAsImV4cCI6MTcwNTk5NTI4MH0.-E4shO2GbwDhBE40iznM0U10waobUxU2kf2gysyQcvI",
  "isAdmin": false
}
```
