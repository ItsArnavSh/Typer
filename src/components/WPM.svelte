<script lang="ts">
	export let wpmData: {
		wpm: number;
		raw_wpm: number;
		total: number;
		correctCount: number;
		wrongCount: number;
	};

	let wpm = Math.round(wpmData.wpm);
	let rawWpm = Math.round(wpmData.raw_wpm);
	let correct = wpmData.correctCount;
	let wrong = wpmData.wrongCount;
</script>

<div class="flex min-h-[40vh] items-center justify-center">
	<div class="screen"></div>
	<div class="flicker"></div>
	<div
		class="cascadia-font flex flex-col rounded-xl border border-green-500 bg-black px-6 py-6 text-green-400 shadow-2xl md:text-xl"
	>
		<div class="terminal-text prompt mb-4">$ typing-stats yourText.txt</div>

		<div class="terminal-text">
			<span class="prompt"></span>
			<span class="response">WPM: <span class="text-2xl">{wpm}</span></span>
		</div>
		<div class="terminal-text">
			<span class="prompt"></span> <span class="response">Raw WPM: <span>{rawWpm}</span></span>
		</div>
		<div class="terminal-text">
			<span class="prompt"></span>
			<span class="response">Correct Chars: <span>{correct}</span></span>
		</div>
		<div class="terminal-text error">
			<span class="prompt"></span> Wrong Chars: <span>{wrong}</span>
		</div>

		<div class="terminal-text prompt">$ <span class="cursor"></span></div>
	</div>
</div>
