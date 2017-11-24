'use strict';

require('dotenv').config();

const PORT        = process.env.PORT || 8080;
const ENV         = process.env.ENV || 'development';
const express     = require('express');
const bodyParser  = require('body-parser');
const sass        = require('node-sass-middleware');
const app         = express();

const knexConfig  = require('./knexfile');
const knex        = require('knex')(knexConfig[ENV]);
const morgan      = require('morgan');
const knexLogger  = require('knex-logger');

// Seperated Routes for each Resource
const usersRoutes = require('./routes/users');
const resourcesRoutes = require('./routes/resources');

// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
//         The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
app.use(morgan('dev'));

// Log knex SQL queries to STDOUT as well
app.use(knexLogger(knex));

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/styles', sass({
  src: __dirname + '/styles',
  dest: __dirname + '/public/styles',
  debug: true,
  outputStyle: 'expanded'
}));
app.use(express.static('public'));


// Mount all resource routes
app.use('/api/users', usersRoutes(knex));
app.use('/resources', resourcesRoutes(knex));

//Home page
app.get('/', (req, res) => {

  res.redirect('/resources');
});

// New resource
app.get('/resources/new', (req, res) => {
  // TODO mark it as **Like** for the given user

  res.render('new');
});

// Save new resource to database along with like and tags
app.post('/resources', (req, res) => {
  console.log(req.body);
  const {title, url, description, tag} = req.body;
  // create a new row in resource table
  knex("resources")
    .insert({ url: url, title: title, description: description }).returning('id')
    .then(function (resource_id) {
      // create a new row in tag table
      knex('tags')
        .insert({ tag_name: tag, resource_id: parseInt(resource_id) })
        .catch((error) => {
          console.error(error);
        });
    })
    .catch((error) => {
      console.error(error)
    });
    // TODO create a new row in like table
  res.redirect('/');
});


app.listen(PORT, () => {
  console.log('Example app listening on port ' + PORT);
});
