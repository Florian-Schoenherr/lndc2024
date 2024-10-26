<script lang="ts">
	import Card from '$lib/Card.svelte';
	import { Card as FlowCard } from 'flowbite-svelte';

	let { data } = $props();
	let { priceCents, location } = $state(data.eventIdea);
</script>

<Card idea={data.eventIdea}>
	<FlowCard>
		Price:
		<!-- {Math.floor(priceCents / 100)},{priceCents % 100}€ -->
		{(priceCents / 100).toLocaleString('de', { style: 'currency', currency: 'EUR' })}
	</FlowCard>
	<FlowCard>
		Location:
		{location.toString()}
	</FlowCard>
	<FlowCard>
		Time:
		{'todo'}
	</FlowCard>
	<FlowCard>
		Date:
		{'todo'}
	</FlowCard>
</Card>
