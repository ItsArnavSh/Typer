<script>
	import {
		registerUser,
		loginUser,
		loginWithProvider,
		saveOAuthUser,
		isUsernameTaken
	} from '$lib/auth';
	import { auth } from '$lib/firebase';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	let isSignup = false;
	let email = '';
	let password = '';
	let name = '';
	let username = '';
	let loading = false;
	let error = '';
	let currentStep = 'main'; // 'main', 'processing', 'success'
	let terminalLines = [];
	let isOnline = true;

	onMount(() => {
		// Check online status
		const updateOnlineStatus = () => {
			isOnline = navigator.onLine;
			if (!isOnline) {
				error = 'Network connection lost. Please check your internet connection.';
			} else if (error.includes('Network connection')) {
				error = '';
			}
		};

		window.addEventListener('online', updateOnlineStatus);
		window.addEventListener('offline', updateOnlineStatus);
		updateOnlineStatus();

		return () => {
			window.removeEventListener('online', updateOnlineStatus);
			window.removeEventListener('offline', updateOnlineStatus);
		};
	});

	const resetForm = () => {
		email = '';
		password = '';
		name = '';
		username = '';
		error = '';
		currentStep = 'main';
		terminalLines = [];
	};

	const addTerminalLine = (text, type = 'response') => {
		terminalLines = [...terminalLines, { text, type }];
	};

	const toggleMode = () => {
		isSignup = !isSignup;
		resetForm();
	};

	async function handleSubmit() {
		if (!isOnline) {
			error = 'Cannot authenticate while offline. Please check your connection.';
			return;
		}

		loading = true;
		error = '';
		currentStep = 'processing';
		terminalLines = [];

		addTerminalLine(`> ${isSignup ? 'register' : 'login'} --user=${email}`, 'prompt');
		addTerminalLine('Establishing connection...', 'response');

		try {
			if (isSignup) {
				addTerminalLine('Creating user profile...', 'response');
				await registerUser(email, password, name, username);
				addTerminalLine('User registration successful!', 'response');
			} else {
				addTerminalLine('Authenticating credentials...', 'response');
				await loginUser(email, password);
				addTerminalLine('Authentication successful!', 'response');
			}

			addTerminalLine('Access granted. Redirecting...', 'response');
			currentStep = 'success';

			// Navigate immediately after success
			await goto('/');
		} catch (err) {
			console.error('Auth error:', err);
			let errorMsg = err.message;

			// Handle specific Firebase errors
			if (errorMsg.includes('offline') || errorMsg.includes('network')) {
				errorMsg = 'Network error. Please check your connection and try again.';
			} else if (errorMsg.includes('auth/')) {
				// Clean up Firebase auth error codes
				errorMsg = errorMsg.replace('auth/', '').replace(/-/g, ' ');
			}

			error = errorMsg;
			addTerminalLine(`ERROR: ${errorMsg}`, 'error');
			currentStep = 'main';
		} finally {
			loading = false;
		}
	}

	async function oauthLogin(provider) {
		if (!isOnline) {
			error = 'Cannot authenticate while offline. Please check your connection.';
			return;
		}

		loading = true;
		error = '';
		currentStep = 'processing';
		terminalLines = [];

		addTerminalLine(`> oauth --provider=${provider}`, 'prompt');
		addTerminalLine(`Connecting to ${provider} services...`, 'response');

		try {
			await loginWithProvider(provider);
			addTerminalLine('OAuth authentication successful!', 'response');
			addTerminalLine('Access granted. Redirecting...', 'response');

			// Navigate immediately after success
			await goto('/');
		} catch (err) {
			console.error('OAuth error:', err);

			if (err.message === 'new_oauth_user') {
				addTerminalLine('New OAuth user detected. Username required.', 'response');
				const usernamePrompt = prompt('$ enter username: ');
				if (!usernamePrompt) {
					error = 'Username required';
					addTerminalLine('ERROR: Username required', 'error');
					currentStep = 'main';
					return;
				}

				addTerminalLine(`> validate --username=${usernamePrompt}`, 'prompt');
				const taken = await isUsernameTaken(usernamePrompt);
				if (taken) {
					error = 'Username is already taken';
					addTerminalLine('ERROR: Username already exists', 'error');
					currentStep = 'main';
					return;
				}

				addTerminalLine('Username available. Creating profile...', 'response');
				const user = auth.currentUser;
				await saveOAuthUser(user.uid, user.email, user.displayName || '', usernamePrompt, provider);
				addTerminalLine('Profile creation successful!', 'response');
				addTerminalLine('Access granted. Redirecting...', 'response');

				await goto('/');
			} else {
				let errorMsg = err.message;

				// Handle specific errors
				if (errorMsg.includes('offline') || errorMsg.includes('network')) {
					errorMsg = 'Network error. Please check your connection and try again.';
				} else if (errorMsg.includes('popup') || errorMsg.includes('cancelled')) {
					errorMsg = 'Sign-in was cancelled or blocked by popup blocker.';
				}

				error = errorMsg;
				addTerminalLine(`ERROR: ${errorMsg}`, 'error');
				currentStep = 'main';
			}
		} finally {
			loading = false;
		}
	}
</script>

<div class="mx-auto mt-12 max-w-2xl">
	<div class="terminal screen">
		<div class="terminal-text">
			{#if currentStep === 'main'}
				<div class="prompt">
					$ auth --mode={isSignup ? 'register' : 'login'}
				</div>

				{#if error}
					<div class="error">ERROR: {error}</div>
				{/if}

				<div class="response">System ready. Please enter credentials:</div>
				<div class="response">[Use TAB and Sift+TAB to Navigate]</div>

				<form on:submit|preventDefault={handleSubmit} class="mt-4 space-y-3">
					{#if isSignup}
						<div class="prompt">
							name: <input
								class="ml-2 border-none bg-transparent font-mono text-green-400 outline-none"
								placeholder="John Doe"
								bind:value={name}
								required
							/>
						</div>
						<div class="prompt">
							username: <input
								class="ml-2 border-none bg-transparent font-mono text-green-400 outline-none"
								placeholder="johndoe"
								bind:value={username}
								required
							/>
						</div>
					{/if}
					<div class="prompt">
						email: <input
							class="ml-2 border-none bg-transparent font-mono text-green-400 outline-none"
							type="email"
							placeholder="john@example.com"
							bind:value={email}
							required
						/>
					</div>
					<div class="prompt">
						password: <input
							class="ml-2 border-none bg-transparent font-mono text-green-400 outline-none"
							type="password"
							placeholder="••••••••"
							bind:value={password}
							required
						/>
					</div>

					<div class="mt-4">
						<button
							type="submit"
							class="prompt cursor-pointer border-none bg-transparent font-mono transition-colors hover:text-yellow-400"
							disabled={loading}
						>
							{loading ? '> processing...' : `> execute ${isSignup ? 'register' : 'login'}`}
							<span class="cursor">_</span>
						</button>
					</div>
				</form>

				<div class="mt-6 space-y-2">
					<div class="response">Alternative authentication methods:</div>
					<button
						on:click={() => oauthLogin('google')}
						class="prompt block cursor-pointer border-none bg-transparent font-mono transition-colors hover:text-red-400"
						disabled={loading}
					>
						> oauth --provider=google
					</button>
					<button
						on:click={() => oauthLogin('github')}
						class="prompt block cursor-pointer border-none bg-transparent font-mono transition-colors hover:text-gray-400"
						disabled={loading}
					>
						> oauth --provider=github
					</button>
				</div>

				<div class="mt-6">
					<button
						on:click={toggleMode}
						class="response cursor-pointer border-none bg-transparent font-mono transition-colors hover:text-blue-400"
					>
						{isSignup ? '> switch --mode=login' : '> switch --mode=register'}
					</button>
				</div>
			{:else if currentStep === 'processing'}
				{#each terminalLines as line}
					<div class={line.type}>
						{line.text}
						{#if line === terminalLines[terminalLines.length - 1]}
							<span class="cursor">_</span>
						{/if}
					</div>
				{/each}
			{:else if currentStep === 'success'}
				{#each terminalLines as line}
					<div class={line.type}>
						{line.text}
					</div>
				{/each}
				<div class="response">
					Connection established. Welcome to the system.
					<span class="cursor">_</span>
				</div>
			{/if}
		</div>
	</div>
</div>

<style>
	input::placeholder {
		color: #4ade80;
		opacity: 0.5;
	}

	input:focus {
		outline: none;
	}

	button:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	button:disabled:hover {
		color: inherit !important;
	}
</style>
