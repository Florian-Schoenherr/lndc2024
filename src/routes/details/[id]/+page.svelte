<script lang="ts">
	let { data } = $props();
	let { priceCents, description, title, townPrecomputed, location, visitorAmount } = $state(
		data.eventIdea
	);
</script>

<div>
	<div class="w-full">
		{title}
	</div>

	<div class="w-full">
		Price:
		<!-- {Math.floor(priceCents / 100)},{priceCents % 100}€ -->
		{(priceCents / 100).toLocaleString('de', { style: 'currency', currency: 'EUR' })}
	</div>

	<div class="w-full">
		{description}
	</div>

	<div class="w-full">
		{townPrecomputed}
	</div>

	<div class="w-full">
		{location}
	</div>

	<div class="w-full">
		{visitorAmount}
	</div>
</div>
