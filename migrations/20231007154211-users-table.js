'use strict';

var dbm;
var type;
var seed;

/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
exports.setup = function(options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = async function(db) {
  await db.createTable('users', {
    id: {
      type: 'string',
      length: 36, // Adjust the length as needed
      primaryKey: true
    },
    name: {
      type: 'string',
      length: 255
    },
    email: {
      type: 'string',
      length: 255
    },
    password: {
      type: 'string',
      length: 255
    },
    created_at: {
      type: 'timestamp',
      defaultValue: 'CURRENT_TIMESTAMP'
    },
    updated_at: {
      type: 'timestamp',
      defaultValue: 'CURRENT_TIMESTAMP',
      notNull: true
    }
  });
};

exports.down = async function(db) {
  await db.dropTable('users');
};

exports._meta = {
  "version": 1
};
