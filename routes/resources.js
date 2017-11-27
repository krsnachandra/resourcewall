"use strict";

const express = require('express');
const router = express.Router();

module.exports = (knex) => {

  router.get("/", (req, res) => {
    if (!req.session.user_id) {
      res.redirect('/users');
    }
    knex('resources')
    .join('likes', 'likes.resource_id', 'resources.id')
    .where('likes.user_id', req.session.user_id)
    .then((resources) => {
      return Promise.all([
        resources,
        knex('tags')
          .where('resource_id', 'in', resources.map(r => r.resource_id))
      ]);
    }).then(([resources, tags]) => {
      resources.forEach(resource => {
        resource.tags = tags.filter(tag => {
         return tag.resource_id === resource.resource_id;
        })
      })
      res.render('index', { resources })
    })
  });

  //Searching for a resource
router.get('/search', (req, res) => {
  knex('tags').join('resources', 'resources.id', 'tags.resource_id')
    .where('tag_name', req.body)
    .then((resources) => {
      return Promise.all([
        resources,
        knex('tags')
          .where('resource_id', 'in', resources.map(r => r.resource_id))
      ]);
    }).then(([resources, tags]) => {
      resources.forEach(resource => {
        resource.tags = tags.filter(tag => {
         return tag.resource_id === resource.resource_id;
        })
      })
      res.render('search', { resources })
    })
//   knex('tags')
//   .where('tag_name', 'app')
//   .then((tags)=> {
//     return Promise.all([
//       tags,
//       knex('resources')
//       .where('id', tags.resource_id)
//     ]).then(([tags, resources]) => {
//       resources.forEach(resource => {
//         resource.tags = tags.filter(tag =>{
//           return tag.resource_id === resource.resource_id;
//         })
//       })
//       res.render('search', { tags, resources });
//     })

//   })
//   .catch((error) => {
//     console.error(error)
//   });
});


  // New resource
  router.get('/new', (req, res) => {
    if (!req.session.user_id) {
      res.redirect('/users');
    }
    res.render('new');
  });

  // Save new resource to database along with like and tags
  router.post('/', (req, res) => {
    // console.log(req.body);
    const { title, url, description, tag } = req.body;
    // create a new row in resource table
    knex("resources")
      .insert({ url, title, description }).returning('id')
      .then((resource_id) => {
        // create a new row in tags table and one in the likes table
        return Promise.all([
          knex('tags').insert({ tag_name: tag, resource_id: parseInt(resource_id) }),
          knex('likes').insert({ user_id: req.session.user_id, resource_id: parseInt(resource_id) }),
        ])
      })
      .catch((error) => {
        console.error(error)
      });
    res.redirect('/');
  });

  // Specific resource page
  router.get('/:id', (req, res) => {
    const resourceId = req.params.id;
    if (!req.session.user_id) {
      res.redirect('/users');
    }
    Promise.all([
      knex("resources")
        .first("*")
        .where('id', resourceId),
      knex('comments')
        .join('users', 'users.id', 'comments.user_id')
        .select('users.id', 'users.username', 'comments.comment', 'comments.resource_id')
        .where('resource_id', resourceId)
    ])
    .then(([resource, comments]) => {
        return Promise.all([
          resource,
          comments,
          knex.avg('rs').from(function() {
            this.sum('rating as rs')
            .from('ratings')
            .where('resource_id', resourceId)
            .groupBy('id')
            .as('ratings')
          }).as('ignored_alias')
        ])
      })
    .then(([resource, comments, avgRating]) => {
      return Promise.all([
        resource,
        comments,
        avgRating,
        knex('likes').select('id').where('resource_id', resourceId).andWhere('user_id', req.session.user_id)
      ])
    }).then(([resource, comments, avgRating, like]) => {
      console.log(resource);
      return Promise.all([
        resource,
        comments,
        avgRating,
        like,
        knex('tags')
          .where('resource_id', resource.id)
      ]);
    }).then(([resource, comments, avgRating, like, tags]) => {
      if (resource) {
        console.log(like);
        const avg = Number(avgRating[0].avg).toFixed(1);
        res.render('resources_id', { resource, comments, avg, like, tags });
      } else {
          res.sendStatus(404);
        }
    }).catch((error) => {
        console.error(error)
    });
  });



  // post comments
  router.post('/:id', (req, res) => {
    const resource_id = req.params.id;
    const user_id = req.session.user_id;
    const comment = req.body.comment;
    // create a new row in comments table
    knex("comments")
      .insert({ resource_id, user_id, comment })
      .then(() => {
        res.redirect(`/resources/${resource_id}`);
      });
  });

  // post ratings
  router.post('/ratings/:id', (req, res) => {
    const resource_id = req.params.id;
    const user_id = req.session.user_id;
    const rating = req.body.rate;
    // create a new row in ratings table
    knex("ratings")
      .insert({ resource_id, user_id, rating })
      .then(() => {
        res.redirect(`/resources/${resource_id}`);
      });
  });

  // post likes
  router.post('/:id/like', (req, res) => {
    const resource_id = req.params.id;
    const user_id = req.session.user_id;
    knex('likes')
      .insert({user_id, resource_id})
      .then(() => {
        res.redirect(`/resources/${resource_id}`);
      })
  });

  // delete like
  router.post('/:id/delete', (req, res) => {
    const resource_id = req.params.id;
    const user_id = req.session.user_id;
    knex('likes').where('user_id', user_id).andWhere('resource_id', resource_id).del()
    .then(() => {
      res.redirect(`/resources/${resource_id}`);
    })
  });

  return router;
}


