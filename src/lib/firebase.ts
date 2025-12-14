import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, onAuthStateChanged, User } from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  addDoc, 
  query, 
  orderBy, 
  onSnapshot,
  serverTimestamp,
  Timestamp,
  limit
} from 'firebase/firestore';

// ⚠️ REPLACE THESE WITH YOUR FIREBASE CONFIG FROM FIREBASE CONSOLE
// Go to: Firebase Console → Project Settings → Your apps → Web app → Config
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Auth helper
export const signInAnon = async (): Promise<User> => {
  const result = await signInAnonymously(auth);
  return result.user;
};

export const onAuthChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

// Chat helpers
export interface FirebaseMessage {
  id: string;
  text: string;
  senderName: string;
  senderType: string;
  createdAt: Date;
  uid: string;
}

export const sendMessage = async (
  roomId: string,
  text: string,
  senderName: string,
  senderType: string,
  uid: string
) => {
  const messagesRef = collection(db, 'rooms', roomId, 'messages');
  await addDoc(messagesRef, {
    text,
    senderName,
    senderType,
    uid,
    createdAt: serverTimestamp()
  });
};

export const subscribeToMessages = (
  roomId: string,
  callback: (messages: FirebaseMessage[]) => void
) => {
  const messagesRef = collection(db, 'rooms', roomId, 'messages');
  const q = query(messagesRef, orderBy('createdAt', 'asc'), limit(100));
  
  return onSnapshot(q, (snapshot) => {
    const messages: FirebaseMessage[] = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        text: data.text,
        senderName: data.senderName,
        senderType: data.senderType,
        uid: data.uid,
        createdAt: data.createdAt instanceof Timestamp 
          ? data.createdAt.toDate() 
          : new Date()
      };
    });
    callback(messages);
  });
};

export default app;
