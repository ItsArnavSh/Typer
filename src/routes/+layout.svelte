<script lang="ts">
	import '../app.css';
	let { children } = $props();
	import TerminalMenu from '../components/Nav.svelte';
</script>

<main>
	<TerminalMenu />
	{@render children()}
</main>
