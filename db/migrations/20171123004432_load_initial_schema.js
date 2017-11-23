exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('users', function(table){
      table.increments();
      table.string('username');
      table.string('email');
      table.string('password');
      table.timestamps(true, true);
    }),
    knex.schema.createTable('resources', function(table){
      table.increments();
      table.string('url');
      table.string('title');
      table.string('description');
      table.integer('user_id');
      table.timestamps(true, true);
    }),
    knex.schema.createTable('likes', function(table){
      table.increments();
      table.integer('user_id');
      table.integer('resource_id');
      table.timestamps(true, true);
    }),
    knex.schema.createTable('tags', function(table){
      table.increments();
      table.string('tag_name');
      table.integer('resource_id');
      table.timestamps(true, true);
    }),
    knex.schema.createTable('comments', function(table){
      table.increments();
      table.string('comment');
      table.integer('user_id');
      table.integer('resource_id');
      table.timestamps(true, true);
    }),
    knex.schema.createTable('ratings', function(table){
      table.increments();
      table.integer('rating');
      table.integer('user_id');
      table.integer('resource_id');
      table.timestamps(true, true);
    }),
  ]).then(function(){
    return Promise.all([
      knex.schema.table('resources', function(table){
        table.foreign('user_id').references('users.id').onDelete('CASCADE');
      }),
      knex.schema.table('likes', function(table){
        table.foreign('user_id').references('users.id').onDelete('CASCADE');
        table.foreign('resource_id').references('resources.id').onDelete('CASCADE');
      }),
      knex.schema.table('tags', function(table){
        table.foreign('resource_id').references('resources.id').onDelete('CASCADE');
      }),
      knex.schema.table('comments', function(table){
        table.foreign('user_id').references('users.id').onDelete('CASCADE');
        table.foreign('resource_id').references('resources.id').onDelete('CASCADE');
      }),
      knex.schema.table('ratings', function(table){
        table.foreign('user_id').references('users.id').onDelete('CASCADE');
        table.foreign('resource_id').references('resources.id').onDelete('CASCADE');
      }),
    ])
  })
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.table('resources', function(table){
      table.dropForeign('user_id');
    }),
    knex.schema.table('likes', function(table){
      table.dropForeign('user_id');
      table.dropForeign('resource_id');
    }),
    knex.schema.table('tags', function(table){
      table.dropForeign('resource_id');
    }),
    knex.schema.table('comments', function(table){
      table.dropForeign('user_id');
      table.dropForeign('resource_id');
    }),
    knex.schema.table('ratings', function(table){
      table.dropForeign('user_id');
      table.dropForeign('resource_id');
    }),
  ]).then(function(){
    return Promise.all([
      knex.schema.dropTable('resources'),
      knex.schema.dropTable('users'),
      knex.schema.dropTable('likes'),
      knex.schema.dropTable('tags'),
      knex.schema.dropTable('comments'),
      knex.schema.dropTable('ratings'),
    ])
  })
};
