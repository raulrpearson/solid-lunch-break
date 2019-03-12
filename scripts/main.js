// Authentication
$('#logout').hide();
const popupUri = 'popup.html';
$('#login button').click(() => solid.auth.popupLogin({ popupUri }));
solid.auth.trackSession(session => {
  const loggedIn = !!session;
  $('#login').toggle(!loggedIn);
  $('#logout').toggle(loggedIn);
  $('#user').text(session && session.webId);
  if (session) {
    $('#user').text(session.webId);
    if (!$('#profile').val()) $('#profile').val(session.webId);
  }
});
$('#logout button').click(() => solid.auth.logout());

// Data access
const FOAF = $rdf.Namespace('http://xmlns.com/foaf/0.1/');
$('#view').click(async function loadProfile() {
  // Set up a local data store and associated data fetcher
  const store = $rdf.graph();
  const fetcher = new $rdf.Fetcher(store);

  // Load the person's data into the store
  const person = $('#profile').val();
  await fetcher.load(person);

  // Display name
  const fullName = store.any($rdf.sym(person), FOAF('name'));
  $('#fullName').text(fullName && fullName.value);

  // Display friends
  const friends = store.each($rdf.sym(person), FOAF('knows'));
  friends.forEach(async friend => {
    await fetcher.load(friend);
    const fullName = store.any(friend, FOAF('name'));
    $('#friends').append(
      $('<li>').append(
        $('<a>')
          .text((fullName && fullName.value) || friend.value)
          .click(() => $('#profile').val(friend.value))
          .click(loadProfile)
      )
    );
  });
});
