exports.seed = function(knex, Promise) {
  const comments = [
    { id: 1, comment: 'I like this site', user_id: 1, resource_id: 1 },
    { id: 2, comment: 'This is cool', user_id: 2, resource_id: 2 },
    { id: 3, comment: 'Ooh, that\'s nice', user_id: 3, resource_id: 3 }
  ];

  return knex('comments').del()
    .then(function () {
      return knex('comments')
        .insert(comments)
        .then(() =>
          knex.raw(`ALTER SEQUENCE comments_id_seq RESTART WITH ${comments.length + 1}`)
        );
    });
};
