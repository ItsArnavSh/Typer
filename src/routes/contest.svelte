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

	let competitionTime: number = 15;
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

		await updateUserScore(wpmData.wpm);
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
				<label class="text-green-400">> Choose a language to begin:</label>
				<div class="flex flex-col space-y-1 pl-4">
					<label
						class="flex cursor-pointer items-center space-x-2 transition-colors hover:text-lime-400"
					>
						<input
							type="radio"
							name="language"
							value="python"
							bind:group={selectedLanguage}
							class="sr-only"
						/>
						<span class="text-green-400">{selectedLanguage === 'python' ? '[X]' : '[ ]'}</span>
						<span class="text-green-400">Python</span>
					</label>
					<label
						class="flex cursor-pointer items-center space-x-2 transition-colors hover:text-lime-400"
					>
						<input
							type="radio"
							name="language"
							value="javascript"
							bind:group={selectedLanguage}
							class="sr-only"
						/>
						<span class="text-green-400">{selectedLanguage === 'javascript' ? '[X]' : '[ ]'}</span>
						<span class="text-green-400">JavaScript</span>
					</label>
					<label
						class="flex cursor-pointer items-center space-x-2 transition-colors hover:text-lime-400"
					>
						<input
							type="radio"
							name="language"
							value="typescript"
							bind:group={selectedLanguage}
							class="sr-only"
						/>
						<span class="text-green-400">{selectedLanguage === 'typescript' ? '[X]' : '[ ]'}</span>
						<span class="text-green-400">TypeScript</span>
					</label>
					<label
						class="flex cursor-pointer items-center space-x-2 transition-colors hover:text-lime-400"
					>
						<input
							type="radio"
							name="language"
							value="go"
							bind:group={selectedLanguage}
							class="sr-only"
						/>
						<span class="text-green-400">{selectedLanguage === 'go' ? '[X]' : '[ ]'}</span>
						<span class="text-green-400">Go</span>
					</label>
					<label
						class="flex cursor-pointer items-center space-x-2 transition-colors hover:text-lime-400"
					>
						<input
							type="radio"
							name="language"
							value="rust"
							bind:group={selectedLanguage}
							class="sr-only"
						/>
						<span class="text-green-400">{selectedLanguage === 'rust' ? '[X]' : '[ ]'}</span>
						<span class="text-green-400">Rust</span>
					</label>
					<label
						class="flex cursor-pointer items-center space-x-2 transition-colors hover:text-lime-400"
					>
						<input
							type="radio"
							name="language"
							value="c"
							bind:group={selectedLanguage}
							class="sr-only"
						/>
						<span class="text-green-400">{selectedLanguage === 'c' ? '[X]' : '[ ]'}</span>
						<span class="text-green-400">C</span>
					</label>
					<label
						class="flex cursor-pointer items-center space-x-2 transition-colors hover:text-lime-400"
					>
						<input
							type="radio"
							name="language"
							value="cpp"
							bind:group={selectedLanguage}
							class="sr-only"
						/>
						<span class="text-green-400">{selectedLanguage === 'cpp' ? '[X]' : '[ ]'}</span>
						<span class="text-green-400">C++</span>
					</label>
					<label
						class="flex cursor-pointer items-center space-x-2 transition-colors hover:text-lime-400"
					>
						<input
							type="radio"
							name="language"
							value="java"
							bind:group={selectedLanguage}
							class="sr-only"
						/>
						<span class="text-green-400">{selectedLanguage === 'java' ? '[X]' : '[ ]'}</span>
						<span class="text-green-400">Java</span>
					</label>
				</div>
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
		<div class="m-auto h-[1000px] w-[100%]">
			{#if loaded}
				{#if times}
					<Wpm {wpmData} />

					<!-- Terminal-style replay prompt -->
					<div class="terminal-text mt-6">
						<div class="prompt">
							<span class="text-green-400">user@typingchallenge:~$</span>
							<span class="ml-2">run game --replay</span>
							<button
								onclick={resetGame}
								class="ml-4 text-green-400 underline transition hover:text-lime-400"
							>
								[ replay ]
							</button>
						</div>
					</div>
				{:else}
					<Typer {targetText} {competitionTime} on:timesUp={timesUp} on:activateTimer={timerr} />
				{/if}
			{:else}
				<p class="text-white">Loading file...</p>
			{/if}
		</div>
	{/if}
</div>
