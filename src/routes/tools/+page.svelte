<!-- Tools Overview -->

<script lang="ts">
	import IconMoney from "~icons/solar/wallet-money-outline";
	import ToolCard from "$lib/components/ToolCard.svelte";
</script>

<!-- Container -->
<div class="flex flex-col gap-8">
	<!-- Header -->
	<div class="flex flex-col items-center gap-2 py-8">
		<h1>Tools</h1>
		<h2>Find tools that help you and your loved ones to manage your live.</h2>
	</div>

	<!-- Tool Cards -->
	<div class="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
		<ToolCard name="Summit Split" description="Fair splits based on income, not arguments." link="/tools/summit-split" icon={IconMoney} />
		<!-- Placeholder -->
		<ToolCard placeholder />
	</div>
</div>
