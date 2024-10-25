<script lang="ts">
    import type { PageData } from './$types';
    	//Import Svelte Kit lifecycle and navigation functions
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
    // Import third party components
	import maplibre from 'maplibre-gl';
	import { DefaultMarker, Popup, MapLibre} from 'svelte-maplibre';
	import {type LngLatLike} from 'svelte-maplibre'; //Maplibre component specific type

    export let data: PageData;

    let mapClasses: any = 'map';

	let mapHomePosition: LngLatLike = [12.5266515, 50.7209498];
	let mapCameraPosition: LngLatLike = [12.5266515, 50.7209498];
	let mapZoomLevel: number = 9;
    let mapObject: maplibre.Map;
</script>

<MapLibre
		style="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
		class={mapClasses}
		standardControls
		bind:zoom={mapZoomLevel}
		bind:center={mapCameraPosition}
		bind:map={mapObject}>
		
		<DefaultMarker bind:lngLat={mapHomePosition} draggable>
			<Popup openOn="click" offset={[0, -10]}>
					<div>HOME</div>
			</Popup>
		</DefaultMarker>

	</MapLibre>

<style>
    :global(*) {
		border: none;
		margin: 0;
		padding: 0;
	}

	:global(body,html) {
		height: 100%;
		width: 100%;
	}

	:global(.map) {
		height:100%;
		width: 100%;
	}
</style>