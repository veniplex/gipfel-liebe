<!-- Tool Card -->

<script lang="ts">
	import IconMountain from "~icons/mynaui/mountain-snow";
	import IconArrowRight from "~icons/formkit/arrowright";
	let { icon: Icon = IconMountain, ...props } = $props();
</script>

<a href={props.link}>
	<div
		class="group card h-28 justify-center text-primary-content transition-all card-lg sm:h-32 lg:h-36 xl:h-40 {props.placeholder
			? 'border-3 border-dashed bg-base-300 opacity-50'
			: 'border-secondary bg-primary hover:scale-102 hover:border-3'}"
	>
		<div class="card-body">
			<div class="flex h-full items-center gap-2">
				<Icon class="size-14 md:size-18 lg:size-20" />
				<div>
					<h2 class="card-title">
						{#if props.name}
							{props.name}
						{:else}
							Future Summits
						{/if}
					</h2>
					<p class="text-primary-content/80">
						{#if props.description}
							{props.description}
						{:else}
							We are still climbing...
						{/if}
					</p>
				</div>
			</div>
			{#if !props.placeholder}
				<span class="absolute right-4 bottom-2 hidden text-sm group-hover:inline">Open <IconArrowRight class="inline size-5" /></span>
			{/if}
		</div>
	</div>
</a>
