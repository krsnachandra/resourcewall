"use strict";

const express = require('express');
const router = express.Router();

module.exports = (knex) => {

  router.get("/", (req, res) => {    
  knex('resources')
    // .join('likes', 'likes.resource_id', 'resources_id')
    // .where('likes.user_id', req.session.user_id)
    .then((resources) => {
      return Promise.all([
        resources,
        knex('tags')
          .where('resource_id', 'in', resources.map(r => r.id))
      ]);
    }).then(([resources, tags]) => {
      resources.forEach(resource => {
        resource.tags = tags.filter(tag => {
         return tag.resource_id === resource.id;
        })
      })
      res.render('index', { resources })
    })
  });

  // New resource
  router.get('/new', (req, res) => {
    // TODO mark it as **Like** for the given user

    res.render('new');
  });

  // Save new resource to database along with like and tags
  router.post('/', (req, res) => {
    console.log(req.body);
    const { title, url, description, tag } = req.body;
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

  // new resource page with comment
  router.get('/:id', (req, res) => {
    knex
      .select("*")
      .from("resources")
      .where('id', req.params.id)
      .then((resources) => {
        if (resources.length) {
          res.render('resources_id', { resource: resources[0] });
        } else {
          res.send(404);
        }
      });
  });

  return router;  
}
