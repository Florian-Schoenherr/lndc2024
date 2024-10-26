<script>
	// modified from here: https://stackoverflow.com/questions/62733094/implement-a-portal-in-svelte
	import { onMount, onDestroy } from 'svelte';
	let ref;
	let portal;

	onMount(() => {
		portal = document.createElement('div');
		portal.className = 'portal';
		document.body.appendChild(portal);
		portal.appendChild(ref);
	});

	onDestroy(() => {
		document.body.removeChild(portal);
	});
</script>

<div class="portal-clone">
	<div class="w-full h-full" bind:this={ref}>
		<slot></slot>
	</div>
</div>

<style>
	.portal-clone {
		display: none;
	}
	:global(.portal) {
		position: fixed;
		z-index: 100;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
	}
</style>
