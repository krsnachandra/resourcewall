"use strict";

const express = require('express');
const router = express.Router();

module.exports = (knex) => {

  router.get("/", (req, res) => {
    // knex
    //   .select('*').from('resources')
    //   // .then(() => {
    //   //   knex.select('tag_name').from('tags')
    //   //       .join()
    //   //     .where('resource_id', )
    //   // })
      
    //   .then((results) => {
    //     res.json(results);
    //   });
    
    knex('resources').join('tags','resources.id','tags.resource_id')
    .select('resources.title', 'resources.id', 'tags.tag_name')
    //.where('resources.id','=',3)
    .then((result)=>{
      res.send(result);
    });
  });

  // new resource page with comment
  router.get('/:id', (req, res) => {
    console.log('i am here.');
    const resource_id = req.params.id;
    console.log(resource_id);
    knex
      .select("*")
      .from("resources")
      .where('id', resource_id)
      .then((results) => {
        res.send(results);
      });
  });

  return router;  
}
