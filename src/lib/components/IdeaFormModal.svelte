<script lang="ts">
	import MapDieKarte from '$lib/components/SelectLocationMapModal.svelte';
	import { emojiRanges } from '$lib/data/data';

	import { Locate, MapPin } from 'lucide-svelte';
	import type { LngLatLike } from 'maplibre-gl';
	import { onMount, tick } from 'svelte';
	import { on } from 'svelte/events';

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
	<!-- Main modal -->
	<div
		id="ideaModal"
		tabindex="-1"
		class="overflow-y-auto overflow-x-hidden fixed top-0 right-0
        left-0 z-10 justify-center
        items-center
        md:inset-0 h-[calc(100%-1rem)]
        p-4 w-full max-h-full bg-white rounded-lg shadow dark:bg-gray-700"
	>
		<!-- Modal content -->

		<div class="relative h-5/6">
			<!-- Modal header -->
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

			<!-- Modal body -->
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

					<!-- Dropdown component -->
					<div class="relative inline-block">
						<button
							onclick={toggleDropdownVisbility}
							class="bg-orange-400 text-white py-2 px-4 rounded focus:outline-none focus:bg-orange-600"
						>
							Auswahl
						</button>
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
					<label for="details" class="block text-sm font-medium text-gray-700">Details</label>
					<textarea
						id="details"
						name="details"
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

				<div class="space-y-2">
					<label for="price" class="block text-sm font-medium text-gray-700">Preis in €</label>
					<input
						type="number"
						id="price"
						name="price"
						placeholder="10"
						min="1"
						max="1000"
						step="any"
						required
						class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
					/>
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
					<input
						type="number"
						id="visitorAmount"
						name="visitorAmount"
						placeholder="5"
						min="1"
						max="1000"
						step="any"
						required
						class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
					/>
				</div>
			</form>
		</div>

		<!-- Modal footer -->
		<div
			class="fixed bottom-0 left-0 right-0 w-full flex align-middle justify-evenly p-4 md:p-5 h-20 border-t border-gray-200 bg-white dark:bg-gray-800 rounded-b dark:border-gray-600"
		>
			<button
				type="button"
				onclick={closeForm()}
				class="w-2/5 ml-3 bg-gray-100 hover:bg-gray-300 focus:ring-4 focus:outline-none focus:bg-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
				>Zurück
			</button>
			<input
				type="submit"
				form="ideaForm"
				class=" w-2/5 ml-3 text-white bg-orange-400 hover:bg-orange-600 focus:ring-4 focus:outline-none focus:bg-orange-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-orange-600 dark:hover:bg-orange-700 dark:focus:bg-orange-800"
				value="Absenden"
			/>
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
	/* Dropdown Button */
	.dropbtn {
		background-color: #3498db;
		color: white;
		padding: 16px;
		font-size: 16px;
		border: none;
		cursor: pointer;
	}

	/* Dropdown button on hover & focus */
	.dropbtn:hover,
	.dropbtn:focus {
		background-color: #2980b9;
	}

	/* The container <div> - needed to position the dropdown content */
	.dropdown {
		position: relative;
		display: inline-block;
	}

	/* Dropdown Content (Hidden by Default) */
	.dropdown-content {
		display: block;
		position: absolute;
		background-color: #f1f1f1;
		min-width: 160px;
		box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
		z-index: 1;
	}

	/* Links inside the dropdown */
	.dropdown-content a {
		color: black;
		padding: 12px 16px;
		text-decoration: none;
		display: block;
	}
</style>
