# Thingy-api-red
Thingy RESTful API for ASE Project 2017

## Authentication
Registering a new user or login with username and password respond with the user id and an access token. This access token is required for the following endpoints:

- All user endpoints
- All recommendation endpoints
- All user clothes endpoints

Every request to these endpoints needs to include the following authorization header:

`Authorization: Bearer ACCESS_TOKEN`

### Example
```
curl -X GET --header 'Accept: application/json' --header 'Authorization: Bearer EI39wZDQYvYcLlAyYsiaAW0JykVoE4b7fJYtHrsxuhM3jHj4Lx' 'http://0.0.0.0:3000/users/231'
```
