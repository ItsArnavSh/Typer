<script>
	import Terminal from './Terminal.svelte';

	let currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

	// Update clock every minute
	setInterval(() => {
		currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
	}, 60000);
</script>

<!-- Full Retro Desktop Environment -->
<div class="desktop-environment relative min-h-screen overflow-hidden bg-teal-600">
	<!-- Desktop Background Pattern -->
	<div class="desktop-bg absolute inset-0"></div>

	<!-- Desktop Icons -->
	<div class="desktop-icons absolute top-4 left-4 space-y-4">
		<div class="desktop-icon group flex cursor-pointer flex-col items-center">
			<div
				class="icon-bg flex h-8 w-8 items-center justify-center border border-gray-400 bg-gray-300 text-xs"
			>
				💾
			</div>
			<span class="mt-1 px-1 text-xs text-white group-hover:bg-blue-600">System</span>
		</div>
		<div class="desktop-icon group flex cursor-pointer flex-col items-center">
			<div
				class="icon-bg flex h-8 w-8 items-center justify-center border border-gray-400 bg-gray-300 text-xs"
			>
				📁
			</div>
			<span class="mt-1 px-1 text-xs text-white group-hover:bg-blue-600">Games</span>
		</div>
		<div class="desktop-icon group flex cursor-pointer flex-col items-center">
			<div
				class="icon-bg flex h-8 w-8 items-center justify-center border border-gray-400 bg-gray-300 text-xs"
			>
				🗑️
			</div>
			<span class="mt-1 px-1 text-xs text-white group-hover:bg-blue-600">Trash</span>
		</div>
	</div>

	<!-- Terminal Window Component -->
	<div class="flex min-h-screen items-center justify-center p-8">
		<Terminal />
	</div>

	<!-- Taskbar -->
	<div
		class="taskbar fixed right-0 bottom-0 left-0 flex h-8 items-center justify-between border-t-2 border-t-white border-r-gray-600 border-l-white bg-gray-300 px-2"
	>
		<!-- Start Button -->
		<button
			class="start-btn flex items-center space-x-1 border border-t-white border-r-gray-600 border-b-gray-600 border-l-white bg-gray-300 px-3 py-1 text-xs font-bold hover:bg-gray-200 active:border-t-gray-600 active:border-r-white active:border-b-white active:border-l-gray-600"
		>
			<div class="h-3 w-3 rounded-sm bg-red-600"></div>
			<span>Start</span>
		</button>

		<!-- Running Programs -->
		<div class="flex space-x-1">
			<div class="taskbar-item border border-gray-600 bg-gray-400 px-2 py-1 text-xs">Terminal</div>
		</div>

		<!-- System Tray -->
		<div class="system-tray flex items-center space-x-2 text-xs">
			<span>🔊</span>
			<span
				class="border border-t-gray-600 border-r-white border-b-white border-l-gray-600 bg-gray-400 px-2 py-1"
			>
				{currentTime}
			</span>
		</div>
	</div>
</div>

<style>
	@import url('https://fonts.googleapis.com/css2?family=MS+Gothic&display=swap');

	.desktop-environment {
		font-family: 'MS Gothic', 'Courier New', monospace;
		background: #008080;
		background-image:
			repeating-linear-gradient(
				45deg,
				transparent,
				transparent 2px,
				rgba(255, 255, 255, 0.1) 2px,
				rgba(255, 255, 255, 0.1) 4px
			),
			repeating-linear-gradient(
				-45deg,
				transparent,
				transparent 2px,
				rgba(0, 0, 0, 0.1) 2px,
				rgba(0, 0, 0, 0.1) 4px
			);
	}

	.desktop-bg {
		background-image:
			radial-gradient(circle at 25% 25%, rgba(0, 128, 128, 0.8) 0%, transparent 50%),
			radial-gradient(circle at 75% 75%, rgba(0, 100, 100, 0.6) 0%, transparent 50%);
		animation: subtle-shift 20s ease-in-out infinite;
	}

	@keyframes subtle-shift {
		0%,
		100% {
			opacity: 0.3;
		}
		50% {
			opacity: 0.5;
		}
	}

	.taskbar {
		background: #c0c0c0;
		box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.8);
	}

	.start-btn {
		transition: all 0.1s ease;
	}

	.desktop-icon:hover .icon-bg {
		background: #316ac5;
		color: white;
	}

	/* Classic 3D button effects */
	.start-btn:active {
		box-shadow: inset 1px 1px 2px rgba(0, 0, 0, 0.5);
	}

	/* Enhanced retro styling */
	.taskbar-item {
		background: linear-gradient(to bottom, #e0e0e0, #c0c0c0);
		text-shadow: 1px 1px 0 rgba(255, 255, 255, 0.8);
	}

	/* Mobile responsiveness */
	@media (max-width: 768px) {
		.desktop-icons {
			display: none;
		}

		.taskbar {
			height: 32px;
		}
	}
</style>
