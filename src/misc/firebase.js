import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyDlD8VffoD4Uc9Bkk2uGGCo9Bv0dQhJTBs',
  authDomain: 'chat-web-app-649dc.firebaseapp.com',
  databaseURL: 'https://chat-web-app-649dc-default-rtdb.firebaseio.com',
  projectId: 'chat-web-app-649dc',
  storageBucket: 'chat-web-app-649dc.appspot.com',
  messagingSenderId: '628635135236',
  appId: '1:628635135236:web:bd2286f653a2d860aff451',
};

const firebaseApp = firebase.initializeApp(firebaseConfig);
export const auth = firebaseApp.auth();
export const database = firebaseApp.database();
export const storage = firebaseApp.storage();
