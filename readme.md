Code / Environment Setup: 

- Download / Clone the repository: git clone git@github.com:vamsi-bulusu/Buy-Me.git 

- Install NodeJS library: https://nodejs.org/en/download

Install Dependencies: npm install

Database / Schema migration :  migrate the schema.sql file placed in the config folder.

Setup .env variables:
- DB_HOST = '<HOST>'
- DB_USER = '<USER_NAME>'
- DB_PASSWORD = '<PASS>'
- DB_DATABASE = '<DB_NAME>'
- DB_PORT = '<DB_PORT>'
- PORT = '<NODE_PORT>'
- SECRET_KEY = '<SECRET_KEY>'

To run express server: npm run develop

URL to Login page : http://localhost:PORT/api/login


Routes for your convenience:
- API Documentation
    * GET - /api/login - login page
    * POST - /api/login - Home page
    * GET - /api/register -> register page
    * POST - /api/register -> login page

- Test
  * create new user - '/api/register' 
  * login           - '/api/login' 


