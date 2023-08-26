  // Your web app's Firebase configuration
  var firebaseConfig = {
    apiKey: "AIzaSyDNQs1NhZlSB6aLxrRfJEPFs5or1T2d5hU",
    authDomain: "pollution-b3bdb.firebaseapp.com",
    databaseURL: "https://pollution-b3bdb.firebaseio.com",
    projectId: "pollution-b3bdb",
    storageBucket: "pollution-b3bdb.appspot.com",
    messagingSenderId: "880834566611",
    appId: "1:880834566611:web:4c201c8f03df5c18"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  // Get a reference to the database service
  var database = firebase.database();

  //writeUserData("lol")

  function writeUserData(userId, name, email, imageUrl) {
    firebase.database().ref('users/' + userId).set({
      username: name,
      email: email,
      profile_picture : imageUrl
    });
  }