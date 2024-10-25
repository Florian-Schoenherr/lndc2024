<script lang="ts">
	import { Heart } from 'lucide-svelte';
	let { likes } = $props();
</script>

<h5
	class="mb-2 flex items-center gap-1 text-2xl font-bold tracking-tight text-green-400 dark:text-white"
>
	{likes}
	<Heart color="green" fill="green" />
</h5>
