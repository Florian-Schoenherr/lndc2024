<script lang="ts">
	import Card from '$lib/Card.svelte';
	import MapDieKarte from '$lib/MapDieKarte.svelte';
	import Portal from '$lib/Portal.svelte';
	import { Button, Modal, Label, Input, Textarea } from 'flowbite-svelte';
	import { Locate, MapPin } from 'lucide-svelte';
	import type { LngLatLike } from 'maplibre-gl';
	import { tick } from 'svelte';

	let { data } = $props();
	let eventIdeas = $state(data.eventIdeas);
	let formModal = $state(false);

	interface FormField {
		name: string;
		value: string;
		required: boolean;
	}

	function submitForm(event: Event) {
		event.preventDefault(); // Prevent the default form submission
		let formIsValid = true;

		const formData: { [key: string]: string } = {};

		const fields: FormField[] = [
			{
				name: 'iconSelect',
				value: (document.querySelector('input[name="iconSelect"]:checked') as HTMLInputElement)
					.value,
				required: true
			},
			{
				name: 'title',
				value: (document.querySelector('input[name="title"]') as HTMLInputElement).value,
				required: true
			},
			{
				name: 'details',
				value: (document.querySelector('textarea[name="details"]') as HTMLInputElement).value,
				required: true
			},
			{
				name: 'startDate',
				value: (document.querySelector('input[name="startDate"]') as HTMLInputElement).value,
				required: true
			},
			{
				name: 'startTime',
				value: (document.querySelector('input[name="startTime"]') as HTMLInputElement).value,
				required: true
			},
			{
				name: 'endDate',
				value: (document.querySelector('input[name="endDate"]') as HTMLInputElement).value,
				required: true
			},
			{
				name: 'endTime',
				value: (document.querySelector('input[name="endTime"]') as HTMLInputElement).value,
				required: true
			},
			{
				name: 'price',
				value: (document.querySelector('input[name="price"]') as HTMLInputElement).value,
				required: true
			},
			{
				name: 'location',
				value: (document.querySelector('input[name="location"]') as HTMLInputElement).value,
				required: true
			},
			{
				name: 'visitorAmount',
				value: (document.querySelector('input[name="visitorAmount"]') as HTMLInputElement).value,
				required: true
			}
		];

		for (const field of fields) {
			console.dir(field);
			if (field.required && !field.value) {
				formIsValid = false;
				break;
			}
			formData[field.name] = field.value;
		}

		if (formIsValid) {
			// Close the modal
			formModal = false;

			eventIdeas.push({
				id: '3',
				title: formData['title'],
				description: formData['details'],
				icon: formData['icons'],
				likes: 0,
				location: location!.lngLat,
				townPrecomputed: location!.town,
				date: new Date(2022, 5, 12, 14, 30, 0),
				visitorAmount: Number(formData['visitorAmount']),
				priceCents: Number(formData['visitorAmount']),
				creator: 'user'
			});
			// TODO: call action in +page.server.ts
		} else {
			console.log('Please fill out all required fields.');
		}
	}

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
	<Card {idea} link />
{/each}

<Button class="fixed bottom-0 z-1 w-full h-14 text-2xl" on:click={() => (formModal = true)}
	>Idee einreichen</Button
>

<Modal bind:open={formModal} size="xs" class="w-full">
	<form class="flex flex-col space-y-6 h-160" action="#">
		<h3 class="mb-4 text-xl font-medium text-gray-900 dark:text-white">Idee einreichen</h3>

		<Label class="space-y-1">
			<span>Icon</span>
			<fieldset class="flex gap-2">
				<label for="trophyRadioButton">
					<input type="radio" id="trophyRadioButton" name="iconSelect" value="Trophy" checked />
					Trophy
				</label>

				<label for="ballRadioBtn">
					<input type="radio" id="ballRadioBtn" name="iconSelect" value="Ball" />
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
			<Input
				type="text"
				name="location"
				readonly
				required
				on:click={openMap}
				value={location?.town}
			>
				<svelte:fragment slot="left">
					<!-- <Locate /> -->
					<MapPin />
				</svelte:fragment>
			</Input>
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
			<Button on:click={submitForm} type="submit" class="w-2/5 inline-block">Absenden</Button>
		</div>
	</form>
</Modal>
<!-- {/if} -->
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
				(document.querySelector('input[name="location"]') as HTMLInputElement).scrollIntoView();
			}}
		/>
	</Portal>
{/if}
