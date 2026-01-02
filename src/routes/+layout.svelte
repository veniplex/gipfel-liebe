<!-- Main Layout -->

<script lang="ts">
	import "./layout.css";
	import { page } from "$app/state";
	import favicon from "$lib/assets/favicon.svg";
	import Navbar from "$lib/components/Navbar.svelte";

	let { children } = $props();
	let isHomeRoute = $derived(page.url.pathname === "/");
</script>

<svelte:head>
	<title>{import.meta.env.VITE_APP_NAME}</title>
	<link rel="icon" href={favicon} />
</svelte:head>

<div class="container mx-auto flex min-h-screen flex-col p-4">
	{#if !isHomeRoute}
		<Navbar />
	{/if}
	{@render children()}
</div>
