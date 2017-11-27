# Resource Wall

## Features:
* users can save an external URL along with a title and description
* users can search for already-saved resources created by any user
* users can categorize any resource under a topic and create new categories
* users can comment on any resource
* users can rate any resource
* users can change their ratings
* users can like any resource
* users can unlike any resource
* users can view all their own and all liked resources on one page ("My resources")
* users can register, log in, log out and update their profile

## Getting Started

1. Create the `.env` by using `.env.example` as a reference: `cp .env.example .env`
2. Update the .env file with your correct local information
3. Install dependencies: `npm i`
4. Fix to binaries for sass: `npm rebuild node-sass`
5. Run migrations: `npm run knex migrate:latest`
  - Check the migrations folder to see what gets created in the DB
6. Run the server: `npm run local`
7. Visit `http://localhost:8080/`

## Dependencies

- Node 5.10.x or above
- NPM 3.8.x or above
- bcrypt 1.0.3
- body-parser 1.18.2
- connect-flash 0.1.1
- cookie-session 2.0.0-beta.3
- dotenv 4.0.0
- ejs 2.5.7
- express 4.16.2
- knex 0.14.1
- knex-logger 0.1.0
- morgan 1.9.0
- node-sass-middleware 0.11.0
- pg 7.4.0
- nodemon 1.9.2

## Screenshots
![Login Screen](https://github.com/The-Promised-End/midterm/blob/master/docs/Login-Page.png?raw=true)
![Create a new resource](https://github.com/The-Promised-End/midterm/blob/master/docs/Create-a-new-resource.png?raw=true)
![Like, rate, and comment on a resource](https://github.com/The-Promised-End/midterm/blob/master/docs/Like-rate-comment-on-resource.png?raw=true)
![Changing your details](https://github.com/The-Promised-End/midterm/blob/master/docs/Change-your-details.png?raw=true)
