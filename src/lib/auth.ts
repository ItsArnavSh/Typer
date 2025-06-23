
import { auth, db } from './firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GithubAuthProvider,
  GoogleAuthProvider,
  updateProfile
} from 'firebase/auth';
import {
  collection, doc, getDoc, getDocs, setDoc, query, where, updateDoc, increment
} from 'firebase/firestore';

const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();

export async function isUsernameTaken(username: string): Promise<boolean> {
  const q = query(collection(db, "users"), where("username", "==", username));
  const snap = await getDocs(q);
  return !snap.empty;
}

export async function registerUser(email: string, password: string, name: string, username: string) {
  if (await isUsernameTaken(username)) throw new Error("Username already taken.");

  const cred = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(cred.user, { displayName: username });

  const data = {
    uid: cred.user.uid,
    email,
    name,
    username,
    score: 0,
    attempts: 0,
    provider: "password"
  };
  console.log('UID:', auth.currentUser?.uid); // MUST be non-null
  await setDoc(doc(db, "users", cred.user.uid), data);
  return data;
}

export async function loginUser(email: string, password: string) {
  const cred = await signInWithEmailAndPassword(auth, email, password);
  const snap = await getDoc(doc(db, "users", cred.user.uid));
  if (!snap.exists()) throw new Error("User record missing in DB.");
  return snap.data();
}

export async function loginWithProvider(provider: "google" | "github") {
  const p = provider === "google" ? googleProvider : githubProvider;
  const result = await signInWithPopup(auth, p);
  const user = result.user;

  const userDoc = doc(db, "users", user.uid);
  const exists = (await getDoc(userDoc)).exists();

  if (!exists) {
    // Ask for username later
    throw new Error("new_oauth_user");
  }

  return (await getDoc(userDoc)).data();
}

// After OAuth login (first time), use this to complete profile
export async function saveOAuthUser(uid: string, email: string, name: string, username: string, provider: string) {
  if (await isUsernameTaken(username)) throw new Error("Username already taken.");

  const data = {
    uid,
    email,
    name,
    username,
    score: 0,
    attempts: 0,
    provider
  };

  await setDoc(doc(db, "users", uid), data);
  return data;
}

// Score + attempt update
export async function incrementScore(uid: string) {
  await updateDoc(doc(db, "users", uid), {
    score: increment(1),
    attempts: increment(1)
  });
}
