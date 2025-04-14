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

<div
	class="glow-text cascadia-font mx-auto w-fit rounded-xl bg-black p-6 text-center text-5xl text-green-400 shadow-xl transition duration-300 select-none md:text-6xl"
	class:pulse={remaining <= 10 && remaining > 0}
	class:flash-red={flash}
>
	⏱ {formatTime(remaining)}
</div>

<style>
	.glow-text {
		text-shadow:
			0 0 6px #22c55e,
			0 0 12px #22c55e;
	}

	.pulse {
		animation: pulse 1s infinite;
	}

	.flash-red {
		color: #f87171;
		text-shadow:
			0 0 6px #f87171,
			0 0 12px #f87171;
		background-color: #1f1f1f;
	}

	@keyframes pulse {
		0% {
			transform: scale(1);
			text-shadow:
				0 0 8px #22c55e,
				0 0 16px #22c55e;
		}
		50% {
			transform: scale(1.05);
			text-shadow:
				0 0 12px #22c55e,
				0 0 20px #22c55e;
		}
		100% {
			transform: scale(1);
			text-shadow:
				0 0 8px #22c55e,
				0 0 16px #22c55e;
		}
	}
</style>
