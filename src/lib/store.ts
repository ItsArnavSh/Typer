import { doc, updateDoc, getDoc, increment, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '$lib/firebase';

/**
 * Update user's score and attempts in the existing users collection
 * Only updates if the new score is higher than the current highest score
 * @param newScore - The new score to potentially set as highest
 */
export async function updateUserScore(newScore: number): Promise<boolean> {
	try {
		const user = auth.currentUser;
		if (!user) {
			console.error('User not authenticated');
			return false;
		}

		const userRef = doc(db, 'users', user.uid);

		// Get current user data first
		const userDoc = await getDoc(userRef);
		if (!userDoc.exists()) {
			console.error('User document does not exist');
			return false;
		}

		const userData = userDoc.data();
		const currentHighScore = userData.score || 0;

		// Prepare update data - always increment attempts
		const updateData: any = {
			attempts: increment(1),
			lastUpdated: serverTimestamp()
		};

		// Only update score if new score is higher
		if (newScore > currentHighScore) {
			updateData.score = newScore;
			console.log(`New high score: ${newScore} (previous: ${currentHighScore})`);
		} else {
			console.log(`Score ${newScore} not higher than current high score: ${currentHighScore}`);
		}

		await updateDoc(userRef, updateData);

		console.log('User data updated successfully');
		return true;
	} catch (error) {
		console.error('Error updating user score:', error);
		return false;
	}
}

/**
 * Get current user's highest score
 */
export async function getUserScore(): Promise<number> {
	try {
		const user = auth.currentUser;
		if (!user) return 0;

		const userRef = doc(db, 'users', user.uid);
		const userDoc = await getDoc(userRef);

		if (userDoc.exists()) {
			return userDoc.data().score || 0;
		}

		return 0;
	} catch (error) {
		console.error('Error getting user score:', error);
		return 0;
	}
}

/**
 * Get current user's attempt count
 */
export async function getUserAttempts(): Promise<number> {
	try {
		const user = auth.currentUser;
		if (!user) return 0;

		const userRef = doc(db, 'users', user.uid);
		const userDoc = await getDoc(userRef);

		if (userDoc.exists()) {
			return userDoc.data().attempts || 0;
		}

		return 0;
	} catch (error) {
		console.error('Error getting user attempts:', error);
		return 0;
	}
}
