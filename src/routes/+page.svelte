<script lang="ts">
	import Header from '../components/Header.svelte';
	import Timer from '../components/Timer.svelte';
	import Typer from '../components/Typer.svelte';
	import Wpm from '../components/WPM.svelte';
	import { getGithubFileContent } from '../utils/getGitCode';

	let start = false;
	let times = false;
	let loaded = false;
	let wpm = 0;

	let competitionTime: number = 5;
	let githubFileUrl = '';
	let targetText = '';
	let formSubmitted = false;

	function timerr() {
		start = true;
	}

	function timesUp(event) {
		wpm = event.detail.wpm;
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
		<div class="mt-10 w-[60%]">
			<div class="terminal-text prompt mb-4 flex flex-row">
				<label>Competition Time (seconds):</label>
				<input
					type="number"
					bind:value={competitionTime}
					min="1"
					class="terminal-text response rounded border-0 bg-black p-2"
				/>
			</div>
			<div class="terminal-text prompt mb-4 flex w-full flex-row">
				<label>GitHub File URL:</label>
				<input
					type="text"
					bind:value={githubFileUrl}
					placeholder="https://github.com/..."
					class="terminal-text response w-max rounded bg-black p-2"
				/>
			</div>
			<button class="rounded bg-white px-4 py-2 text-black" onclick={handleSubmit}>
				Start Challenge
			</button>
		</div>
	{:else}
		<!-- Typing Area -->
		<div class="m-auto h-[1000px] w-[50%]">
			{#if loaded}
				{#if times}
					<Wpm {wpm} />
				{:else}
					<Typer {targetText} {competitionTime} on:timesUp={timesUp} on:activateTimer={timerr} />
				{/if}
			{:else}
				<p class="text-white">Loading file...</p>
			{/if}
		</div>
	{/if}
</div>
