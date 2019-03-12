$('#logout').hide();
const popupUri = 'popup.html';
$('#login button').click(() => solid.auth.popupLogin({ popupUri }));
solid.auth.trackSession(session => {
  const loggedIn = !!session;
  $('#login').toggle(!loggedIn);
  $('#logout').toggle(loggedIn);
  $('#user').text(session && session.webId);
});
$('#logout button').click(() => solid.auth.logout());
