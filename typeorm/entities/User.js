var EntitySchema = require("typeorm").EntitySchema;

module.exports = new EntitySchema({
    name: "typeormUser",
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: true
        },
        firstName: {
            type: "varchar"
        },
        lastName: {
            type: "varchar"
        },
        email: {
            type: "varchar"
        },
        username: {
            type: "varchar"
        },
        password: {
            type: "varchar"
        }
    }
});