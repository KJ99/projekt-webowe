import { initializeApp } from 'firebase/app';
import * as FirebaseAuth from 'firebase/auth';
import config from '../firebase.config.json';
import * as FirebaseDb from 'firebase/database';

export const getApp = () => {
  return initializeApp(config);
};

export const getDatabase = () => {
  return FirebaseDb.getDatabase(getApp());
};

export const getAuth = () => {
  return FirebaseAuth.getAuth(getApp());
};
