// Show 'Enter new password' page or error on invalid token.


'use strict';


module.exports = function (N, apiPath) {
  N.validate(apiPath, {
    secret_key: { type: 'string', required: true }
  });


  // Check token and show form
  //
  N.wire.on(apiPath, async function change_show(env) {
    env.res.head.title = env.t('title');
    env.res.secret_key = env.params.secret_key;

    let token = await N.models.users.TokenResetPassword
                          .findOne({ secret_key: env.params.secret_key, session_id: env.session_id })
                          .lean(true);

    //
    // Don't delete token here, we need it for exec action
    //
    env.res.valid_token = !!token;
  });
};
