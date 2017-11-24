exports.seed = function(knex, Promise) {
  const resources = [
    { id: 1, url: 'http://knexjs.org/', title: 'Knex Documentation', description: 'Helps us to use Knex for database query building' },
    { id: 2, url: 'https://medium.com/@jonatisokon/a-framework-for-user-stories-bc3dc323eca9', title: 'User Stories', description: 'A framework for modern User Stories' },
    { id: 3, url: 'https://www.spectacleapp.com/', title: 'Spectacle App', description: 'Window control with simple and customizable keyboard shortcuts' }
  ];

  return knex('resources').del()
    .then(function () {
      return knex('resources')
        .insert(resources)
        .then(() => 
          knex.raw(`ALTER SEQUENCE resources_id_seq RESTART WITH ${resources.length + 1}`)
        );
    });
};
