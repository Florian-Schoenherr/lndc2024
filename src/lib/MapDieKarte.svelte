<script lang="ts">
	import { Button } from 'flowbite-svelte';
	import type { MapMouseEvent } from 'maplibre-gl';
	import { DefaultMarker, MapLibre } from 'svelte-maplibre';
	import { type LngLatLike } from 'svelte-maplibre';

	// ach man
	let { saveLocation }: { saveLocation: (arg0: LngLatLike) => void } = $props();

	let map: any = $state(null);
	let mapContainer: any = $state(null);

	$inspect(map);
	$inspect(mapContainer);

	$effect(() => {
		console.log(mapContainer);
		let yes = mapContainer.parentElement.style.bottom;
		mapContainer.parentElement.style.bottom = 5;
		// mapContainer.parentElement.style.bottom = yes;
	});

	let mapCameraPosition: LngLatLike = $state([12.5266515, 50.7209498]);
	let mapZoomLevel: number = $state(9);

	let marker: null | { lngLat: LngLatLike } = $state(null);
	async function addMarker(e: CustomEvent<MapMouseEvent>) {
		marker = { lngLat: e.detail.lngLat };
		console.log(marker);
	}
</script>

<MapLibre
	style="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
	standardControls
	bind:mapContainer
	bind:map
	bind:zoom={mapZoomLevel}
	bind:center={mapCameraPosition}
	on:click={addMarker}
	on:load={(event) => {
		console.log('load', mapContainer);
		let yes = mapContainer.style.bottom;
		mapContainer.style.bottom = 5;
		mapContainer.parentElement.style.bottom = yes;
		map.resize();
		console.log('was', map);
		// map.reload();
	}}
>
	{#if marker}
		<DefaultMarker bind:lngLat={marker.lngLat} draggable />
	{/if}
</MapLibre>

{#if marker}
	<Button
		class="fixed bottom-10 z-1 w-full h-14 text-2xl"
		on:click={() => saveLocation(marker!.lngLat)}>Location festlegen</Button
	>
{/if}

<style>
	:global(body, html) {
		height: 100%;
		width: 100%;
	}

	:global(.map) {
		position: absolute;
		top: 0;
		left: 0;
		height: 100%;
		width: 100%;
	}
	:global(.maplibregl-canvas-container) {
		width: 100%;
		height: 100%;
	}
	:global(.maplibregl-canvas) {
		width: 100%;
		height: 100%;
	}
</style>
