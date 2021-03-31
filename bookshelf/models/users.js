module.exports = function(table) {
    table.increments('id').primary();
    table.string('firstName');
    table.string('lastName');
    table.string('email');
    table.string('username');
    table.string('password');
  }