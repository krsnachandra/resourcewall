exports.seed = function(knex, Promise) {
  return knex('comments').del()
    .then(function () {
      return Promise.all([
        knex('comments').insert({id: 1, comment: 'I like this site', user_id: 1, resource_id: 1}),
        knex('comments').insert({id: 2, comment: 'This is cool', user_id: 2, resource_id: 2}),
        knex('comments').insert({id: 3, comment: 'Ooh, that\'s nice', user_id: 3, resource_id: 3})
      ]);
    });
};
