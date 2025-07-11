<script lang="ts">
	import { onMount } from 'svelte';
	import { auth, db } from '$lib/firebase';
	import { collection, getDocs, orderBy, query, limit } from 'firebase/firestore';
	import { Timestamp } from 'firebase/firestore/lite';

	interface LeaderboardUser {
		id: string;
		username: string;
		score: number; // WPM
		attempts: number;
		rank: number;
		lastUpdated: Timestamp;
	}

	let leaderboardData: LeaderboardUser[] = [];
	let currentUserRank: LeaderboardUser | null = null;
	let loading = true;
	let error = '';
	let showCursor = true;

	// Blinking cursor effect
	onMount(() => {
		const interval = setInterval(() => {
			showCursor = !showCursor;
		}, 500);

		fetchLeaderboard();

		return () => clearInterval(interval);
	});

	async function fetchLeaderboard() {
		try {
			loading = true;
			error = '';

			// Fetch all users ordered by score (WPM) in descending order
			const usersRef = collection(db, 'users');
			const q = query(usersRef, orderBy('score', 'desc'));
			const querySnapshot = await getDocs(q);

			const allUsers: LeaderboardUser[] = [];
			let currentUserData: LeaderboardUser | null = null;
			let rank = 1;

			querySnapshot.forEach((doc) => {
				const data = doc.data();
				const userData: LeaderboardUser = {
					id: doc.id,
					username: data.username || data.email || 'Anonymous',
					score: data.score || 0,
					attempts: data.attempts || 0,
					rank: rank,
					lastUpdated: data.lastUpdated || null
				};
				if (
					userData.lastUpdated &&
					Timestamp.now().seconds - userData.lastUpdated.seconds <= 3600
				) {
					allUsers.push(userData);
				}
				// Check if this is the current user
				if (auth.currentUser && doc.id === auth.currentUser.uid) {
					currentUserData = userData;
				}

				rank++;
			});

			// Take top 10 for main leaderboard display
			leaderboardData = allUsers.slice(0, 10);
			currentUserRank = currentUserData;

			loading = false;
		} catch (err) {
			console.error('Error fetching leaderboard:', err);
			error = 'Failed to load leaderboard';
			loading = false;
		}
	}
</script>

<div class="terminal relative z-10 font-mono text-green-400">
	<!-- Terminal Header with Back Button -->
	<div class="terminal-text mb-6">
		<div class="prompt mb-2">
			<span class="text-green-400">user@OSDType:~$</span>
			<a href="/" class="ml-2 text-green-400 underline transition-colors hover:text-lime-400"
				>cd ..</a
			>
		</div>
		<div class="prompt mb-4">
			<span class="text-green-400">user@OSDType:~$</span>
			<span class="ml-2">cat leaderboard.txt</span>
		</div>
	</div>

	{#if loading}
		<div class="terminal-text text-center">
			<div class="response">
				<span>Loading leaderboard data...</span>
				{#if showCursor}<span class="cursor">█</span>{/if}
			</div>
		</div>
	{:else if error}
		<div class="terminal-text text-center">
			<div class="error mb-4 text-red-400">
				<span>ERROR: {error}</span>
			</div>
			<div class="prompt">
				<span class="text-green-400">C:\GAMES\TYPING&gt;</span>
				<button
					class="ml-2 text-green-400 underline transition-colors hover:text-lime-400"
					on:click={fetchLeaderboard}
				>
					RETRY
				</button>
			</div>
		</div>
	{:else}
		<!-- Terminal Output -->
		<div class="terminal-text text-center">
			<div class="response mb-6">
				<div class="mb-2 text-lime-400">═══════════════════════════════════════════════</div>
				<div class="mb-2 text-xl font-bold text-lime-400">▓▓▓ TYPING CHAMPIONS ▓▓▓</div>
				<div class="mb-4 text-lime-400">═══════════════════════════════════════════════</div>

				<!-- Header -->
				<div class="mb-2 bg-black py-1 font-bold text-cyan-400">
					<span class="inline-block w-12">RANK</span>
					<span class="inline-block w-48">PLAYER NAME</span>
					<span class="inline-block w-24">SPEED</span>
					<span class="inline-block w-24">TRIES</span>
				</div>

				<!-- Leaderboard Entries -->
				{#each leaderboardData.slice(0, 8) as user, index}
					<div
						class="mb-1 px-2 py-1 transition-all duration-150 hover:bg-blue-900 {index % 2 === 0
							? 'bg-gray-900'
							: ''}"
					>
						{#if user.rank === 1}
							<span class="inline-block w-12 text-yellow-300">♔ 1</span>
						{:else if user.rank === 2}
							<span class="inline-block w-12 text-gray-300">♕ 2</span>
						{:else if user.rank === 3}
							<span class="inline-block w-12 text-orange-400">♖ 3</span>
						{:else}
							<span class="inline-block w-12">▓ {user.rank}</span>
						{/if}
						<span class="inline-block w-48 truncate text-green-300">{user.username}</span>
						<span class="inline-block w-24 font-bold text-white"
							>{Math.round(user.lastUpdated)} WPM</span
						>
						<span class="inline-block w-24 text-gray-400">{user.attempts}</span>
					</div>
				{/each}

				<div class="mt-4 mb-4 text-lime-400">▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓</div>
			</div>

			<div class="mt-6 text-left">
				<!-- Commands -->
				<div class="prompt mb-2">
					<span class="text-green-400">user@OSDType:~$</span>
					<button
						class="ml-2 text-green-400 underline transition-colors hover:text-lime-400"
						on:click={fetchLeaderboard}
					>
						REFRESH
					</button>
				</div>
			</div>
		</div>
	{/if}
</div>
