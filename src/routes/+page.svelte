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
	let competitionTime = 5;
	let targetText =
		'#include<iostream>\n\n\tvoid bubbleSort(int arr[], int n) {\n\t\tfor (int i = 0; i < n - 1; ++i) {\n\t\t\tfor (int j = 0; j < n - i - 1; ++j) {\n\t\t\t\tif (arr[j] > arr[j + 1]) {\n\t\t\t\t\tint temp = arr[j];\n\t\t\t\t\tarr[j] = arr[j + 1];\n\t\t\t\t\tarr[j + 1] = temp;\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\t}\n\n\tvoid printArray(const int arr[], int size) {\n\t\tfor (int i = 0; i < size; ++i)\n\t\t\tstd::cout << arr[i] << " ";\n\t\tstd::cout << "\\n";\n\t}\n\n\tint main() {\n\t\tint arr[] = {64, 34, 25, 12, 22, 11, 90};\n\t\tint n = sizeof(arr) / sizeof(arr[0]);\n\t\tbubbleSort(arr, n);\n\t\tstd::cout << "Sorted array: ";\n\t\tprintArray(arr, n);\n\t\treturn 0;\n\t}';
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
		{#if times}
			<Wpm {wpm} />
		{:else}
			<Typer {targetText} {competitionTime} on:timesUp={timesUp} on:activateTimer={timerr} />
		{/if}
	</div>
</div>
