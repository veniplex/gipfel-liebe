<script lang="ts">
	import { page } from "$app/state";

	const crumbs = $derived.by(() => {
		const path = page.url.pathname;
		const segments = path.split("/").filter(Boolean);
		const result = [{ title: "Home", url: "/" }];

		let currentPath = "";
		for (const segment of segments) {
			currentPath += `/${segment}`;
			const title = segment
				.split("-")
				.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
				.join(" ");
			result.push({ title, url: currentPath });
		}

		return result;
	});
</script>

<div class="breadcrumbs">
	<ul>
		{#each crumbs as crumb (crumb.url)}
			<li class="font-semibold text-primary-content/75">
				<a href={crumb.url}>
					{crumb.title}
				</a>
			</li>
		{/each}
	</ul>
</div>
