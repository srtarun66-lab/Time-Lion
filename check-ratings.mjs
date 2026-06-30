import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import * as dotenv from 'dotenv';
dotenv.config({ path: './frontend-next/.env.local' });

const app = initializeApp({
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
});
const db = getFirestore(app);

const snap = await getDocs(collection(db, 'products'));
let totalRating = 0, ratedCount = 0, totalReviews = 0;
snap.forEach(doc => {
  const d = doc.data();
  const reviews = d.reviews || [];
  const rating = d.rating;
  totalReviews += reviews.length;
  if (typeof rating === 'number' && rating > 0) { totalRating += rating; ratedCount++; }
  console.log(`[${doc.id.slice(0,8)}] name=${d.name?.slice(0,20)} | rating=${rating} | reviews=${reviews.length}`);
});
console.log(`\nSummary: ${snap.size} products | ${ratedCount} with rating field | ${totalReviews} total reviews`);
if (ratedCount > 0) console.log(`Avg p.rating = ${(totalRating/ratedCount).toFixed(2)}`);
