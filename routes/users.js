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
      console.log('set a cookie');
       return knex('users').select('id').where('username', username)
    }).then((rs)=>{
      req.session.user_id = rs[0].id;
    }).then(() => {
      res.redirect('/resources/new');
    }).catch((error) => {
      req.flash('error', error.message);
      res.redirect('/');
    });
  });

  // Login
  router.post("/login", (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
      req.flash('error', 'Both email and password are required to login');
      res.redirect('/');
      return;
    }
    knex('users').select(1).where('email', email).then((rows) => {
      if (!rows.length) {
        // email not in users db
        return Promise.reject({
          message: 'That email is not registered'
        });
      }
    }).then(()=>{
      return knex('users').select('*').where('email', email).then((user) => {
        if (!bcrypt.compareSync(password, user[0].password)) {
          return Promise.reject({
            message: 'Incorrect password'
          });
        } else {
          req.session.user_id = user[0].id;
          res.redirect('/resources');
        }
      })
    }).catch((error) => {
      req.flash('error', error.message);
      res.redirect('/');
    });
  });

    // Logout
  router.post("/logout", (req, res) => {
    req.session = null;
    res.redirect('/');
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
