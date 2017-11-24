exports.seed = function(knex, Promise) {
  const likes = [
    { id: 1, user_id: 1, resource_id: 1 },
    { id: 4, user_id: 1, resource_id: 2 },
    { id: 2, user_id: 2, resource_id: 2 },
    { id: 3, user_id: 3, resource_id: 3 }
  ];

  return knex('likes').del()
    .then(function () {
      return knex('likes')
        .insert(likes)
        .then(() =>
          knex.raw(`ALTER SEQUENCE likes_id_seq RESTART WITH ${likes.length + 1}`)
        );
    });
};
