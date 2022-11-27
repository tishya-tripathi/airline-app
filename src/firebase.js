import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
const config = {
  apiKey: "AIzaSyCTIAyqZrreIEX-TrCs5yDDkrA8C_Lu7so",
  authDomain: "tender-otp.firebaseapp.com",
  projectId: "tender-otp",
  storageBucket: "tender-otp.appspot.com",
  messagingSenderId: "61277132405",
  appId: "1:61277132405:web:24394158dd02623d6e4a3c",
};

firebase.initializeApp(config);
var auth = firebase.auth();
export {auth , firebase};
