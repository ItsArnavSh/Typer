<script>
	import Header from '../components/Header.svelte';
	import Timer from '../components/Timer.svelte';
	import Typer from '../components/Typer.svelte';
	import Wpm from '../components/WPM.svelte';
	let start = false;
	let times = false;
	function timerr() {
		start = true;
	}
	let wpm = 0;
	function timesUp(event) {
		wpm = event.detail.wpm;
		console.log(wpm);
		times = true;
	}
</script>

<div class="main flex h-full w-full flex-col items-center justify-center bg-black">
	<div class="relative flex w-full items-center justify-center">
		<Header />
		<div class="absolute right-0">
			{#if start}
				<Timer seconds={20} />
			{:else}
				<p class="terminal-text prompt mr-5 p-4 font-mono">Start Typing For Timer</p>
			{/if}
		</div>
	</div>
	<div class="m-auto h-[1000px] w-[50%]">
		{#if times}
			<Wpm {wpm} />
		{:else}
			<Typer on:timesUp={timesUp} on:activateTimer={timerr} />
		{/if}
	</div>
</div>
