<script lang="ts">
	let { data } = $props();
	let eventIdea = $state(data.eventIdea);
</script>

<div>
	{eventIdea.title}
</div>
