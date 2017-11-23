exports.up = function(knex, Promise) {
  return knex.schema.table('resources', function(table){
    table.dropForeign('user_id');
  }).then(function(){
    return knex.schema.table('resources', function(table){
      table.dropColumn('user_id');
    })
  })
};

exports.down = function(knex, Promise) {
  return  knex.schema.table('resources', function(table){
    table.integer('user_id');
  }).then(function(){
    return knex.schema.table('resources', function(table){
      table.foreign('user_id').references('users.id');
    })
  })
};
