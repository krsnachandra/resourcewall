exports.seed = function(knex, Promise) {
  return knex('tags').del()
    .then(function () {
      return Promise.all([
        knex('tags').insert({id: 1, tag_name: 'documentation', resource_id: 1}),
        knex('tags').insert({id: 2, tag_name: 'SQL', resource_id: 1}),
        knex('tags').insert({id: 3, tag_name: 'user-stories', resource_id: 2}),
        knex('tags').insert({id: 4, tag_name: 'app', resource_id: 3}),
        knex('tags').insert({id: 5, tag_name: 'resize', resource_id: 3}),
        knex('tags').insert({id: 6, tag_name: 'power-user', resource_id: 3}),
      ]);
    });
};
