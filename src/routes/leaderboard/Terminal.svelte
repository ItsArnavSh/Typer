<script lang="ts">
	import Leaderboard from './Leaderboard.svelte';
</script>

<!-- Terminal Window -->
<div class="retro-window relative w-full max-w-4xl">
	<!-- Window Frame -->
	<div
		class="window-frame border-2 border-t-white border-r-gray-600 border-b-gray-600 border-l-white bg-gray-300"
	>
		<!-- Title Bar -->
		<div
			class="title-bar flex items-center justify-between bg-gradient-to-r from-blue-600 to-blue-700 px-2 py-1 text-white select-none"
		>
			<!-- Window Title -->
			<div class="flex items-center space-x-2">
				<div
					class="flex h-4 w-4 items-center justify-center border border-gray-400 bg-gray-300 text-xs"
				>
					💻
				</div>
				<span class="text-sm font-bold">Terminal - Typing Challenge</span>
			</div>

			<!-- Window Controls -->
			<div class="flex items-center space-x-1">
				<!-- Minimize Button -->
				<button
					class="window-btn flex h-4 w-4 items-center justify-center border border-t-white border-r-gray-600 border-b-gray-600 border-l-white bg-gray-300 hover:bg-gray-200 active:border-t-gray-600 active:border-r-white active:border-b-white active:border-l-gray-600"
				>
					<div class="h-0.5 w-2 bg-black"></div>
				</button>
				<!-- Maximize Button -->
				<button
					class="window-btn flex h-4 w-4 items-center justify-center border border-t-white border-r-gray-600 border-b-gray-600 border-l-white bg-gray-300 hover:bg-gray-200 active:border-t-gray-600 active:border-r-white active:border-b-white active:border-l-gray-600"
				>
					<div class="h-2 w-2 border border-black"></div>
				</button>
				<!-- Close Button -->
				<button
					class="window-btn flex h-4 w-4 items-center justify-center border border-t-white border-r-gray-600 border-b-gray-600 border-l-white bg-gray-300 hover:bg-gray-200 active:border-t-gray-600 active:border-r-white active:border-b-white active:border-l-gray-600"
				>
					<div class="text-xs leading-none font-bold text-black">×</div>
				</button>
			</div>
		</div>

		<!-- Terminal Screen -->
		<div
			class="terminal-screen min-h-[500px] border-2 border-t-gray-600 border-r-white border-b-white border-l-gray-600 bg-black p-4"
		>
			<!-- CRT Effect -->
			<div class="scanlines pointer-events-none absolute inset-0"></div>

			<!-- Terminal Content -->
			<Leaderboard />
		</div>
	</div>
</div>

<style>
</style>
