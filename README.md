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

## GET /posts

To get all posts, make a GET request to /posts/. No authorization required.

* You may use the URL attribute `sort` to select between sort by `date` or by `likes`.

* You may use the URL attribute `limit` to specify how many posts to retrieve. This defaults to 20.

Responds with an array of posts

```
[
  {
    "author": {
      "id": "5daf86a23a5e73081c00a436",
      "name": "Mohammad Tourjoman",
      "country": "United States"
    },
    "createdAt": "1571786725323",
    "likes": 1,
    "_id": "5daf8ffff3d7f031944cc4f6",
    "title": "This is my first post",
    "body": "This post was not posted anonymously.",
    "__v": 0
  },
  {
    "author": {
      "id": "5daf86a23a5e73081c00a436",
      "name": "Anonymous Author",
      "country": ""
    },
    "createdAt": "1571786725323",
    "likes": 0,
    "_id": "5daf900df3d7f031944cc4f7",
    "title": "This is my second post",
    "body": "This post was posted anonymously.",
    "__v": 0
  }
]
```

## GET /posts/awaiting

To retrieve posts awaiting approval, make a GET request to /posts/awaiting with an `authorization` property holding a valid token in the request headers.
The token should belong to a user with a `level` of `admin` or `owner` in order to access this resource.

Responds with an array of all posts currently pending approval:

```
[
  {
    "author": {
      "id": "5daf86a23a5e73081c00a436",
      "name": "Mohammad Tourjoman",
      "country": "United States"
    },
    "createdAt": "1571786725323",
    "likes": 1,
    "_id": "5daf8ffff3d7f031944cc4f6",
    "title": "This is my first post",
    "body": "This post was not posted anonymously.",
    "__v": 0
  }
]
```

## GET /posts/:id

To retrieve a specific post, make a GET request to /posts/:id where `:id` is the id of a specific post. No authorization required.

If the post exists, you get the following reponse:

```
{
  "author": {
    "id": "5daf86a23a5e73081c00a436",
    "name": "Mohammad Tourjoman",
    "country": "United States"
  },
  "createdAt": "1571786725323",
  "likes": 1,
  "_id": "5daf8ffff3d7f031944cc4f6",
  "title": "This is my first post",
  "body": "This post was not posted anonymously.",
  "__v": 0
}
```

## GET /posts/mine

To retrieve all posts made by the signed-in user, make a GET request to /posts/mine with an `authorization` property holding a valid token in the request headers.

Responds with an array of IDs of posts made by the current user:

```
[
  "5daf86a23a5e73081c00a436",
  "5daf8aacd92e9c49bca97650",
  "5daf8dc905ae89438ce9b4d1",
  "5daf8ffff3d7f031944cc4f6",
  "5daf900df3d7f031944cc4f7"
]
```

## GET /posts/liked

To retrieve all posts liked by the signed-in user, make a GET request to /posts/liked with an `authorization` property holding a valid token in the request headers.

Reponds with an array of IDs of posts liked by the current user:

```
[
  "5daf86f86c7c2d6b40751a4e",
  "5daf8ffff3d7f031944cc4f6"
]
```

## POST /posts/new

To create a new post, make a post request to POST /posts/new with an `authorization` property holding a valid token in the request headers and the following payload:

* The `anonymous` property is optional

```
{
	"title": "This is my second post",
	"body": "This post was posted anonymously.",
	"anonymous": "true"
}
```

Responds with the newly created post, timestamped and reformatted

```
{
  "createdAt": "1571786725323",
  "likes": 0,
  "_id": "5daf900df3d7f031944cc4f7",
  "author": {
    "id": "5daf86a23a5e73081c00a436",
    "name": "Anonymous Author",
    "country": ""
  },
  "title": "This is my second post",
  "body": "This post was posted anonymously.",
  "__v": 0
}
```

Hint: You may use the createdAt value to come up with a date and time (You can use momentjs to do this)

## POST /posts/approve/:id

To approve a post, make a POST request to /posts/approve/:id where `:id` is the id of the post you want to approve with an `authorization` property holding a valid token in the request headers.
The token should belong to a user with a `level` of `admin` or `owner` in order to perform this action.

Responds with the newly approved post:

```
{
  "createdAt": "1571786725323",
  "likes": 0,
  "_id": "5daf900df3d7f031944cc4f7",
  "author": {
    "id": "5daf86a23a5e73081c00a436",
    "name": "Anonymous Author",
    "country": ""
  },
  "title": "This is my second post",
  "body": "This post was posted anonymously.",
  "__v": 0
}
```

## POST /posts/like/:id

To like or unlike a post, make a POST request to /posts/like/:id with an `authorization` property holding a valid token in the request headers. If the ID is valid, a like will be added/removed from that post.

Responds with an array of IDs of all current user's liked posts:

```
[
  "5daf86f86c7c2d6b40751a4e",
  "5daf8ffff3d7f031944cc4f6"
]
```

## DELETE /posts/:id

To delete a specific post, make a DELETE request to /posts/:id with an `authorization` property holding a valid token in the request headers. If the ID is valid and the post belongs to the current user, it will be deleted.

Responds with an array of IDs of all the current user's *remaining* posts

```
[
  "5daf86a23a5e73081c00a436",
  "5daf8aacd92e9c49bca97650",
  "5daf8dc905ae89438ce9b4d1"
]
```