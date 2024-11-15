<script lang="ts">
	import { goto } from '$app/navigation';
	import { votingDuration } from '$lib/data/data';
	import {
		EventIdea,
		groupSizeConstraint,
		localizations,
		locationRadiusConstraint,
		priceConstraint,
		timeOfDayConstraint
	} from '$lib/types';
	import { onMount } from 'svelte';
	import { DefaultMarker, MapLibre, type LngLatLike } from 'svelte-maplibre';

	let { data } = $props();
	let eventIdea: EventIdea = $state(data.eventIdea);

	let map: any = $state(null);
	let mapContainer: any = $state(null);
	let mapZoomLevel: number = $state(13);

	// Function to create a GeoJSON circle
	function createGeoJSONCircle(
		centerLongitude: number,
		centerLatitude: number,
		radiusInMeters: number,
		points = 64
	) {
		//console.log(centerLatitude);
		//console.log(centerLatitude);

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

	function navigateHome(event: MouseEvent & { currentTarget: EventTarget & HTMLButtonElement }) {
		goto('/');
	}

	function differenceInDays(date1: Date, date2: Date): number {
		const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
		const diffInTime = date2.getTime() - date1.getTime();
		return Math.round(diffInTime / oneDay);
	}

	function calcRemainingVotingDays(ideaCreationDate: Date) {
		//console.log(ideaCreationDate);
		let lastVotingDate: Date = new Date(ideaCreationDate);
		lastVotingDate.setDate(lastVotingDate.getDate() + votingDuration);
		//console.log(lastVotingDate);

		let reaminingDays = differenceInDays(new Date(), lastVotingDate);

		if (reaminingDays < 0) {
			reaminingDays = 0;
		}

		return reaminingDays;
	}

	onMount(() => {
		console.log(eventIdea.locationCoordinates);
	});
</script>

<div class="flex flex-col h-full">
	<header id="header">
		<h1 class="text-4xl font-bold p-2 text-center">Details</h1>
	</header>

	<main class="flex-grow overflow-y-auto p-4 space-y-2">
		<!-- Title & Icon -->
		<div class="text-center space-y-2">
			<div class="text-6xl">{eventIdea.icon}</div>
			<h2 class="text-2xl font-semibold">{eventIdea.title}</h2>
			<p class="text-sm text-gray-500">
				Created by <span class="font-medium">{eventIdea.creatorId}</span> on
				<span class="font-medium">
					{new Date(eventIdea.creationDate).toLocaleDateString()}
				</span>
			</p>
			<p class="text-sm text-gray-500">
				Voting: {calcRemainingVotingDays(eventIdea.creationDate)} Tag(e) übrig
			</p>
		</div>

		<!-- Description -->
		<div class="bg-gray-100 p-4 rounded-lg shadow-md space-y-2">
			<h3 class="text-lg font-bold text-center">Beschreibung</h3>
			<p class="text-center text-gray-600">{eventIdea.description}</p>
		</div>

		<!-- Time of Day -->
		<div class="bg-gray-100 p-4 rounded-lg shadow-md space-y-2">
			<h3 class="text-lg font-bold text-center">Tageszeit</h3>
			<p class="text-center text-gray-600">
				{localizations.de.timeOfDayConstraint[eventIdea.timeOfDay]}
				{localizations.emoticon.timeOfDayConstraint[eventIdea.timeOfDay]}
			</p>
			<p class="text-center text-gray-600">
				({timeOfDayConstraint[eventIdea.timeOfDay].min.toLocaleTimeString('default', {
					hour: '2-digit',
					minute: '2-digit'
				})} - {timeOfDayConstraint[eventIdea.timeOfDay].max.toLocaleTimeString('default', {
					hour: '2-digit',
					minute: '2-digit'
				})})
			</p>
		</div>

		<!-- Group Size -->
		<div class="bg-gray-100 p-4 rounded-lg shadow-md space-y-2">
			<h3 class="text-lg font-bold text-center">Besucherzahl</h3>
			<p class="text-center text-gray-600">
				{localizations.de.groupSizeConstraint[eventIdea.groupSize]}
				{localizations.emoticon.groupSizeConstraint[eventIdea.groupSize]}
			</p>
			<p class="text-center text-gray-600">
				({groupSizeConstraint[eventIdea.groupSize].min} P. -
				{groupSizeConstraint[eventIdea.groupSize].max} P.)
			</p>
		</div>

		<!-- Price -->
		<div class="bg-gray-100 p-4 rounded-lg shadow-md space-y-2">
			<h3 class="text-lg font-bold text-center">Preis</h3>
			<p class="text-center text-gray-600">
				{localizations.de.priceConstraint[eventIdea.price]}
				{localizations.emoticon.priceConstraint[eventIdea.price]}
			</p>
			<p class="text-center text-gray-600">
				({priceConstraint[eventIdea.price].min}€ -
				{priceConstraint[eventIdea.price].max}€)
			</p>
		</div>

		<!-- Date Range -->
		<div class="bg-gray-100 p-4 rounded-lg shadow-md space-y-2">
			<h3 class="text-lg font-bold text-center">Datumszeitraum</h3>
			<p class="text-center text-gray-600">
				{Intl.DateTimeFormat('default', {
					month: 'long'
				}).format(eventIdea.dateRange.minDate)}
				-<br />
				{Intl.DateTimeFormat('default', {
					month: 'long'
				}).format(eventIdea.dateRange.maxDate)}
			</p>
		</div>

		<!-- Location -->
		<div class="bg-gray-100 p-4 rounded-lg shadow-md space-y-2">
			<h3 class="text-lg font-bold text-center">Ort</h3>
			<MapLibre
				style="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
				class="w-full h-80"
				bind:mapContainer
				bind:map
				bind:zoom={mapZoomLevel}
				center={eventIdea.locationCoordinates}
				on:load={() => {
					const circleGeoJSON = createGeoJSONCircle(
						eventIdea.locationCoordinates[0],
						eventIdea.locationCoordinates[1],
						locationRadiusConstraint[eventIdea.locationRadius].max
					);
					//console.log(circleGeoJSON);
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
					console.log('Map loaded.');
				}}
			>
				<DefaultMarker lngLat={eventIdea.locationCoordinates} />
			</MapLibre>
			<p class="text-center text-gray-600">{eventIdea.locationName}</p>
			<p class="text-center text-sm text-gray-500">
				Radius: {localizations.de.locationRadiusConstraint[eventIdea.locationRadius]} bis {locationRadiusConstraint[
					eventIdea.locationRadius
				].max} m
			</p>
		</div>
	</main>

	<footer id="footer" class="h-20 w-full flex items-center justify-center">
		<button
			class="w-full h-full text-2xl bg-orange-400 text-white font-bold"
			onclick={navigateHome}
		>
			Zurück
		</button>
	</footer>
</div>
