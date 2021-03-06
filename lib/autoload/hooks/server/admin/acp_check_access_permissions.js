// Check if user has permittions to access admin control panel.
//


'use strict';


module.exports = function (N) {

  // Redirect guests to login page
  //
  N.wire.before('server:admin*', { priority: -110 }, function acp_login_redirect(env) {
    return N.wire.emit('internal:users.force_login_guest', env);
  });


  // Check permissions
  //
  N.wire.before('server:admin*', { priority: -100 }, async function acp_check_permissions(env) {
    let can_access_acp = await env.extras.settings.fetch('can_access_acp');

    // In other cases - 401 (Not authorised)
    if (!can_access_acp) throw N.io.FORBIDDEN;
  });
};
