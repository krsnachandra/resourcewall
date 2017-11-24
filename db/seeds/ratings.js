exports.seed = function(knex, Promise) {
  const ratings = [
    { id: 1, rating: 5, user_id: 1, resource_id: 1 },
    { id: 4, rating: 3, user_id: 1, resource_id: 2 },
    { id: 2, rating: 5, user_id: 2, resource_id: 2 },
    { id: 3, rating: 5, user_id: 3, resource_id: 3 }
  ];

  return knex('ratings').del()
    .then(function () {
      return knex('ratings')
        .insert(ratings)
        .then(() =>
          knex.raw(`ALTER SEQUENCE ratings_id_seq RESTART WITH ${ratings.length + 1}`)
        );
    });
};
