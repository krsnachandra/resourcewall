"use strict";

const express = require('express');
const router  = express.Router();

module.exports = (knex) => {

  router.get("/", (req, res) => {
    res.render('login')
  });

  router.post("/", (req, res) => {
    if (!req.body.username || !req.body.email || !req.body.password) {
      req.flash('error', 'Username, email, and password are all required');
      res.redirect('/');
      return;
    }
    knex('users').select(1).where('email', req.body.email).then((rows) => {
      if (rows.length) {
        // bad news, the email is already in there
        return Promise.reject({
          message: 'Email address is not unique'
        });
      } else {
        // all good
        return bcrypt.hash(req.body.password, 10);
      }
    }).then((passwordDigest) => {
      return knex('users').insert({
        email: req.body.email,
        password_digest: passwordDigest
      });
    }).then(() => {
      req.flash('info', 'User account created successfully');
      res.redirect('/');
    }).catch((error) => {
      // FIXME do not show the user internal error messages such as the ones
      // from the database
      req.flash('error', error.message);
      // FIXME in a real app some errors are expected and don't need to be logged
      // FIXME in a real app errors are typically sent to a custom logging system
      // and not just sent to the console
      console.error(error);
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
