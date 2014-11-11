// Member page
//

'use strict';

var _ = require('lodash');


// Store/restore blocks collapse state
//
N.wire.on('navigate.done:' + module.apiPath, function store_blocks_state() {
  var key = 'member_blocks_collapsed';
  var collapsedBlocks;
  var bag = new window.Bag();

  // Handle show/hide events
  $('.member-block__inner')
    .on('shown.bs.collapse', function (event) {
      collapsedBlocks = _.without(collapsedBlocks, $(event.target).attr('id'));

      bag.set(key, collapsedBlocks);
    })
    .on('hidden.bs.collapse', function (event) {
      collapsedBlocks.push($(event.target).attr('id'));

      bag.set(key, collapsedBlocks);
    });

  // Restore previous state
  bag.get(key, function (__, data) {
    collapsedBlocks = data || [];

    collapsedBlocks.forEach(function (blockID) {
      $('#' + blockID).removeClass('in');
    });
  });
});


N.wire.once('navigate.done:' + module.apiPath, function page_once() {

  // Click to avatar
  //
  N.wire.on('users.member:change_avatar', function change_avatar() {
    var data = {};

    N.wire.emit('users.avatar.change', data, function () {

      $('.member-avatar__image').attr('src', N.router.linkTo('core.gridfs', { bucket: data.avatar_id }));
      $('.member-layout').addClass('member-layout__m-avatar-exists');
    });
  });


  // Click to delete avatar button
  //
  N.wire.on('users.member:detete_avatar', function change_avatar() {
    N.io.rpc('users.avatar.delete').done(function (result) {

      $('.member-avatar__image').attr('src', N.router.linkTo('core.gridfs', { bucket: result.avatar_id }));
      $('.member-layout').removeClass('member-layout__m-avatar-exists');
    });
  });


  // Page exit
  //
  N.wire.on('navigate.exit:' + module.apiPath, function page_exit() {
    $('.member-block__inner')
      .off('shown.bs.collapse')
      .off('hidden.bs.collapse');
  });
});
