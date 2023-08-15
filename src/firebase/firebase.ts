import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const config = {
  apiKey: 'AIzaSyCFgMnkHDba0iGi2nEW-5ISgI-oBfCH5Fw',
  authDomain: 'chat-app-70161.firebaseapp.com',
  projectId: 'chat-app-70161',
  storageBucket: 'chat-app-70161.appspot.com',
  messagingSenderId: '152826050962',
  appId: '1:152826050962:web:ee0c2cc23d8d15d542694b'
}

const app = initializeApp(config)
export const auth = getAuth(app)
export const googleProvider = new GoogleAuthProvider()
export const db = getFirestore(app)
