"use strict";


/**
 *  class models.users.UserGroup
 *
 *  Store usergroup settings
 **/


var Mongoose = require('mongoose');
var Schema = Mongoose.Schema;

////////////////////////////////////////////////////////////////////////////////

module.exports = function (N, collectionName) {

  /**
   *  new models.users.UserGroup()
   *
   *  Create new odm object
   **/
  var UserGroup = module.exports.UserGroup = new Schema({
      // user group name used in ACP and migrations
      short_name        : String

      // parent group, all none overriden settings
      //will be inherited from parent
    , parent            : Schema.Types.ObjectId

      // can by deleted?
    , is_protected      : { type: Boolean, default: false }

      // restrictive groups makes "forced" settings.
      // mostly used to "remove" some rights of  group (e.g. restrict posting)
    , is_forced         : { type: Boolean, default: false }

      // belong to only this group settings (overriden)
    , raw_settings      : { type: Schema.Types.Mixed, default: {}}

      // result setting(considering inherited and defaults)
      // Note: only store can write to this property
    , settings          : { type: Schema.Types.Mixed, default: {}}
  });

  N.wire.on("init:models", function emit_init_UserGroup(__, callback) {
    N.wire.emit("init:models." + collectionName, UserGroup, callback);
  });

  N.wire.on("init:models." + collectionName, function init_model_UserGroup(schema, callback) {
    N.models[collectionName] = Mongoose.model(collectionName, schema);
    callback();
  });
};
