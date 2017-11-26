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
      // check if username already exist
      if (rows.length) {
        return Promise.reject({
          message: 'That username is already registered'
        });
      }// else check if email already exist
    }).then(() => {
      return knex ('users').select(1).where('email', email).then((rows) => {
        if (rows.length) {
          return Promise.reject({
            message: 'Email address is already registered'
          });
        } else {
          // encrypt the password and return it
          return bcrypt.hash(password, 10);
        }
      })
    }).then((passwordDigest) => {
      return knex('users').insert({
        username,
        email,
        password: passwordDigest
      });
      // get userid from user table
    }).then(() => {
      return knex('users').select('id').where('username', username);
      // set a cookie
    }).then((rs)=>{
      req.session.user_id = rs[0].id;
      // new register go to create new resource page
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
    const user_id = Number(req.params.id);
    // if user is not log in redirect to home page
    if (req.session.user_id !== user_id) {
      res.redirect('/');
    }// else read profile
    knex('users')
      .first('*')
      .where('id', user_id)
      .then((user) => {
        res.render('profile', {user});
      }).catch((error) => {
        console.error(error)
      })
  });

  // update user profile
  router.post('/:id/profile', (req, res) => {
    const user_id = Number(req.params.id);
    const {username, email, password} = req.body;
    // if user is not log in redirect to home page
    if(req.session.user_id !== user_id) {
      res.redirect('/');
    // if user not update all three profile
    }else if(!username || !email || !password) {
      res.send('enter all three input.');
    }else {
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
