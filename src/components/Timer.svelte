<script lang="ts">
	import { onMount } from 'svelte';
	export let seconds: number;

	let remaining = seconds;
	let interval: number;
	let flash = false;

	onMount(() => {
		interval = setInterval(() => {
			if (remaining > 0) {
				remaining -= 1;
			} else {
				clearInterval(interval);
				flash = true;
				setTimeout(() => (flash = false), 1000);
			}
		}, 1000);

		return () => clearInterval(interval);
	});

	function formatTime(sec: number): string {
		const m = Math.floor(sec / 60)
			.toString()
			.padStart(2, '0');
		const s = (sec % 60).toString().padStart(2, '0');
		return `${m}:${s}`;
	}
</script>

<!-- Terminal style countdown -->
<div class="terminal-text text-xl md:text-2xl">
	<span
		class="ml-4 inline-block font-mono text-lime-400 transition-all duration-200"
		class:flash-border={flash}
		class:urgent={remaining <= 10 && remaining > 0}
	>
		[{formatTime(remaining)}]
	</span>
</div>

<style>
	.urgent {
		animation: blinkGreen 1s infinite;
	}

	.flash-border {
		border: 1px solid #f87171;
		padding: 0 0.5rem;
		border-radius: 4px;
		color: #f87171;
		text-shadow:
			0 0 3px #f87171,
			0 0 6px #f87171;
	}

	@keyframes blinkGreen {
		0%,
		100% {
			color: #22c55e;
			text-shadow: 0 0 4px #22c55e;
		}
		50% {
			color: #4ade80;
			text-shadow: 0 0 8px #4ade80;
		}
	}
</style>
