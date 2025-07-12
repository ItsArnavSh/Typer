import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from './firebase'; // Adjust the import path as needed

export async function resetAllScores(): Promise<void> {
	try {
		const usersSnapshot = await getDocs(collection(db, 'users'));

		const resetPromises = usersSnapshot.docs.map((userDoc) => {
			const userRef = doc(db, 'users', userDoc.id);
			return updateDoc(userRef, {
				score: 0,
				attempts: 0
			});
		});

		await Promise.all(resetPromises);
		console.log('✅ All user scores and attempts reset to 0.');
	} catch (error) {
		console.error('❌ Error resetting user scores and attempts:', error);
	}
}
