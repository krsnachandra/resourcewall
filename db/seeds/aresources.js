exports.seed = function(knex, Promise) {
  return knex('resources').del()
    .then(function () {
      return Promise.all([
        knex('resources').insert({id: 1, url: 'http://knexjs.org/' , title: 'Knex Documentation', description: 'Helps us to use Knex for database query building', user_id: 1}),
        knex('resources').insert({id: 2, url: 'https://medium.com/@jonatisokon/a-framework-for-user-stories-bc3dc323eca9', title: 'User Stories', description: 'A framework for modern User Stories', user_id: 2}),
        knex('resources').insert({id: 3, url: 'https://www.spectacleapp.com/', title: 'Spectacle App', description: 'Window control with simple and customizable keyboard shortcuts', user_id: 3})
      ]);
    });
};
