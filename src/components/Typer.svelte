<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	let targetText =
		'#include<iostream>\n\n\tvoid bubbleSort(int arr[], int n) {\n\t\tfor (int i = 0; i < n - 1; ++i) {\n\t\t\tfor (int j = 0; j < n - i - 1; ++j) {\n\t\t\t\tif (arr[j] > arr[j + 1]) {\n\t\t\t\t\tint temp = arr[j];\n\t\t\t\t\tarr[j] = arr[j + 1];\n\t\t\t\t\tarr[j + 1] = temp;\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\t}\n\n\tvoid printArray(const int arr[], int size) {\n\t\tfor (int i = 0; i < size; ++i)\n\t\t\tstd::cout << arr[i] << " ";\n\t\tstd::cout << "\\n";\n\t}\n\n\tint main() {\n\t\tint arr[] = {64, 34, 25, 12, 22, 11, 90};\n\t\tint n = sizeof(arr) / sizeof(arr[0]);\n\t\tbubbleSort(arr, n);\n\t\tstd::cout << "Sorted array: ";\n\t\tprintArray(arr, n);\n\t\treturn 0;\n\t}';

	const dispatch = createEventDispatcher();
	const newSpace = '\u0131'; // dotless i
	const newEnter = '\u02BC'; // modifier apostrophe
	const newTab = '\u03BC'; // Greek mu
	let yetToStart = true;
	let displayText = targetText
		.replace(/ /g, newSpace)
		.replace(/\n/g, newEnter)
		.replace(/\t/g, newTab)
		.split('');
	const competitionTime = 20000;
	function runAfter(callback: () => void) {
		setTimeout(callback, competitionTime);
	}
	let wpm = 0;
	function updateScore() {
		let minutes = competitionTime / 1000 / 60;
		let words =
			userInput.replace(newSpace, '').replace(newEnter, '').replace(newTab, '').length / 5;
		wpm = words / minutes;
		dispatch('timesUp', { wpm });
	}
	let userInput = '';
	let userInpArray: string[] = [];
	function updateData() {
		if (yetToStart) {
			runAfter(updateScore);
			dispatch('activateTimer', null);
			yetToStart = false;
		}

		userInput = userInput.replaceAll(' ', '');
		//userInpArray = userInput.split('');
		while ([newSpace, newEnter, newTab].includes(displayText[userInput.length])) {
			//userInpArray.push(displayText[userInput.length]);
			userInput += displayText[userInput.length];
		}
		userInpArray = userInput.split('');
	}

	let blank = ' ';
	let inputRef: HTMLInputElement;
	function focusInput() {
		inputRef?.focus();
	}

	function findAllOccurrences(str: string, char: string) {
		return [...str].map((c, i) => (c === char ? i : -1)).filter((i) => i !== -1);
	}

	let enters = findAllOccurrences(targetText, '\n');
	enters = [0, ...enters];
	// Get the index in `enters` of the next \n after userInput.length
	function nextEnterIndex(pos: number): number {
		for (let i = 0; i < enters.length; i++) {
			if (enters[i] > pos) return i;
		}
		return enters.length - 1; // fallback to last \n if beyond
	}
	let letLower: number, letHigher: number;
	$: {
		const currentEnterIndex = nextEnterIndex(userInput.length);

		// Clamp so we don't go negative
		const lowerEnterIndex = Math.max(currentEnterIndex - 3, 0);
		const higherEnterIndex = Math.min(currentEnterIndex + 10, enters.length - 1);

		// Now these are positions (in the actual string):
		letLower = enters[lowerEnterIndex];
		letHigher = enters[higherEnterIndex];
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
					<span class={char == displayText[i] ? 'terminal-text response' : 'terminal-text error'}>
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
