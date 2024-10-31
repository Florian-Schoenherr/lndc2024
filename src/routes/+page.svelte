<script lang="ts">
	import Card from '$lib/Card.svelte';
	import MapDieKarte from '$lib/MapDieKarte.svelte';
	import Portal from '$lib/Portal.svelte';
	import { Button, Modal, Label, Input, Textarea } from 'flowbite-svelte';
	import { Locate, MapPin } from 'lucide-svelte';
	import type { LngLatLike } from 'maplibre-gl';
	import { onMount, tick } from 'svelte';

	let { data } = $props();
	let eventIdeas = $state(data.eventIdeas);
	let formModal = $state(false);

	function closeForm() {
		formModal = false;
	}

	let mapModal = $state(false);
	let location: null | { lngLat: LngLatLike; town: string } = $state(null);

	function openMap() {
		mapModal = true;
	}
</script>

<!-- {#if !mapModal} -->

{#each eventIdeas as idea}
	<Card {idea} link isLikedbyUser={data.likedEventIds.includes(idea.id)} userID={data.clientId} />
{/each}

<Button class="fixed bottom-0 z-1 w-full h-14 text-2xl" on:click={() => (formModal = true)}
	>Idee einreichen
</Button>

<Modal bind:open={formModal} size="xs" class="w-full">
	<form class="flex flex-col space-y-6 h-160" action="?/submitIdea" method="POST">
		<h3 class="mb-4 text-xl font-medium text-gray-900 dark:text-white">Idee einreichen</h3>

		<Label class="space-y-1">
			<span>Icon</span>
			<fieldset class="flex gap-2">
				<label for="trophyRadioButton">
					<input type="radio" id="trophyRadioButton" name="icon" value="trophy" checked />
					Trophy
				</label>

				<label for="ballRadioBtn">
					<input type="radio" id="ballRadioBtn" name="icon" value="volleyball" />
					Ball
				</label>
			</fieldset>
		</Label>

		<Label class="space-y-1">
			<span>Thema</span>
			<Input type="text" name="title" placeholder="Your Event" required />
		</Label>

		<Label class="space-y-2">
			<span>Details</span>
			<Textarea name="details" placeholder="Lets meet up together !" required />
		</Label>

		<Label>
			<span>Zeitraum wählen</span>
			<fieldset>
				<Label class="space-y-2">
					<span>Von</span>
					<Input type="date" name="startDate" required />
					<Input type="time" name="startTime" required />
				</Label>

				<Label class="space-y-2">
					<span>Bis</span>
					<Input type="date" name="endDate" required />
					<Input type="time" name="endTime" required />
				</Label>
			</fieldset>
		</Label>

		<Label class="space-y-2">
			<span>Preis in €</span>
			<Input type="number" name="price" placeholder="10" min="1" max="1000" step="any" required />
		</Label>

		<Label class="space-y-2">
			<span>Ort</span>
			<Input type="text" name="town" readonly required on:click={openMap} value={location?.town}>
				<svelte:fragment slot="left">
					<!-- <Locate /> -->
					<MapPin />
				</svelte:fragment>
			</Input>
			<Input type="hidden" name="latitude" value={location?.lngLat.lat}></Input>
			<Input type="hidden" name="longitude" value={location?.lngLat.lng}></Input>
		</Label>

		<Label class="space-y-2">
			<span>Besucherzahl</span>
			<Input
				type="number"
				name="visitorAmount"
				placeholder="5"
				min="1"
				max="1000"
				step="any"
				required
			/>
		</Label>
		<div class="flex row gap-5 w-full justify-evenly">
			<Button on:click={closeForm} color="alternative" class="w-2/5 inline-block">Zurück</Button>
			<Button type="submit" class="w-2/5 inline-block">Absenden</Button>
		</div>
	</form>
</Modal>

{#if mapModal}
	<Portal>
		<MapDieKarte
			saveLocation={async (lngLat: LngLatLike) => {
				// ACHTUNG: MAX 1 MAL PRO SEKUNDE ERLAUBT (brauchen ne andere Lösung):
				let response = await fetch(
					`https://nominatim.openstreetmap.org/reverse?format=geojson&lat=${lngLat.lat}&lon=${lngLat.lng}`
				);
				let locatedObject = await response.json();
				let town = locatedObject.features[0].properties.address.town;
				console.log(town);

				location = { lngLat, town };
				mapModal = false;
				// the hackiest shit code I ever wrote probably
				await tick();
				(document.querySelector('input[name="town"]') as HTMLInputElement).scrollIntoView();
			}}
		/>
	</Portal>
{/if}
