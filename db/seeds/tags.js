exports.seed = function(knex, Promise) {
  const tags = [
    { id: 1, tag_name: 'documentation', resource_id: 1 },
    { id: 2, tag_name: 'SQL', resource_id: 1 },
    { id: 3, tag_name: 'user-stories', resource_id: 2 },
    { id: 4, tag_name: 'app', resource_id: 3 },
    { id: 5, tag_name: 'resize', resource_id: 3 },
    { id: 6, tag_name: 'power-user', resource_id: 3 }
  ];

  return knex('tags').del()
    .then(function () {
      return knex('tags')
        .insert(tags)
        .then(() =>
          knex.raw(`ALTER SEQUENCE tags_id_seq RESTART WITH ${tags.length + 1}`)
        );
    });
};
