<script lang="ts">
	let menuOpen = false;
	import { onDestroy } from 'svelte';
	const links = [
		{ href: '/', label: 'Play', permissions: 'drwxr-xr-x', size: '4096', date: 'Jun 25 12:11' },
		{
			href: '/leaderboard',
			label: 'leaderboard',
			permissions: 'drwxr-xr-x',
			size: '4096',
			date: 'Jun 25 12:10'
		},
		{
			href: '/rules',
			label: 'rules',
			permissions: 'drwxr-xr-x',
			size: '2048',
			date: 'Jun 25 12:09'
		},
		{
			href: '/osdhack',
			label: 'OSDHack',
			permissions: 'drwxr-xr-x',
			size: '8192',
			date: 'Jun 25 12:08'
		}
	];
	let currentTime = new Date().toLocaleTimeString();
	// Update time every minute
	const interval = setInterval(() => {
		currentTime = new Date().toLocaleTimeString();
	}, 60000);
	onDestroy(() => clearInterval(interval));
</script>

<div class="fixed top-4 right-4 z-50 font-mono">
	<!-- Menu Button -->
	<div
		class="terminal flex items-center justify-end space-x-3 rounded border border-green-400 bg-black px-4 py-2 shadow-lg"
	>
		<button
			class="prompt text-right transition-all hover:text-lime-400"
			on:click={() => (menuOpen = !menuOpen)}
			aria-label="Toggle menu"
		>
			OSDType -h
		</button>
	</div>

	<!-- Terminal Dropdown -->
	{#if menuOpen}
		<div class="terminal mt-2 w-max border border-green-400 bg-black shadow-2xl">
			<div class="p-4">
				<!-- Terminal Header -->
				<div class="prompt mb-3 text-green-400">user@OSDType:~$ ls -la</div>

				<!-- File Listings -->
				<div class="response space-y-1 text-sm">
					<div class="text-green-300 opacity-70">total 4</div>

					{#each links as { href, label, permissions, size, date }}
						<a
							{href}
							class="block rounded px-1 py-0.5 text-green-300 transition-all hover:bg-gray-900 hover:text-lime-400 hover:shadow-lg"
							on:click={() => (menuOpen = false)}
						>
							<div class="text-green-300">
								<span class="opacity-70">drwxr-xr-x 3 user 4096 {date}</span>
								<span class=" opacity-100">{label}</span>
							</div>
						</a>
					{/each}
				</div>

				<!-- Command Prompt -->
				<div class="prompt mt-3 text-green-400">
					user@OSDType:~$ <span class="cursor"></span>
				</div>
			</div>
		</div>
	{/if}
</div>

<style>
	.terminal {
		padding: 1rem;
		box-sizing: border-box;
		position: relative;
		background: #000000;
	}
	.terminal::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%);
		background-size: 100% 4px;
		pointer-events: none;
		z-index: 2;
		animation: scanline 10ms linear infinite;
	}

	@keyframes scanline {
		0% {
			background-position: 0 -100vh;
		}
		100% {
			background-position: 0 100vh;
		}
	}

	.terminal-text {
		font-size: 1.25rem;
		line-height: 1.5;
		margin-bottom: 0.75rem;
		position: relative;
		display: inline-block;
	}

	.prompt {
		color: #00ff00;
		text-shadow:
			0 0 5px #00ff00,
			0 0 10px rgba(0, 255, 0, 0.8);
		animation: textFlicker 3s infinite alternate;
	}

	.response {
		color: #00ff00;
		text-shadow:
			0 0 5px #00ff00,
			0 0 8px rgba(0, 255, 0, 0.6);
		animation: textPulse 2s infinite alternate;
	}

	.error {
		color: #ff3333;
		text-shadow:
			0 0 5px #ff0000,
			0 0 10px rgba(255, 0, 0, 0.8);
		animation: errorPulse 1.5s infinite alternate;
	}

	.cursor {
		display: inline-block;
		width: 0.2rem;
		height: 1.2rem;
		background-color: #00ff00;
		vertical-align: middle;
		margin-left: 0.1rem;
		animation: cursorBlink 1.2s step-end infinite;
		box-shadow:
			0 0 5px #00ff00,
			0 0 8px rgba(0, 255, 0, 0.6);
		opacity: 50%;
	}

	@keyframes textFlicker {
		0% {
			opacity: 1;
		}
		100% {
			opacity: 0.8;
		}
	}

	@keyframes textPulse {
		0% {
			text-shadow:
				0 0 5px #00ff00,
				0 0 8px rgba(0, 255, 0, 0.6);
		}
		100% {
			text-shadow:
				0 0 8px #00ff00,
				0 0 12px rgba(0, 255, 0, 0.8);
		}
	}

	@keyframes errorPulse {
		0% {
			text-shadow:
				0 0 5px #ff0000,
				0 0 10px rgba(255, 0, 0, 0.8);
		}
		100% {
			text-shadow:
				0 0 8px #ff0000,
				0 0 15px rgba(255, 0, 0, 1);
		}
	}

	@keyframes cursorBlink {
		0%,
		50% {
			opacity: 1;
		}
		51%,
		100% {
			opacity: 0;
		}
	}
</style>
