<script>
	import { onMount } from 'svelte';
	import Header from '../components/Header.svelte';
	import Timer from '../components/Timer.svelte';
	import Typer from '../components/Typer.svelte';
	import Wpm from '../components/WPM.svelte';
	import { getGithubFileContent } from '../utils/getGitCode';
	let start = false;
	let times = false;
	let loaded = false;
	function timerr() {
		start = true;
	}
	let wpm = 0;
	function timesUp(event) {
		wpm = event.detail.wpm;
		console.log(wpm);
		times = true;
	}
	let competitionTime = 5;

	let githubFileUrl = 'https://github.com/ItsArnavSh/Typer/blob/main/src/routes/%2Bpage.svelte';
	let targetText = '';
	onMount(async () => {
		targetText = await getGithubFileContent(githubFileUrl);
		console.log(targetText);
		loaded = true;
	});
</script>

<div class="main flex h-full w-full flex-col items-center justify-center bg-black">
	<div class="relative flex w-full items-center justify-center">
		<Header />
		<div class="absolute right-0">
			{#if start}
				<Timer seconds={competitionTime} />
			{:else}
				<p class="terminal-text prompt mr-5 p-4 font-mono">Start Typing For Timer</p>
			{/if}
		</div>
	</div>
	<div class="m-auto h-[1000px] w-[50%]">
		{#if loaded}
			{#if times}
				<Wpm {wpm} />
			{:else}
				<Typer {targetText} {competitionTime} on:timesUp={timesUp} on:activateTimer={timerr} />
			{/if}
		{:else}
			Yet To Load
		{/if}
	</div>
</div>
