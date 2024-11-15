<script lang="ts">
	import type { MapMouseEvent } from 'maplibre-gl';
	import { DefaultMarker, MapLibre, type MarkerClickInfo } from 'svelte-maplibre';
	import { type LngLatLike } from 'svelte-maplibre';

	// ach man
	const { saveLocation, maxRadius } = $props<{
		saveLocation: (arg0: LngLatLike) => void;
		maxRadius: number;
	}>();

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

	let markerPosition: null | { lngLat: LngLatLike } = $state(null);

	async function addMarker(e: CustomEvent<MapMouseEvent>) {
		markerPosition = { lngLat: e.detail.lngLat };
		console.log(markerPosition);
	}

	// Function to create a GeoJSON circle
	function createGeoJSONCircle(
		centerLongitude: number,
		centerLatitude: number,
		radiusInMeters: number,
		points = 64
	) {
		//console.log(centerLatitude);
		//console.log(centerLatitude);
		//console.log(radiusInMeters);

		const coords = [];
		// Earth's radius in meters
		const earthRadius = 6378137;

		// Convert radius to degrees
		const angularDistance = radiusInMeters / earthRadius;

		for (let i = 0; i < points; i++) {
			const theta = (i / points) * (2 * Math.PI);

			// Calculate point coordinates
			const latitude = centerLatitude + angularDistance * Math.sin(theta) * (180 / Math.PI);
			const longitude =
				centerLongitude +
				(angularDistance * Math.cos(theta) * (180 / Math.PI)) /
					Math.cos((centerLatitude * Math.PI) / 180);

			coords.push([longitude, latitude]);
		}
		coords.push(coords[0]); // Close the circle

		return {
			type: 'Feature',
			geometry: {
				type: 'Polygon',
				coordinates: [coords]
			}
		};
	}

	function updateCircle(e: CustomEvent<MarkerClickInfo>): void {
		//console.log(markerPosition.lngLat);
		const circleGeoJSON = createGeoJSONCircle(
			markerPosition.lngLat.lng,
			markerPosition.lngLat.lat,
			maxRadius
		);
		//console.log(circleGeoJSON);

		if (map.getSource('circle')) {
			const updatedGeoJSON = createGeoJSONCircle(
				markerPosition.lngLat.lng,
				markerPosition.lngLat.lat,
				maxRadius
			);
			map.getSource('circle').setData(updatedGeoJSON);
		} else {
			map.addSource('circle', {
				type: 'geojson',
				data: circleGeoJSON
			});
			map.addLayer({
				id: 'circle-layer',
				type: 'fill',
				source: 'circle',
				paint: {
					'fill-color': '#007cbf',
					'fill-opacity': 0.3
				}
			});
		}
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
		map.resize();
		console.log('Map loaded.');
	}}
>
	{#if markerPosition}
		<DefaultMarker bind:lngLat={markerPosition.lngLat} draggable on:drag={updateCircle} />
	{/if}
</MapLibre>

{#if markerPosition}
	<button
		class="fixed bottom-10 z-1 w-full h-14 text-2xl bg-orange-400 text-white font-bold rounded"
		on:click={() => saveLocation(markerPosition!.lngLat)}
	>
		Location festlegen
	</button>
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
