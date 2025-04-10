<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	export let competitionTime: number;
	export let targetText: string;
	export let allowSpace = false;
	const dispatch = createEventDispatcher();

	const newSpace = '\u0131'; // dotless i
	const newEnter = '\u02BC'; // modifier apostrophe
	const newTab = '\u03BC';   // Greek mu

	let yetToStart = true;

	// Prepare the display text by replacing spaces, newlines, and tabs then splitting into an array.
	let displayText = targetText
		.replace(/ /g, newSpace)
		.replace(/\n/g, newEnter)
		.replace(/\t/g, newTab)
		.split('');

	function runAfter(callback: () => void) {
		setTimeout(callback, competitionTime * 1000);
	}

	let wpm: number;
	function updateScore() {
		let minutes = competitionTime / 60;
		// Raw WPM: every 5 characters is considered one word
		let words =
			userInput.replace(newSpace, '').replace(newEnter, '').replace(newTab, '').length / 5;
		let rawWPM = words / minutes;

		// Count correct and wrong characters by querying elements with the respective CSS classes.
		const correctCount = document.querySelectorAll('.correct').length;
		const wrongCount = document.querySelectorAll('.error').length;

		// Accuracy-based scoring (optional)
		const totalTyped = correctCount + wrongCount;
		const accuracy = totalTyped > 0 ? correctCount / totalTyped : 0;

		// Penalized score (score scaled down from raw WPM based on accuracy)
		const score = Math.max(rawWPM * accuracy, 0);
		wpm = score;
		let total = totalTyped;
		dispatch('timesUp', {
			wpm,      // The score
			rawWPM,   // The score, assuming no mistakes
			total,    // Total characters typed
			correctCount,
			wrongCount
		});
	}

	let userInput = '';
	let userInpArray: string[] = [];
	let forbiddenArr = allowSpace ? [newEnter, newTab] : [newSpace, newEnter, newTab];

	function updateData() {
		if (yetToStart) {
			runAfter(updateScore);
			dispatch('activateTimer', null);
			yetToStart = false;
		}
		// Adjust userInput: if spaces should be allowed, replace with newSpace; otherwise, remove them.
		userInput = userInput.replaceAll(' ', allowSpace ? newSpace : '');
		// If the next character in displayText is a forbidden special character, automatically add it.
		while (forbiddenArr.includes(displayText[userInput.length])) {
			userInput += displayText[userInput.length];
		}
		userInpArray = userInput.split('');
	}

	let blank = ' ';
	let inputRef: HTMLInputElement;
	function focusInput() {
		inputRef?.focus();
	}

	// Always render the entire text
	let letLower: number;
	let letHigher: number;
	$: {
		letLower = 0;
		letHigher = displayText.length;
	}
</script>

<div class="terminal hide-scrollbar h-[50%] scroll-m-0 overflow-auto bg-black font-mono">
	<button
		class="fixed z-10 h-[40%] w-[60%] opacity-0"
		type="button"
		onclick={() => {
			focusInput();
		}}>s</button
	>
	<div class="screen"></div>
	<div class="flicker"></div>
	<!-- Target text in light opacity -->
	<p class="hide-scrollbar absolute top-20 left-20 z-1 overflow-auto opacity-40">
		{#each displayText as char, i (i)}
			{#if i >= letLower && i <= letHigher}
				{#if (i < userInput.length ? userInput[i] : char) == newEnter}
					<br />
				{:else if (i < userInput.length ? userInput[i] : char) == newSpace}
					{blank}
				{:else if (i < userInput.length ? userInput[i] : char) == newTab}
					<span>&nbsp;&nbsp</span>
				{:else}
					<span class="terminal-text response">{i < userInput.length ? userInput[i] : char}</span>
				{/if}
			{/if}
		{/each}
	</p>

	<!-- User input layered on top -->
	<p class="absolute top-20 left-20 z-2 overflow-auto">
		{#each userInpArray as char, i (i)}
			{#if i >= letLower && i <= letHigher}
				{#if (i < userInput.length ? userInput[i] : char) == newEnter}
					{#if userInpArray.length - 1 === i}<span class="cursor"></span>{/if}<br />
					<span id="_{i}" class=""></span>
				{:else if (i < userInput.length ? userInput[i] : char) == newSpace}
					{blank}{#if userInpArray.length - 1 === i}<span class="cursor"></span>{/if}
				{:else if (i < userInput.length ? userInput[i] : char) == newTab}
					<span>&nbsp;&nbsp;</span>{#if userInpArray.length - 1 === i}<span class="cursor"
						></span>{/if}
				{:else}
					<span
						class={char == displayText[i]
							? 'terminal-text response correct'
							: 'terminal-text error wrong'}
					>
						{char}{#if userInpArray.length - 1 === i}<span class="cursor"></span>{/if}
					</span>
				{/if}
			{/if}
		{/each}
	</p>
	<input
		class="pointer-events-none absolute z-5 w-full bg-none opacity-0"
		type="text"
		oninput={() => {
			updateData();
		}}
		onkeydown={(e) => {
			if (e.key == 'Backspace') {
				while ([newTab, newEnter, newSpace].includes(userInput[userInput.length - 1]))
					userInput = userInput.slice(0, -1);
			}
		}}
		autofocus
		bind:value={userInput}
		bind:this={inputRef}
		autocomplete="off"
	/>
</div>
