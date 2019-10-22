# Refugee Stories API

## POST /auth/login

To login, make a POST request to /auth/login with the following payload:

```
{
  "email": "Some@email.com",
  "password": "SomePassword123" 
}
```

Responds with the user data, with an authorization token embedded:

```
{
  "_id": 5daf584b8ca80247b88f4943,
  "firstName": "Some",
  "lastName": "User",
  "email": "Some@email.com",
  "country": "United States",
  "token": "Token"
}
```

## POST /auth/register

To register a new user, make a POST request to /auth/register with the following payload:

* The `country` field is optional.

```
{
	"firstName": "Some",
	"lastName": "User",
	"email": "Some@email.com",
	"password": "Password123",
	"country": "Optional Country"
}
```

Responds with the newly created user data, with an authorization token embedded (Immediately logged in after registration):

```
{
  "_id": 5daf584b8ca80247b88f4943,
  "firstName": "Some",
  "lastName": "User",
  "email": "Some@email.com",
  "country": "United States",
  "token": "Token"
}
```