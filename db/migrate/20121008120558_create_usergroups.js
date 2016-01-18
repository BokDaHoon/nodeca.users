'use strict';


const co = require('co');


exports.up = co.wrap(function* (N) {
  let names = [ 'administrators', 'guests', 'members' ];

  for (let i = 0; i < names.length; i++) {
    let name = names[i];
    let usergroup = new N.models.users.UserGroup({
      short_name:   name,
      is_protected: true
    });

    yield usergroup.save();
  }
});
