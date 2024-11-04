<script lang="ts">
	import MapDieKarte from '$lib/components/SelectLocationMapModal.svelte';
	import { emojiRanges } from '$lib/data/data';
	import {
		GroupSizeOption,
		localizations,
		LocationRadiusOption,
		PriceOption,
		TimeOfDayOption,
		priceConstraint,
		groupSizeConstraint,
		locationRadiusConstraint,
		timeOfDayConstraint
	} from '$lib/types';

	import type { LngLatLike } from 'maplibre-gl';
	import { onMount, tick } from 'svelte';

	let { size, isOpen = $bindable() } = $props();

	let mapModal = $state(false);
	let isDropdownVisible = $state(false);
	let location: null | { lngLat: LngLatLike; town: string } = $state(null);

	let emojiSelection: string[] = [];

	function closeForm() {
		isOpen = false;
	}

	function openMap() {
		mapModal = true;
	}

	/* When the user clicks on the button,
	toggle between hiding and showing the dropdown content */
	function toggleDropdownVisbility() {
		isDropdownVisible = !isDropdownVisible;
	}

	function updateIconInput(event: MouseEvent & { currentTarget: EventTarget & HTMLDivElement }) {
		let iconInput = document.getElementById('icon');

		if (iconInput) {
			let inputChar = event.currentTarget.textContent;
			iconInput.value = inputChar;
			toggleDropdownVisbility();
		}
	}

	// Helper function to convert enum to array
	function enumToArray<T>(enumObj: T): Array<{ value: string; label: string }> {
		return Object.keys(enumObj)
			.filter((key) => isNaN(Number(key))) // Filter out numeric keys
			.map((key) => ({
				value: enumObj[key as keyof T],
				label: key
			}));
	}

	// Function to iterate through the ranges
	function fillEmojiSelection() {
		emojiRanges.forEach((range) => {
			for (let codePoint = range[0]; codePoint <= range[1]; codePoint++) {
				const emoji = String.fromCodePoint(codePoint);
				emojiSelection.push(emoji);
			}
		});
		console.log(emojiSelection);
	}

	//Called when component is initialized
	onMount(() => {
		fillEmojiSelection();
	});
</script>

{#if isOpen}
	<div
		id="ideaModal"
		tabindex="-1"
		class="overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-10 justify-center items-center md:inset-0 h-[calc(100%-1rem)] p-4 w-full max-h-full bg-white rounded-lg shadow dark:bg-gray-700"
	>
		<div class="relative h-5/6">
			<div
				class="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600"
			>
				<h3 class="text-xl font-semibold text-gray-900 dark:text-white">Idee einreichen</h3>
				<button
					type="button"
					class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
					onclick={closeForm}
				>
					<svg
						class="w-3 h-3"
						aria-hidden="true"
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 14 14"
					>
						<path
							stroke="currentColor"
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
						/>
					</svg>
					<span class="sr-only">Close modal</span>
				</button>
			</div>

			<form
				id="ideaForm"
				action="?/submitIdea"
				method="POST"
				class="flex h-5/6 flex-col space-y-6 overflow-y-scroll overflow-x-hidden"
			>
				<div class="space-y-1">
					<label for="icon" class="block text-sm font-medium text-gray-700">Vorschaubild</label>
					<input
						type="text"
						name="icon"
						id="icon"
						value="😎"
						required
						maxlength="1"
						class="mt-1 w-12 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
					/>
					<div class="relative inline-block">
						<button
							onclick={toggleDropdownVisbility}
							class="bg-orange-400 text-white py-2 px-4 rounded focus:outline-none focus:bg-orange-600"
							>Auswahl</button
						>
						{#if isDropdownVisible}
							<div
								id="emoticonDropdown"
								class="absolute bg-gray-100 shadow-lg rounded mt-2 py-2 w-100 z-10 max-h-40 overflow-y-scroll"
							>
								{#each emojiSelection as emoticon}
									<div
										onclick={updateIconInput}
										class="block px-4 py-2 text-black hover:bg-gray-200"
									>
										{emoticon.toString()}
									</div>
								{/each}
							</div>
						{/if}
					</div>
				</div>

				<div class="space-y-1">
					<label for="title" class="block text-sm font-medium text-gray-700">Thema</label>
					<input
						type="text"
						id="title"
						name="title"
						placeholder="Your Event"
						required
						class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
					/>
				</div>

				<div class="space-y-2">
					<label for="description" class="block text-sm font-medium text-gray-700"
						>Description</label
					>
					<textarea
						id="description"
						name="description"
						placeholder="Lets meet up together!"
						required
						class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
					></textarea>
				</div>

				<div>
					<label class="block text-sm font-medium text-gray-700">Zeitraum wählen</label>
					<fieldset class="space-y-2">
						<div class="space-y-2">
							<label for="startDate" class="block text-sm font-medium text-gray-700">Von</label>
							<input
								type="date"
								id="startDate"
								name="startDate"
								required
								class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
							/>
							<input
								type="time"
								id="startTime"
								name="startTime"
								required
								class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
							/>
						</div>
						<div class="space-y-2">
							<label for="endDate" class="block text-sm font-medium text-gray-700">Bis</label>
							<input
								type="date"
								id="endDate"
								name="endDate"
								required
								class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
							/>
							<input
								type="time"
								id="endTime"
								name="endTime"
								required
								class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
							/>
						</div>
					</fieldset>
				</div>

				<!-- Price Category -->
				<div class="space-y-2">
					<label for="price" class="block text-sm font-medium text-gray-700">Preis in €</label>
					<select
						id="price"
						name="price"
						required
						class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
					>
						{#each enumToArray(PriceOption) as { value, label }}
							<option {value}
								>{localizations.de.priceConstraint[value]} ({priceConstraint[value].min} € - {priceConstraint[
									value
								].max} €)</option
							>
						{/each}
					</select>
				</div>

				<div class="space-y-2">
					<label for="town" class="block text-sm font-medium text-gray-700">Ort</label>
					<input
						type="text"
						id="town"
						name="town"
						readonly
						required
						value={location?.town}
						class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
						onclick={openMap}
					/>
					<input type="hidden" name="latitude" value={location?.lngLat.lat} />
					<input type="hidden" name="longitude" value={location?.lngLat.lng} />
				</div>

				<div class="space-y-2">
					<label for="visitorAmount" class="block text-sm font-medium text-gray-700"
						>Besucherzahl</label
					>
					<select
						id="groupSize"
						name="groupSize"
						required
						class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
					>
						{#each enumToArray(GroupSizeOption) as { value, label }}
							<option {value}
								>{localizations.de.groupSizeConstraint[value]} ({groupSizeConstraint[value].min} - {groupSizeConstraint[
									value
								].max})</option
							>
						{/each}
					</select>
				</div>

				<div class="space-y-2">
					<label for="locationRadius" class="block text-sm font-medium text-gray-700"
						>Radius wählen</label
					>
					<select
						id="locationRadius"
						name="locationRadius"
						required
						class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
					>
						{#each enumToArray(LocationRadiusOption) as { value, label }}
							<option {value}
								>{localizations.de.locationRadiusConstraint[value]} (bis {locationRadiusConstraint[
									value
								].max} m )</option
							>
						{/each}
					</select>
				</div>

				<div class="space-y-2">
					<label class="block text-sm font-medium text-gray-700">Bevorzugte Tageszeit</label>
					<select
						id="timeOfDay"
						name="timeOfDay"
						required
						class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
					>
						{#each enumToArray(TimeOfDayOption) as { value, label }}
							<option {value}
								>{localizations.de.timeOfDayConstraint[value]} ({timeOfDayConstraint[
									value
								].min.toLocaleTimeString()} - {timeOfDayConstraint[
									value
								].max.toLocaleTimeString()})</option
							>
						{/each}
					</select>
				</div>

				<div class="mt-4">
					<button
						type="submit"
						class="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
						>Einreichen</button
					>
				</div>
			</form>
		</div>
	</div>
{/if}

{#if mapModal}
	<div class="fixed top-0 left-0 w-full h-full z-20">
		<MapDieKarte
			saveLocation={async (lngLat: LngLatLike) => {
				let apiRequestURL = `https://nominatim.openstreetmap.org/reverse?format=geojson&lat=${lngLat.lat}&lon=${lngLat.lng}`;
				console.log('Fetching location from ' + apiRequestURL);

				let response = await fetch(apiRequestURL);
				let responseJSON = await response.json();
				let town = responseJSON.features[0].properties.address.town;

				// ACHTUNG: MAX 1 MAL PRO SEKUNDE ERLAUBT (brauchen ne andere Lösung):

				if (town) {
					location = { lngLat, town };
					mapModal = false;
					(document.querySelector('input[name="town"]') as HTMLInputElement).scrollIntoView();
				} else {
					alert(`Stadt zu Koordinaten ${lngLat} nicht gefunden. \n Bitte erneut auswählen.`);
				}
			}}
		/>
	</div>
{/if}

<style>
</style>
