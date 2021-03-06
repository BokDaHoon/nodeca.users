'use strict';


N.wire.once('navigate.done:' + module.apiPath, function page_once() {

  // Enable "OK" button if checkbox checked
  //
  N.wire.on(module.apiPath + ':change', function checkbox_state_change(data) {
    $('#dialogs-unsubscribe').prop('disabled', !data.$this.prop('checked'));
  });


  // Disable dialog notifications
  //
  N.wire.on(module.apiPath + ':confirm', function disable_notifications() {
    return Promise.resolve()
      .then(() => N.io.rpc('users.dialogs_root.unsubscribe.exec'))
      .then(() => N.wire.emit('navigate.to', { apiPath: 'users.dialogs_root.unsubscribe.done' }));
  });
});
