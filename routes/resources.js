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
