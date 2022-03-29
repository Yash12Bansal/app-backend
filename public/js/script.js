function onSignIn(googleUser) {
    var id_token = googleUser.getAuthResponse().id_token;
    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/login');
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onload = function() {
      console.log('Signed in as: ' + xhr.responseText);
      if(xhr.responseText=='success'){
          onSignOut();
          location.assign('/dashboard');
      }
    };
    xhr.send(JSON.stringify({token:id_token}));
    }

function onSignOut(){
gapi.auth2.getAuthInstance().signOut().then(function(){
    console.log("signed out")
})
}