<script lang="ts">
	import Header from '../components/Header.svelte';
	import Timer from '../components/Timer.svelte';
	import Typer from '../components/Typer.svelte';
	import Wpm from '../components/WPM.svelte';
	import { getGithubFileContent } from '../utils/getGitCode';

	let start = false;
	let times = false;
	let loaded = false;
	let wpmData = { wpm: 0, raw_wpm: 0, total: 0, correctCount: 0, wrongCount: 0 };

	let competitionTime: number = 5;
	let githubFileUrl = '';
	let targetText = '';
	let allowSpace = false;
	let formSubmitted = false;

	function timerr() {
		start = true;
	}

	function timesUp(event) {
		wpmData.wpm = event.detail.wpm;
		wpmData.raw_wpm = event.detail.rawWPM;
		wpmData.total = event.detail.total;
		wpmData.correctCount = event.detail.correctCount;
		wpmData.wrongCount = event.detail.wrongCount;
		times = true;
	}

	async function handleSubmit() {
		if (!githubFileUrl || competitionTime <= 0) {
			alert('Please provide a valid GitHub URL and time.');
			return;
		}

		targetText = await getGithubFileContent(githubFileUrl);
		loaded = true;
		formSubmitted = true;
	}
</script>

<!-- UI -->
<div class="main flex h-full w-full flex-col items-center justify-center bg-black text-white">
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

	<!-- Initial Form -->
	{#if !formSubmitted}
		<div class="mt-10 flex w-[60%] flex-col space-y-6">
			<!-- Competition Time -->
			<div class="terminal-text prompt flex flex-col">
				<label class="mb-2">Competition Time (seconds):</label>
				<input
					type="number"
					bind:value={competitionTime}
					min="1"
					class="terminal-text response rounded border border-gray-700 bg-black p-2 focus:ring-2 focus:ring-green-400 focus:outline-none"
				/>
			</div>

			<!-- GitHub File URL -->
			<div class="terminal-text prompt flex flex-row">
				<label class="mb-2">GitHub File URL:</label>
				<input
					type="text"
					bind:value={githubFileUrl}
					placeholder="https://github.com/..."
					class="terminal-text response w-full rounded border border-gray-700 bg-black p-2 focus:ring-2 focus:ring-green-400 focus:outline-none"
				/>
			</div>

			<!-- Allow Space Checkbox -->
			<div class="terminal-text prompt flex items-center space-x-2">
				<input type="checkbox" bind:checked={allowSpace} id="allowSpace" class="accent-green-500" />
				<label for="allowSpace">Allow Space</label>
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
				{:else}
					<Typer
						{allowSpace}
						{targetText}
						{competitionTime}
						on:timesUp={timesUp}
						on:activateTimer={timerr}
					/>
				{/if}
			{:else}
				<p class="text-white">Loading file...</p>
			{/if}
		</div>
	{/if}
</div>
