# Tickety

## [Tickety live site]
[Tickety live site]: https://tickety-app-by-mei.herokuapp.com/
## [Tickety wiki page]
[Tickety wiki page]: https://github.com/MeiMeiYS/tickety/wiki

## Tickety at a Glance
Tickety is an app where you can manage your work flow by stages and keep track of your tasks. Tickety is designed & coded by Mei Shih. Tickety app is built in 10 days in 2022 February. It is Mei's capstone project at App Academy. The most challenging part of building this app for Mei is implementing the drag and drop task card on the kanban board and dynamically updating the frontend state and backend data with no animation delay.

## Application Architecture
Tickety is built on React as frontend, Express as backend, and used PostgreSQL/Sequelize to setup database.

## Technologies Used

### React
Tickety is a React application. All display logic is handled by the React libraries.
### Redux
Tickety makes extensive use of Redux. All state management is handled with Redux, with thunks making API calls to the backend server for data.
### react-beautiful-dnd
react-beautiful-dnd is a higher level abstraction specifically built for lists (vertical, horizontal, movement between lists, nested lists and so on). Check out the documentation here: https://www.npmjs.com/package/react-beautiful-dnd

### ExpressJS
Express.js, or simply Express, is a back end web application framework for Node.js. It made frontend and backend connection easy for developers.

### PostgreSQL
PostgreSQL, also known as Postgres, is a free and open-source relational database management system emphasizing extensibility and SQL compliance. PostgreSQL is simple to work with, and is easily manipulable using Sequelize.

### Sequelize
Sequelize is a promise-based Node.js ORM for Postgres, MySQL, MariaDB, SQLite and Microsoft SQL Server.

## Getting started
1. Clone this repository.
2. To install packages for both the backend and the frontend. In the root directory, run
    * `npm install`
3. Run `cd backend/` to go into backend directory. Create a **.env** file based on the **.env.example** file, replace all square brackets with proper settings for your local environment.
> Recommendation to genereate a strong secret: create a random string using
> `openssl` (a library that should be installed in your Ubuntu/MacOS shell
> already). Run `openssl rand -base64 10` to generate a random JWT secret.
4. Create a database user with the same name and password as found in your **.env** file with CREATEDB privileges.
5. Run
   * `npm run db:create`
   * `npm run db:migrate`
   * `npm run db:seed:all`
   * `npm start`
6. Now your backend local server should be successfully running. Double check in your terminal and browser.

7. Open another terminal and run `cd frontend/` to go into frontend directory. Then run
    * `npm start`
8. Now you should successfully see the app in your browser.
