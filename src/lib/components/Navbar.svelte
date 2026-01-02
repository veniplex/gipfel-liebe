<!-- Navbar -->

<script lang="ts">
	import Breadcrumbs from "./Breadcrumbs.svelte";
	import icon from "$lib/assets/favicon.svg";
</script>

<div class="grid items-center justify-center md:grid-cols-3">
	<div class="flex items-center justify-center gap-2 md:justify-start">
		<!-- Logo -->
		<img src={icon} alt="Gipfel Liebe Icon" class="w-10 md:w-12 lg:w-14" />

		<!-- Heading -->
		<a href="/" class="text-xl font-bold tracking-tighter uppercase md:text-2xl lg:text-3xl">
			Gipfel <span class="text-red-600 dark:text-red-500">Liebe</span>
		</a>
	</div>

	<!-- Breadcrumbs -->
	<div class="flex justify-center">
		<Breadcrumbs />
	</div>
</div>
