import firebase from 'firebase/app';
import "firebase/storage";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBolgCuDcrMDV6_y3yo7rep8YlUEQbUrYk",
  authDomain: "cocktails-7ada5.firebaseapp.com",
  projectId: "cocktails-7ada5",
  storageBucket: "cocktails-7ada5.appspot.com",
  messagingSenderId: "500946577993",
  appId: "1:500946577993:web:91107f07dbfc70e1036d98"
};

firebase.initializeApp(firebaseConfig);

const storage = firebase.storage();

export {storage, firebase as default};