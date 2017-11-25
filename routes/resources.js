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
    // console.log(req.body);
    const { title, url, description, tag } = req.body;
    // create a new row in resource table
    knex("resources")
      .insert({ url: url, title: title, description: description }).returning('id')
      .then((resource_id) => {
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

  // new resource page with comments
  router.get('/:id', (req, res) => {
    const resourceId = req.params.id;
    Promise.all([
      knex("resources")
        .select("*")
        .where('id', resourceId),
      knex('comments')
        .select('comment')
        .where('resource_id', resourceId)
    ])
    .then(([resources, comments]) => {
        return Promise.all([
          resources,
          comments,
          // console.log('resources: ' + resources[0].id)
          knex.avg('rs').from(function() {
            this.sum('rating as rs')
            .from('ratings')
            .where('resource_id', resources[0].id)
            .groupBy('rating')
            .as('alias')
          }).as('avgRating')
        ])
      })
    .then(([resources, comments, avgRating]) => {
      if (resources.length) {
        res.render('resources_id', { resource: resources[0], comments: comments, avg: avgRating[0].avg });
      } else {
          res.send(404);
        }
    }).catch((error) => {
        console.error(error)
    });
  });


  // post comments
  router.post('/:id', (req, res) => {
    const resourceId = req.params.id;
    const userId = 1;
    const comment = req.body.comment;

    console.log(req.params.id);
    // create a new row in comments table
    knex("comments")
      .insert({ resource_id: resourceId, user_id: userId, comment: comment })
      .then(() => {
        res.redirect(`/resources/${resourceId}`);
      });
  });

  return router;
}


