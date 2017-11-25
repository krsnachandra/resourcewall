"use strict";

const express = require('express');
const router  = express.Router();
const bcrypt = require('bcrypt');

module.exports = (knex) => {

  router.get("/", (req, res) => {
    res.render('login', { errors: req.flash('error') });
  });

// Register a new user
  router.post("/", (req, res) => {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      req.flash('error', 'Username, email, and password are all required');
      res.redirect('/');
      return;
    }
    knex('users').select(1).where('username', username).then((rows) => {
      if (rows.length) {
        // username taken
        return Promise.reject({
          message: 'That username is already registered'
        });
      }
    }).then(() => {
      return knex ('users').select(1).where('email', email).then((rows) => {
        if (rows.length) {
          // email taken
          return Promise.reject({
            message: 'Email address is already registered'
          });
        } else {
          // all good
          return bcrypt.hash(password, 10);
        }
      })
    }).then((passwordDigest) => {
      return knex('users').insert({
        username,
        email,
        password: passwordDigest
      });
    }).then(() => {
      req.session.user_id = knex('users').select('user_id').where('username', username);
    }).then(() => {
      res.redirect('/resources');
    }).catch((error) => {
      req.flash('error', error.message);
      res.redirect('/');
    });
  });

  // User profile page
  router.get('/:id/profile', (req, res) => {
    const user_id = req.params.id;
    knex('users')
      .first('*')
      .where('id', user_id)
      .catch((error) => {
        console.error(error)
      })
      .then((users) => {
        console.log(users);
        res.render('profile', {users});
      });
  });

  // update user profile
  router.post('/:id/profile', (req, res) => {
    const user_id = req.params.id;
    const {username, email, password} = req.body;
    if (!username || !email || !password){
      res.send('enter all three input.');
    } else {
      knex('users')
        .where('id', user_id)
        .update({ username, email, password })
        .catch((error) => {
          console.error(error)
        })
        .then(() => {
          res.redirect(`/users/${user_id}/profile`);
        });
    }

  });


  return router;
};
