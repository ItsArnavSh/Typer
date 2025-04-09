<script lang="ts">
	export let wpm: number;
	wpm = Math.round(wpm);
</script>

<div class="flex min-h-[40vh] items-center justify-center">
	<div
		class="neon-glow rounded-xl border border-green-500 bg-black px-6 py-4 text-center font-mono text-4xl text-green-400 shadow-2xl md:text-5xl"
	>
		<span class="mb-2 block text-lg tracking-wider opacity-80 md:text-xl">Your WPM is</span>
		<span class="text-6xl font-bold tracking-widest md:text-7xl">{wpm}</span>
	</div>
</div>

<style>
	.neon-glow {
		text-shadow:
			0 0 6px #22c55e,
			0 0 12px #22c55e,
			0 0 18px #22c55e;
		box-shadow:
			0 0 10px rgba(34, 197, 94, 0.3),
			0 0 30px rgba(34, 197, 94, 0.2);
	}
</style>
