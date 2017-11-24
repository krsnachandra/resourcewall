"use strict";

const express = require('express');
const router = express.Router();

module.exports = (knex) => {

  router.get("/", (req, res) => {    
    knex('resources').join('tags','resources.id','tags.resource_id')
    .select('resources.title', 'resources.id', 'tags.tag_name')
    //.where('resources.id','=',3)
    .then((result)=>{
      res.send(result);
    });
    res.render('index'); 
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
