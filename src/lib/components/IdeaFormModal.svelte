<script lang="ts">
	import MapDieKarte from '$lib/components/SelectLocationMapModal.svelte';
	import { iconRanges } from '$lib/data/data';
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
	import { onMount } from 'svelte';

	let { isOpen = $bindable() } = $props();

	let mapModal = $state(false);
	let isDropdownVisible = $state(false);
	let location: null | { lngLat: LngLatLike; town: string } = $state(null);

	let iconSelection: string[] = $state([]);
	let minMonthSelection: Date[] = $state([]);
	let maxMonthSelection: Date[] = $state([]);

	let radiusConstraintSelection: number | null = $state();

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

	function updateIconInput(event: MouseEvent & { currentTarget: EventTarget & HTMLOptionElement }) {
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

	function getIconSelectionOptions(): string[] {
		let iconSelectionOptions: string[] = [];
		iconRanges.forEach((range) => {
			for (let codePoint = range[0]; codePoint <= range[1]; codePoint++) {
				const icon = String.fromCodePoint(codePoint);
				iconSelectionOptions.push(icon);
			}
		});
		return iconSelectionOptions;
	}

	function getMonthOptions(minMonthIndex: number, maxMonthIndex: number): Date[] {
		let monthOptions: Date[] = [];
		if (minMonthIndex < 1) {
			minMonthIndex = 1;
		}
		if (maxMonthIndex > 12) {
			maxMonthIndex = 12;
		}

		for (let index = minMonthIndex - 1; index < maxMonthIndex; index++) {
			const monthRepresentation = new Date();
			monthRepresentation.setMonth(index);
			monthOptions.push(monthRepresentation);
		}
		return monthOptions;
	}

	function updateDateRangeInput(event: Event & { currentTarget: EventTarget & HTMLSelectElement }) {
		let selectedMonth = new Date(event.currentTarget.value);
		//console.log(selectedMonth);

		if (selectedMonth) {
			maxMonthSelection = getMonthOptions(selectedMonth.getMonth() + 1, 12);
		}
	}

	// Handle form submission
	async function handleSubmit(event: SubmitEvent) {
		event.preventDefault(); // Prevent page reload
		const formData = new FormData(event.target as HTMLFormElement);
		try {
			const response = await fetch('/api/ideas', {
				method: 'POST',
				body: formData
			});

			if (response.ok) {
				const data = await response.json();
				// Update the UI based on the response
				console.log('Idea form submitted successfully', data);
				closeForm();
			} else {
				console.error('Failed to submit idea form', await response.text());
			}
		} catch (error) {
			console.error('Error submitting idea form', error);
		}
	}

	function saveRadiusSelection(
		event: MouseEvent & { currentTarget: EventTarget & HTMLOptionElement }
	) {
		radiusConstraintSelection = Number(event.currentTarget.value);
	}

	//Called when component is initialized
	onMount(() => {
		iconSelection = getIconSelectionOptions();
		minMonthSelection = getMonthOptions(1, 12);
		maxMonthSelection = getMonthOptions(1, 12);
	});
</script>

{#if isOpen}
	<div id="modalContainer" class="flex flex-col h-full w-full fixed top-0 left-0 bg-white p-5">
		<div id="titleBar" class="w-full mb-3 flex flex-row justify-between">
			<h1 class="text-2xl font-bold text-gray-600">Idee einreichen</h1>

			<button onclick={closeForm} class="text-l font-bold text-gray-500"> X </button>
		</div>
		<form
			id="ideaForm"
			onsubmit={handleSubmit}
			class="w-full h-full flex-grow flex flex-col space-y-6 overflow-y-scroll overflow-x-hidden bg-white"
		>
			<div class="space-y-1">
				<label for="icon" class="block text-sm font-medium text-gray-700">Ideen-Icon</label>
				<select
					name="icon"
					id="icon"
					class="mt-1 w-20 rounded-md border-gray-300 shadow-sm shadow-lg rounded mt-2 py-2 z-10 max-h-40 overflow-y-scroll"
					required
				>
					{#each iconSelection as emoticon}
						<option class="block px-4 py-2 text-black hover:bg-gray-200">
							{emoticon.toString()}
						</option>
					{/each}
				</select>
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
				<label for="description" class="block text-sm font-medium text-gray-700">Beschreibung</label
				>
				<textarea
					id="description"
					name="description"
					placeholder="Lass uns etwas unternehmen !"
					required
					class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
				></textarea>
			</div>

			<fieldset id="dateRange">
				<label for="dateRange" class="block text-sm font-medium text-gray-700"
					>Wunsch-Zeitraum wählen</label
				>

				<div class="space-y-2">
					<label for="minDate" class="block text-sm font-medium text-gray-700">Von</label>
					<select
						id="minDate"
						name="minDate"
						required
						class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
						oninput={updateDateRangeInput}
					>
						{#each minMonthSelection as monthOption}
							<option value={monthOption}
								>{Intl.DateTimeFormat('default', {
									month: 'long'
								}).format(monthOption)}</option
							>
						{/each}
					</select>
				</div>

				<label for="maxDate" class="block text-sm font-medium text-gray-700">Bis</label>
				<select
					id="maxDate"
					name="maxDate"
					required
					class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
				>
					{#each maxMonthSelection as monthOption}
						<option value={monthOption}
							>{Intl.DateTimeFormat('default', {
								month: 'long'
							}).format(monthOption)}</option
						>
					{/each}
				</select>
			</fieldset>

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
						<option {value} onclick={saveRadiusSelection}
							>{localizations.de.locationRadiusConstraint[value]} (bis {locationRadiusConstraint[
								value
							].max} m )</option
						>
					{/each}
				</select>
			</div>

			{#if radiusConstraintSelection}
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
			{/if}

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
				<label for="timeOfDay" class="block text-sm font-medium text-gray-700"
					>Bevorzugte Tageszeit</label
				>
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
							].min.toLocaleTimeString('default', { hour: '2-digit', minute: '2-digit' })} - {timeOfDayConstraint[
								value
							].max.toLocaleTimeString('default', {
								hour: '2-digit',
								minute: '2-digit'
							})})</option
						>
					{/each}
				</select>
			</div>
		</form>
		<input
			form="ideaForm"
			type="submit"
			class="w-full py-2 px-4 bg-orange-400 text-white font-semibold rounded-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
			value="Einreichen"
		/>
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
			maxRadius={locationRadiusConstraint[radiusConstraintSelection].max}
		/>
	</div>
{/if}

<style>
</style>
