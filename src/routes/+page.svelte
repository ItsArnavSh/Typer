<script lang="ts">
	import { updateUserScore } from '$lib/store';
	import Header from '../components/Header.svelte';
	import Timer from '../components/Timer.svelte';
	import Typer from '../components/Typer.svelte';
	import Wpm from '../components/WPM.svelte';
	import { getGithubFileContent } from '../utils/getGitCode';
	import { auth } from '../lib/firebase';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { onAuthStateChanged } from 'firebase/auth';
	onMount(() => {
		const unsubscribe = onAuthStateChanged(auth, (user) => {
			if (!user) {
				goto('/signin');
			}
			// else: user is authenticated, do nothing
		});

		return unsubscribe; // cleanup on component destroy
});
	let start = false;
	let times = false;
	let loaded = false;
	let wpmData = { wpm: 0, raw_wpm: 0, total: 0, correctCount: 0, wrongCount: 0 };

	let competitionTime: number = 5;
	let selectedLanguage = '';
	let targetText = '';
	let formSubmitted = false;

	function timerr() {
		start = true;
	}

	async function timesUp(event) {
		wpmData.wpm = event.detail.wpm;
		wpmData.raw_wpm = event.detail.rawWPM;
		wpmData.total = event.detail.total;
		wpmData.correctCount = event.detail.correctCount;
		wpmData.wrongCount = event.detail.wrongCount;

		times = true;

		await updateUserScore(wpmData.wpm, {
			wpm: wpmData.wpm,
			accuracy: (wpmData.correctCount * 100) / wpmData.wrongCount,
			duration: competitionTime,
			gameMode: selectedLanguage
		});
	}

	function resetGame() {
		start = false;
		times = false;
		wpmData = { wpm: 0, raw_wpm: 0, total: 0, correctCount: 0, wrongCount: 0 };
		formSubmitted = false;
	}
	async function handleSubmit() {
		if (selectedLanguage) {
			targetText = await getGithubFileContent(selectedLanguage);
			loaded = true;
			formSubmitted = true;
		}
	}
</script>

<div
	class="main flex h-full w-full flex-col items-center justify-center bg-black font-mono text-white"
>
	<div class="relative flex w-full items-center justify-center">
		<Header />
		<div class="absolute right-0">
			{#if start}
				<Timer seconds={competitionTime} />
			{:else if formSubmitted}
				<p class="terminal-text prompt mr-5 p-4 font-mono">Start Typing For Timer</p>
			{/if}
		</div>
	</div>

	{#if !formSubmitted}
		<div class="mt-10 flex w-[60%] flex-col space-y-6">
			<!-- Language Selector Only -->
			<div class="terminal-text prompt flex flex-col space-y-2">
				<label for="language" class="text-green-400">> Choose a language to begin:</label>
				<select
					id="language"
					bind:value={selectedLanguage}
					class="terminal-text response w-full rounded-md border border-green-400 bg-black px-3 py-2 text-green-400 shadow-sm placeholder:text-gray-500 focus:border-lime-400 focus:ring-2 focus:ring-green-500 focus:outline-none"
				>
					<option value="" disabled selected class="bg-black text-white"
						>-- Select Language --</option
					>
					<option value="python" class="bg-black text-green-400">Python</option>
					<option value="javascript" class="bg-black text-green-400">JavaScript</option>
					<option value="typescript" class="bg-black text-green-400">TypeScript</option>
					<option value="go" class="bg-black text-green-400">Go</option>
					<option value="rust" class="bg-black text-green-400">Rust</option>
					<option value="c" class="bg-black text-green-400">C</option>
					<option value="cpp" class="bg-black text-green-400">C++</option>
					<option value="java" class="bg-black text-green-400">Java</option>
				</select>
			</div>

			<!-- Start Button -->
			<button
				class="terminal-text rounded border border-green-400 bg-black px-6 py-2 text-green-400 transition duration-200 hover:bg-green-600 hover:text-black"
				onclick={handleSubmit}
			>
				Start Challenge
			</button>
		</div>
	{:else}
		<!-- Typing Area -->
		<div class="m-auto h-[1000px] w-[50%]">
			{#if loaded}
				{#if times}
					<Wpm {wpmData} />
					<button
						onclick={resetGame}
						class="terminal-text border border-green-400 bg-green-400 p-4 text-white">RESET</button
					>
				{:else}
					<Typer {targetText} {competitionTime} on:timesUp={timesUp} on:activateTimer={timerr} />
				{/if}
			{:else}
				<p class="text-white">Loading file...</p>
			{/if}
		</div>
	{/if}
</div>
