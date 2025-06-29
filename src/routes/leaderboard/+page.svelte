<script lang="ts">
	import { onMount } from 'svelte';
	import { auth, db } from '$lib/firebase';
	import { collection, getDocs, orderBy, query, limit } from 'firebase/firestore';

	interface LeaderboardUser {
		id: string;
		username: string;
		score: number; // WPM
		attempts: number;
		rank: number;
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
					rank: rank
				};

				allUsers.push(userData);

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

<div class="terminal min-h-screen bg-black text-left font-mono text-green-400">
	<div class="mx-auto max-w-6xl">
		<!-- Terminal Header with Back Button -->
		<div class="terminal-text mb-6">
			<div class="prompt mb-2">
				<span class="text-green-400">user@typingchallenge:~$</span>
				<a href="/" class="ml-2 text-green-400 underline hover:text-lime-400">cd ../game</a>
			</div>
			<div class="prompt mb-4">
				<span class="text-green-400">user@typingchallenge:~$</span>
				<span class="ml-2">cat leaderboard.txt</span>
				{#if showCursor}<span class="cursor">|</span>{/if}
			</div>
		</div>

		{#if loading}
			<div class="terminal-text">
				<div class="response">
					<span>Loading leaderboard data...</span>
					{#if showCursor}<span class="cursor">|</span>{/if}
				</div>
			</div>
		{:else if error}
			<div class="terminal-text">
				<div class="error mb-4">
					<span>ERROR: {error}</span>
				</div>
				<div class="prompt">
					<span class="text-green-400">user@typingchallenge:~$</span>
					<button
						class="ml-2 text-green-400 underline hover:text-lime-400"
						on:click={fetchLeaderboard}
					>
						retry
					</button>
				</div>
			</div>
		{:else}
			<!-- Terminal Output -->
			<div class=" terminal-text text-center">
				<div class="response mb-6">
					<div class="mb-2">===============================================</div>
					<div class="mb-2">🏆 TYPING LEADERBOARD 🏆</div>
					<div class="mb-4">===============================================</div>

					<!-- Header -->
					<div class=" text-lime-400">
						<span class="inline-block w-16">RANK</span>
						<span class="inline-block w-64">USERNAME</span>
						<span class="inline-block w-32">WPM</span>
						<span class="inline-block w-32">ATTEMPTS</span>
					</div>

					<!-- Leaderboard Entries -->
					{#each leaderboardData as user, index}
						<div class="mb-1 rounded px-2 py-1 hover:bg-gray-900">
							<!-- Rank with special styling for top 3 -->
							{#if user.rank === 1}
								<span class="inline-block w-16 text-yellow-400">🥇</span>
							{:else if user.rank === 2}
								<span class="inline-block w-16 text-gray-300">🥈</span>
							{:else if user.rank === 3}
								<span class="inline-block w-16 text-orange-400">🥉</span>
							{:else}
								<span class="inline-block w-16">#{user.rank}</span>
							{/if}

							<!-- Username -->
							<span class="inline-block w-64 truncate text-green-300">
								{user.username}
							</span>

							<!-- WPM -->
							<span class="inline-block w-32 font-bold text-white">
								{user.score}
							</span>

							<!-- Attempts -->
							<span class="inline-block w-32 text-gray-400">
								{user.attempts}
							</span>
						</div>
					{/each}

					<div class="mt-4 mb-4">-----------------------------------------------</div>
				</div>

				<!-- Current User Rank -->
				{#if currentUserRank}
					<div class="response mb-4">
						<div class="mb-2 text-lime-400">YOUR CURRENT RANKING:</div>
						{#if currentUserRank.rank <= 10}
							<div class="text-green-300">
								🎉 Congratulations! You're in the TOP 10 at rank #{currentUserRank.rank}!
							</div>
						{:else}
							<div class="rounded border border-green-400 bg-gray-900 p-3">
								<span class="inline-block w-8 text-yellow-400">#{currentUserRank.rank}</span>
								<span class="inline-block w-32 truncate font-bold text-yellow-400">
									{currentUserRank.username} (YOU)
								</span>
								<span class="inline-block w-16 font-bold text-white">
									{currentUserRank.score}
								</span>
								<span class="inline-block w-16 text-gray-400">
									{currentUserRank.attempts}
								</span>
							</div>
						{/if}
					</div>
				{/if}

				<!-- Commands -->
				<div class="prompt mb-2">
					<span class="text-green-400">user@typingchallenge:~$</span>
					<button
						class="ml-2 text-green-400 underline hover:text-lime-400"
						on:click={fetchLeaderboard}
					>
						refresh
					</button>
				</div>

				<div class="prompt mb-2">
					<span class="text-green-400">user@typingchallenge:~$</span>
					<a href="/" class="ml-2 text-green-400 underline hover:text-lime-400">cd ../game</a>
				</div>

				<div class="prompt">
					<span class="text-green-400">user@typingchallenge:~$</span>
					<span class="ml-2">_</span>
					{#if showCursor}<span class="cursor">|</span>{/if}
				</div>
			</div>
		{/if}
	</div>
</div>

<style>
	.cursor {
		animation: blink 1s infinite;
	}

	@keyframes blink {
		0%,
		50% {
			opacity: 1;
		}
		51%,
		100% {
			opacity: 0;
		}
	}

	/* Ensure proper monospace alignment */
	.terminal-text {
		white-space: pre-wrap;
		word-break: break-all;
	}
</style>
