# User API Spec

## Register User

End POint : POST /api/users/register

Request Body :

```json
{
    "username" : "Christy",
    "Password": "Christy123",
    "email": "christy123@gmail.com"
}
```

Response Body(success) :
```json
{
    "data": {
        "username" : "Christy",
        "Password": "Christy123",
        "email": "christy123@gmail.com"
    }
}
```
Response Body(failed) :
```json
{
    "errors": "User Already Registered"
}
```

## Login User

End POint : POST /api/users/login

Request Body :

```json
{
    "email": "christy123@gmail.com",
    "Password": "Christy123",
}
```

Response Body(success) :
```json
{
    "data": {
        "email": "christy123@gmail.com",
        "Password": "Christy123",
        "token": "session_id_generator"
    }
}
```
Response Body(failed) :
```json
{
    "data": "Username or Password is wrong"
}
```

## Get User
End POint : GET /api/users/current

Headers: 
- Authorization: Token

Request Body :

Response Body(success) :
```json
{
    "data": {
        "Username": "Christy",
        "email": "christy123@gmail.com",
    }
}
```
Response Body(failed) :
```json
{
    "data": "Unauthorized"
}
```

## Update User

End POint : PATCH /api/users/current

Headers: 
- Authorization : Token

Request Body :

```json
{
    "username" : "Christy", //optional
    "Password": "Christy123", //optional
    "email": "christy123@gmail.com" //optional
}
```

Response Body(success) :
```json
{
    "data": {
        "username" : "Christy",
        "Password": "Christy123",
        "email": "christy123@gmail.com"
    }
}
```

## Logout User
End POint : DELETE /api/users/current

Headers: 
- Authorization : Token


Response Body(success) :
```json
{
    "data": true
}
```

