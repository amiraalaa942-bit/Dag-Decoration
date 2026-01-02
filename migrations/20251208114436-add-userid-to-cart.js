'use strict';

// Use import.meta.url instead of __dirname for ES6
import { readFile } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

// Get __dirname equivalent in ES6
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

var dbm;
var type;
var seed;
var Promise;

/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
export function setup(options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
  Promise = options.Promise;
}

export function up(db) {
  var filePath = join(__dirname, 'sqls', '20251208114436-add-userid-to-cart-up.sql');
  return new Promise( function( resolve, reject ) {
    readFile(filePath, {encoding: 'utf-8'}, function(err,data){
      if (err) return reject(err);
      console.log('received data: ' + data);

      resolve(data);
    });
  })
  .then(function(data) {
    return db.runSql(data);
  });
}

export function down(db) {
  var filePath = join(__dirname, 'sqls', '20251208114436-add-userid-to-cart-down.sql');
  return new Promise( function( resolve, reject ) {
    readFile(filePath, {encoding: 'utf-8'}, function(err,data){
      if (err) return reject(err);
      console.log('received data: ' + data);

      resolve(data);
    });
  })
  .then(function(data) {
    return db.runSql(data);
  });
}

export const _meta = {
  "version": 1
};
