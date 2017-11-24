exports.seed = function(knex, Promise) {
  const users = [
    { id: 1, username: 'Alice', email: 'alice@user.com' },
    { id: 2, username: 'Bob', email: 'bob@user.com' },
    { id: 3, username: 'Charlie', email: 'charlie@user.com' }
  ];

  return knex('users').del()
    .then(function () {
      return knex('users')
        .insert(users)
        .then(() =>
          knex.raw(`ALTER SEQUENCE users_id_seq RESTART WITH ${users.length + 1}`)
        );
    });
};
