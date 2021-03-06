// Register avatar helper, and display avatars on page load/page update
//

'use strict';

var _           = require('lodash');
var identicon   = require('nodeca.users/lib/identicon');
var avatarSizes = _.reduce('$$ JSON.stringify(N.config.users.avatars.resize) $$', function (result, val, key) {
  result[key] = val.width;
  return result;
}, {});


// Returns a list of attributes for avatar img tag.
//
// Usage:
//  - avatar_helper(user [, size_name])
//  - avatar_helper(user_id [, size_name])
//  - avatar_helper(user_id, user [, size_name])
//
function avatar_helper(user_id, user, size_name) {
  var avatar_id, src;

  if (typeof user_id !== 'string') {
    // avatar_helper(user, size_name)
    size_name = user;
    user = user_id;
    user_id = user._id;
  }

  if (typeof user !== 'object') {
    // avatar_helper(user_id, size_name)
    size_name = user;
    user = null;
  }

  if (user) {
    avatar_id = user.avatar_id;
  } else if (N && N.runtime && N.runtime.user_id === user_id) {
    avatar_id = N.runtime.user_avatar;
  }

  if (size_name && !avatarSizes[size_name]) {
    throw new Error('Invalid avatar size: ' + size_name);
  }

  if (avatar_id) {
    src = N.router.linkTo('core.gridfs', { bucket: avatar_id + (size_name ? '_' + size_name : '') });
  } else {
    src = identicon(user_id, avatarSizes[size_name ? size_name : 'orig']);
  }

  return { src };
}


// Replace placeholders (images with "_identicon" class) with avatars
//
function replace_placeholders(selector, users) {
  selector.find('._identicon').each(function (n, img) {
    var $img = $(img),
        user_id = $img.data('user-id'),
        avatar_id = $img.data('avatar-id'),
        size_name = $img.data('avatar-size');

    if (size_name && !avatarSizes.hasOwnProperty(size_name)) {
      throw new Error('invalid avatar size: ' + size_name);
    }

    // If current user is missing avatar info - try to restore
    if (user_id === N.runtime.user_id && N.runtime.user_avatar) {
      avatar_id = avatar_id || N.runtime.user_avatar;
    }

    // Avatar id is not specified, but we can retrieve it from locals
    if (users && users[user_id]) {
      avatar_id = avatar_id || users[user_id].avatar_id;
    }

    $img.removeClass('_identicon');
    if (avatar_id) {
      $img.attr('src', N.router.linkTo('core.gridfs', { bucket: avatar_id + (size_name ? '_' + size_name : '') }));
    } else {
      $img.attr('src', identicon(user_id, avatarSizes[size_name ? size_name : 'orig']));
    }
  });
}


N.wire.once('init:assets', function avatar_helper_register() {
  N.runtime.render.helpers.avatar = avatar_helper;
});


N.wire.on('navigate.done', function identicon_replace(data) {
  if (data.locals) {
    // page generated on client-side, so we have all the locals
    replace_placeholders($(document), data.locals.users);
  } else {
    // page generated on server-side with users provided through page_data
    replace_placeholders($(document), N.runtime.page_data.users);
  }
});


N.wire.on('navigate.update', function identicon_replace(data) {
  replace_placeholders(data.$, data.locals.users);
});
