<!-- Tool Homepage: Summit Split -->

<script lang="ts">
	import { SummitSplitState } from "./summit-split.svelte";
	import Chart from "chart.js/auto";

	import IconChart from "~icons/hugeicons/chart-03";
	import IconIncome from "~icons/healthicons/low-income-level";
	import IconExpenses from "~icons/healthicons/money-bag";
	import IconSavings from "~icons/clarity/savings-solid";
	import IconPlus from "~icons/mdi/plus";
	import IconDelete from "~icons/mdi/delete";
	import IconSettings from "~icons/weui/setting-filled";
	import IconAlert from "~icons/mdi/alert-circle-outline";
	import IconBalanceScale from "~icons/mdi/scale-balance";

	// Constants
	const CURRENCY_OPTIONS = [
		{ value: "EUR", language: "de-DE", symbol: "€", prefixed: false },
		{ value: "USD", language: "en-US", symbol: "$", prefixed: true },
		{ value: "GBP", language: "en-GB", symbol: "£", prefixed: true },
		{ value: "CHF", language: "de-CH", symbol: "₣", prefixed: true },
		{ value: "JPY", language: "ja-JP", symbol: "¥", prefixed: true },
		{ value: "CNY", language: "zh-CN", symbol: "¥", prefixed: true }
	];

	const COLOR_PRESETS = [
		"#3b82f6", // Blue
		"#ec4899", // Pink
		"#f97316", // Orange
		"#10b981", // Emerald
		"#ef4444", // Red
		"#f59e0b", // Amber
		"#84cc16", // Lime
		"#06b6d4", // Cyan
		"#6366f1", // Indigo
		"#8b5cf6" // Violet
	];

	// State Initialization
	const summitSplitState = new SummitSplitState();

	// Chart Canvases
	let incomeShareChartCanvas = $state<HTMLCanvasElement>();
	let incomeVsCostsChartCanvas = $state<HTMLCanvasElement>();
	let incomeSourcesChartCanvas = $state<HTMLCanvasElement>();
	let expensesChartCanvas = $state<HTMLCanvasElement>();
	let savingsChartCanvas = $state<HTMLCanvasElement>();

	let incomeShareChart: Chart;
	let incomeVsCostsChart: Chart;
	let incomeSourcesChart: Chart;
	let expensesChart: Chart;
	let savingsChart: Chart;

	let evaluationInterval = $state<"monthly" | "yearly">("monthly");
	const multiplier = $derived(evaluationInterval === "monthly" ? 1 : 12);

	// Derived values for chart updates
	let chartData = $derived({
		people: summitSplitState.people,
		incomes: summitSplitState.incomes,
		expenses: summitSplitState.expenses,
		savings: summitSplitState.savingsPots,
		currency: summitSplitState.settings.currency,
		interval: evaluationInterval
	});

	$effect(() => {
		// Trigger chart updates when data changes
		const _ = chartData;
		updateCharts();
	});

	function updateCharts() {
		// multiplier is now a derived state and used automatically

		// 1. Income Share (Pie)
		if (incomeShareChartCanvas) {
			const labels = summitSplitState.people.map((p) => p.name);
			const data = summitSplitState.people.map((p) => summitSplitState.getPersonIncome(p.id) * multiplier);
			const colors = summitSplitState.people.map((p) => p.color);
			const isEmpty = !summitSplitState.incomes.length;

			if (incomeShareChart) incomeShareChart.destroy();
			incomeShareChart = new Chart(incomeShareChartCanvas, {
				type: "pie",
				data: {
					labels: isEmpty ? ["No Income"] : labels,
					datasets: [{ data: isEmpty ? [1] : data, backgroundColor: isEmpty ? ["#e5e7eb"] : colors }]
				},
				options: {
					responsive: true,
					plugins: { title: { display: true, text: "Income Share per Person" }, legend: { position: "bottom" } }
				}
			});
		}

		// 2. Income vs Costs (Pie)
		if (incomeVsCostsChartCanvas) {
			const totalIncome = summitSplitState.totalIncome * multiplier;
			const totalCosts = summitSplitState.totalCosts * multiplier;
			const remaining = Math.max(0, totalIncome - totalCosts);

			if (incomeVsCostsChart) incomeVsCostsChart.destroy();
			incomeVsCostsChart = new Chart(incomeVsCostsChartCanvas, {
				type: "pie",
				data: {
					labels: ["Total Costs", "Remaining"],
					datasets: [{ data: [totalCosts, remaining], backgroundColor: ["#f87171", "#4ade80"] }]
				},
				options: {
					responsive: true,
					plugins: { title: { display: true, text: "Income vs. Total Costs (Expenses + Savings)" }, legend: { position: "bottom" } }
				}
			});
		}

		// 3. Income Sources (Donut)
		if (incomeSourcesChartCanvas) {
			const labels = summitSplitState.incomes.map((i) => i.name);
			const data = summitSplitState.incomes.map((i) => i.amount * multiplier);

			if (incomeSourcesChart) incomeSourcesChart.destroy();
			incomeSourcesChart = new Chart(incomeSourcesChartCanvas, {
				type: "doughnut",
				data: {
					labels: labels.length ? labels : ["No Sources"],
					datasets: [{ data: data.length ? data : [1], backgroundColor: ["#60a5fa", "#34d399", "#a78bfa", "#f472b6", "#fbbf24"] }]
				},
				options: {
					responsive: true,
					plugins: { title: { display: true, text: "Income Sources Breakdown" }, legend: { position: "bottom" } }
				}
			});
		}

		// 4. Expenses Breakdown (Donut)
		if (expensesChartCanvas) {
			const labels = summitSplitState.expenses.map((e) => e.name);
			const data = summitSplitState.expenses.map((e) => e.amount * multiplier);

			if (expensesChart) expensesChart.destroy();
			expensesChart = new Chart(expensesChartCanvas, {
				type: "doughnut",
				data: {
					labels: labels.length ? labels : ["No Expenses"],
					datasets: [{ data: data.length ? data : [1], backgroundColor: ["#f87171", "#fb923c", "#fbbf24", "#f472b6"] }]
				},
				options: {
					responsive: true,
					plugins: { title: { display: true, text: "Expenses Breakdown" }, legend: { position: "bottom" } }
				}
			});
		}

		// 5. Savings Breakdown (Donut)
		if (savingsChartCanvas) {
			const labels = summitSplitState.savingsPots.map((s) => s.name);
			const data = summitSplitState.savingsPots.map((s) => s.amount * multiplier);

			if (savingsChart) savingsChart.destroy();
			savingsChart = new Chart(savingsChartCanvas, {
				type: "doughnut",
				data: {
					labels: labels.length ? labels : ["No Savings"],
					datasets: [{ data: data.length ? data : [1], backgroundColor: ["#60a5fa", "#34d399", "#a78bfa", "#f472b6"] }]
				},
				options: {
					responsive: true,
					plugins: { title: { display: true, text: "Savings Breakdown" }, legend: { position: "bottom" } }
				}
			});
		}
	}

	function formatCurrency(amount: number) {
		const option = CURRENCY_OPTIONS.find((o) => o.value === summitSplitState.settings.currency);
		const language = option ? option.language : "en-US";
		return new Intl.NumberFormat(language, { style: "currency", currency: summitSplitState.settings.currency, minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(amount);
	}

	function roundUp(val: number): number {
		return Math.ceil(val * 100) / 100;
	}

	// New Entry State Placeholders
	let newPersonName = $state("");

	// Valid Tailwind colors (approximate hex for simplicity in storage)
	let newPersonColor = $state(COLOR_PRESETS[0]);

	// Update newPersonColor when the list of people changes
	$effect(() => {
		newPersonColor = COLOR_PRESETS[summitSplitState.people.length % COLOR_PRESETS.length];
	});

	// Separate state for new income per person to avoid shared binding
	let newIncomes = $state<Record<string, { name: string; amount: number }>>({});

	// Sync newIncomes state with people
	$effect(() => {
		for (const person of summitSplitState.people) {
			if (!newIncomes[person.id]) {
				newIncomes[person.id] = { name: "", amount: 0 };
			}
		}
	});

	function getNewIncomeState(personId: string) {
		return newIncomes[personId];
	}

	let newExpenseName = $state("");
	let newExpenseAmount = $state(0);

	let newPotName = $state("");

	// --- Delete Modal State ---
	let deleteModal = $state<HTMLDialogElement>();
	let itemToDelete = $state<{ type: "person" | "income" | "expense" | "pot"; id: string; name: string } | null>(null);

	function confirmDelete(type: "person" | "income" | "expense" | "pot", id: string, name: string) {
		itemToDelete = { type, id, name };
		deleteModal?.showModal();
	}

	function executeDelete() {
		if (!itemToDelete) return;

		switch (itemToDelete.type) {
			case "person":
				summitSplitState.removePerson(itemToDelete.id);
				break;
			case "income":
				summitSplitState.removeIncome(itemToDelete.id);
				break;
			case "expense":
				summitSplitState.removeExpense(itemToDelete.id);
				break;
			case "pot":
				summitSplitState.removeSavingsPot(itemToDelete.id);
				break;
		}

		deleteModal?.close();
		itemToDelete = null;
	}

	// Add Functions
	function addPerson() {
		if (!newPersonName) return;
		summitSplitState.addPerson(newPersonName, newPersonColor);
		newPersonName = "";
	}

	function addIncome(personId: string) {
		const state = getNewIncomeState(personId);
		if (!state.name || state.amount <= 0) return;
		summitSplitState.addIncome(state.name, state.amount, personId);
		state.name = "";
		state.amount = 0;
	}

	function addExpense() {
		if (!newExpenseName || newExpenseAmount <= 0) return;
		summitSplitState.addExpense(newExpenseName, newExpenseAmount);
		newExpenseName = "";
		newExpenseAmount = 0;
	}

	function addPot() {
		if (!newPotName) return;
		summitSplitState.addSavingsPot(newPotName, 0);
		newPotName = "";
	}

	// Sections state is now handled by summitSplitState.ui.sections

	// Savings Logic
	function getMaxPotAllocation(potId: string) {
		// Max allocation = (Current Net Available excluding this pot's current amount)
		const currentPot = summitSplitState.savingsPots.find((p) => p.id === potId);
		const currentAmount = currentPot ? currentPot.amount : 0;
		return Math.max(0, summitSplitState.remainingBalance + currentAmount);
	}
</script>

<div class="flex flex-col gap-4">
	<!-- Header -->
	<div class="flex flex-col items-center gap-2 py-8">
		<h1>Summit Split</h1>
		<h2 class="text-center">Calculate a fair monthly split of the cost with your partner and family.</h2>
	</div>

	<!-- 1. Household Settings -->
	<div class="collapse-arrow collapse border-2 border-base-300 bg-base-200">
		<!-- Checkbox for opening/closing the section -->
		<input type="checkbox" bind:checked={summitSplitState.ui.sections.settings} onchange={() => summitSplitState.save()} />

		<!-- Section title -->
		<div class="collapse-title flex items-center justify-between">
			<div class="flex items-center gap-2">
				<IconSettings class="inline size-6 md:size-8 lg:size-10" />
				<h3 class="font-bold">Household Settings</h3>
			</div>
			{#if !summitSplitState.ui.sections.settings}
				<h3 class="opacity-75">
					{summitSplitState.people.length} Members
				</h3>
			{/if}
		</div>

		<!-- Section content -->
		<div class="collapse-content">
			<!-- Currency Settings -->
			<div class="divider">
				<h4>Currency Settings</h4>
			</div>

			<!-- Currency Select / Dropdown -->
			<div class="form-control">
				<!-- Labeled Select / Dropdown -->
				<label class="select w-fit select-sm outline-none md:select-md">
					<!-- Label -->
					<span class="label">Currency</span>

					<!-- Select / Dropdown -->
					<select value={summitSplitState.settings.currency} onchange={(e) => summitSplitState.updateSettings(e.currentTarget.value)} class="tracking-widest">
						{#each CURRENCY_OPTIONS as currency (currency.value)}
							<option value={currency.value}>
								{currency.symbol}
								{currency.value}
							</option>
						{/each}
					</select>
				</label>
			</div>

			<!-- Household Members -->
			<div class="divider">
				<h4>Household Members</h4>
			</div>

			<!-- Household Members List -->
			<div class="flex flex-col gap-2">
				<!-- Existing Household Members -->
				{#each summitSplitState.people as person (person.id)}
					<div class="group flex items-center gap-3 rounded-lg border border-base-300 bg-base-100 p-2">
						<!-- Color Picker Dropdown -->
						<div class="dropdown dropdown-right dropdown-center">
							<div tabindex="0" role="button" class="size-6 cursor-pointer rounded-full ring-2 ring-primary-content md:size-8" style="background-color: {person.color}"></div>
							<div tabindex="0" role="menu" aria-label="Color Picker" class="dropdown-content card-compact card ml-2 min-w-max border border-base-300 bg-base-200 p-2 shadow">
								<div class="grid grid-cols-5 gap-2">
									{#each COLOR_PRESETS as color (color)}
										<button
											aria-label="Select color {color}"
											class="size-6 cursor-pointer rounded-full transition-transform hover:scale-110 md:size-8 {person.color === color ? 'ring-2 ring-primary-content' : ''}"
											style="background-color: {color}"
											onclick={() => {
												person.color = color;
												summitSplitState.save();
												(document.activeElement as HTMLElement)?.blur(); // Closes dropdown
											}}
										></button>
									{/each}
								</div>
							</div>
						</div>

						<!-- Input to edit name -->
						<input
							type="text"
							class="input input-sm w-full input-ghost outline-none focus:border-primary-content md:input-md"
							bind:value={person.name}
							onchange={() => summitSplitState.save()}
						/>

						<!-- Delete Button -->
						<button class="btn hidden btn-sm btn-error group-hover:block md:btn-md" onclick={() => confirmDelete("person", person.id, person.name)}><IconDelete /></button>
					</div>
				{/each}

				<!-- Add New Household Member -->
				<div class="flex items-center gap-3 rounded-lg border border-transparent bg-transparent p-2">
					<!-- Color Picker Dropdown -->
					<div class="dropdown dropdown-right dropdown-center">
						<div tabindex="0" role="button" class="size-6 cursor-pointer rounded-full ring-2 ring-primary-content md:size-8" style="background-color: {newPersonColor}"></div>
						<div tabindex="0" role="menu" aria-label="Color Picker" class="dropdown-content card-compact card ml-2 min-w-max border border-base-300 bg-base-200 p-2 shadow">
							<div class="grid grid-cols-5 gap-2">
								{#each COLOR_PRESETS as color (color)}
									<button
										aria-label="Select color {color}"
										class="size-6 cursor-pointer rounded-full transition-transform hover:scale-110 {newPersonColor === color ? 'ring-2 ring-primary-content' : ''}"
										style="background-color: {color}"
										onclick={() => {
											newPersonColor = color;
											(document.activeElement as HTMLElement)?.blur(); // Closes dropdown
										}}
									></button>
								{/each}
							</div>
						</div>
					</div>

					<!-- Input to add new person -->
					<input
						type="text"
						placeholder="Add a new member..."
						class="input input-sm w-full outline-none md:input-md"
						bind:value={newPersonName}
						onkeydown={(e) => e.key === "Enter" && addPerson()}
					/>

					<!-- Add Button -->
					<button class="btn btn-sm btn-primary md:btn-md" onclick={addPerson} disabled={!newPersonName}><IconPlus /> Add</button>
				</div>
			</div>
		</div>
	</div>

	<!-- 2. Income -->
	<div class="collapse-arrow collapse border-2 border-base-300 bg-success/10">
		<!-- Checkbox for opening/closing the section -->
		<input type="checkbox" bind:checked={summitSplitState.ui.sections.income} onchange={() => summitSplitState.save()} />

		<!-- Section title -->
		<div class="collapse-title flex justify-between">
			<div class="flex items-center gap-2">
				<IconIncome class="inline size-6 text-success md:size-8 lg:size-10" />
				<h3 class="font-bold text-success">Income</h3>
			</div>
			{#if !summitSplitState.ui.sections.income}
				<h3 class="font-mono font-semibold text-success">
					{formatCurrency(summitSplitState.totalIncome)}
				</h3>
			{/if}
		</div>

		<!-- Section content -->
		<div class="collapse-content flex flex-col gap-2">
			<h4>Add the monthly income of each household member.</h4>

			{#if summitSplitState.people.length === 0}
				<!-- If no people are added, show an alert -->
				<div role="alert" class="alert alert-info">
					<IconAlert class="size-6 md:size-8 lg:size-10" />
					<span>Please add household members in the household settings first.</span>
				</div>
			{:else}
				<!-- If people are added, show the income of each person -->
				{#each summitSplitState.people as person (person.id)}
					{@const newIncome = getNewIncomeState(person.id)}
					{#if newIncome}
						<!-- Person Income Card -->
						<div class="collapse-arrow collapse mb-2 border border-base-300" style="background-color: {person.color}8A;">
							<!-- Checkbox for opening/closing the section -->
							<input type="checkbox" bind:checked={summitSplitState.ui.sections.personIncome[person.id]} onchange={() => summitSplitState.save()} />
							<div class="collapse-title flex justify-between">
								<h3 class="font-bold">{person.name}</h3>
								<!-- If the section is closed, show the total income -->
								{#if !summitSplitState.ui.sections.personIncome[person.id]}
									<div class="font-mono opacity-75">{formatCurrency(summitSplitState.getPersonIncome(person.id))}</div>
								{/if}
							</div>

							<!-- Income Table -->
							<div class="collapse-content flex flex-col gap-4">
								<table class="table">
									<thead>
										<tr>
											<th>Description</th>
											<th class="text-right">Monthly</th>
											<th class="text-right">Yearly</th>
											<th></th>
										</tr>
									</thead>
									<tbody>
										<!-- Income Table Rows -->
										{#each summitSplitState.incomes.filter((i) => i.personId === person.id) as income (income.id)}
											<tr class="group hover:bg-current/10">
												<!-- Description -->
												<td>
													<input
														type="text"
														class="input input-sm w-full input-ghost outline-none focus:border-primary-content md:input-md"
														bind:value={income.name}
														onchange={() => summitSplitState.save()}
													/>
												</td>

												<!-- Monthly Amount -->
												<td>
													<div class="group-[incomeAmount]: relative flex">
														<div class="absolute inset-0 flex items-center justify-end font-mono group-[incomeAmount]:focus-within:hidden">
															{formatCurrency(income.amount)}
														</div>
														<input
															type="number"
															step="0.01"
															min="0"
															class="input inset-x-4 input-sm text-right font-mono opacity-0 outline-none focus:border-primary-content focus:opacity-100 md:input-md"
															bind:value={income.amount}
															onchange={() => {
																if (income.amount < 0) income.amount = 0;
																income.amount = roundUp(income.amount);
																summitSplitState.save();
															}}
														/>
													</div>
												</td>

												<!-- Yearly Amount -->
												<td class="cursor-default text-right font-mono opacity-80">
													{formatCurrency(income.amount * 12)}
												</td>

												<!-- Delete Button -->
												<td>
													<button class="btn hidden btn-sm btn-error group-hover:block md:btn-md" onclick={() => confirmDelete("income", income.id, income.name)}
														><IconDelete /></button
													>
												</td>
											</tr>
										{/each}

										<!-- Total Row -->
										<tr class="cursor-default bg-base-100/50 font-bold">
											<td class="pl-[30px]">Total {person.name}</td>
											<td class="text-right font-mono text-success">
												{formatCurrency(summitSplitState.getPersonIncome(person.id))}
											</td>
											<td class="text-right font-mono text-success opacity-80">
												{formatCurrency(summitSplitState.getPersonIncome(person.id) * 12)}
											</td>
											<td></td>
										</tr>

										<tr>
											<td class="col-span-4 border-none"></td>
										</tr>

										<!-- Add Income Row -->
										<tr class="group bg-base-100">
											<!-- Description -->
											<td class="rounded-l-xl">
												<input
													type="text"
													placeholder="Add new income..."
													class="input input-sm w-full input-ghost outline-none focus:border-primary-content md:input-md"
													bind:value={newIncome.name}
													onchange={() => summitSplitState.save()}
												/>
											</td>

											<!-- Monthly Amount -->
											<td>
												<div class="group-[incomeAmount] relative flex">
													<div
														class="absolute inset-0 flex items-center justify-end font-mono group-[incomeAmount]:focus-within:hidden {newIncome.amount < 0
															? 'text-error'
															: newIncome.amount === 0
																? 'text-base-content/40'
																: ''}"
													>
														{formatCurrency(newIncome.amount)}
													</div>
													<input
														type="number"
														step="0.01"
														min="0"
														class="input inset-x-4 input-sm text-right font-mono opacity-0 outline-none focus:border-primary-content focus:opacity-100 md:input-md"
														bind:value={newIncome.amount}
														onchange={() => {
															newIncome.amount = roundUp(newIncome.amount);
															summitSplitState.save();
														}}
														onkeydown={(e) => e.key === "Enter" && addIncome(person.id)}
													/>
												</div>
											</td>

											<!-- Yearly Amount -->
											<td class="cursor-default text-right font-mono opacity-80">
												{formatCurrency(newIncome.amount * 12)}
											</td>

											<!-- Add Button -->
											<td class="rounded-r-xl">
												<button
													class="btn btn-sm {!newIncome.name || newIncome.amount <= 0 ? 'btn-ghost' : ''} btn-success md:btn-md"
													onclick={() => addIncome(person.id)}
													disabled={!newIncome.name || newIncome.amount <= 0}
												>
													<IconPlus />
												</button>
											</td>
										</tr>
									</tbody>
								</table>
							</div>
						</div>
					{/if}
				{/each}
			{/if}

			<!-- Total Income for this household -->
			<div class="flex cursor-default items-start justify-end gap-4">
				<p class="font-semibold opacity-75">Total Income:</p>
				<div class="flex flex-col items-end">
					<table>
						<tbody class="">
							<tr>
								<td class="pr-2 text-right font-mono text-success">{formatCurrency(summitSplitState.totalIncome)}</td>
								<td class="text-left opacity-75">/ month</td>
							</tr>
							<tr>
								<td class="pr-2 text-right font-mono text-success">{formatCurrency(summitSplitState.totalIncome * 12)}</td>
								<td class="text-left opacity-75">/ year</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>
		</div>
	</div>

	<!-- 3. Expenses Section -->
	<div class="collapse-arrow collapse border-2 border-base-300 bg-error/10">
		<input type="checkbox" bind:checked={summitSplitState.ui.sections.expenses} onchange={() => summitSplitState.save()} />
		<div class="collapse-title flex items-center justify-between text-xl font-medium">
			<div class="flex items-center gap-2">
				<IconExpenses class="inline size-6 text-error md:size-8 lg:size-10" />
				<h3 class="font-bold text-error">Expenses</h3>
			</div>
			{#if !summitSplitState.ui.sections.expenses}
				<h3 class="font-mono font-semibold text-error">
					-{formatCurrency(summitSplitState.totalExpenses)}
				</h3>
			{/if}
		</div>
		<div class="collapse-content flex flex-col gap-4">
			<h4>Shared monthly household expenses.</h4>

			<table class="table">
				<thead>
					<tr>
						<th>Description</th>
						<th class="text-right">Monthly</th>
						<th class="text-right">Yearly</th>
						<th></th>
					</tr>
				</thead>
				<tbody>
					{#each summitSplitState.expenses as expense (expense.id)}
						<tr class="group hover:bg-current/10">
							<td>
								<input
									type="text"
									class="input input-sm w-full input-ghost outline-none focus:border-primary-content md:input-md"
									bind:value={expense.name}
									onchange={() => summitSplitState.save()}
								/>
							</td>
							<!-- Monthly Amount -->
							<td>
								<div class="group-[incomeAmount]: relative flex">
									<div class="absolute inset-0 flex items-center justify-end font-mono group-[incomeAmount]:focus-within:hidden">
										-{formatCurrency(expense.amount)}
									</div>
									<input
										type="number"
										step="0.01"
										min="0"
										class="input inset-x-4 input-sm text-right font-mono opacity-0 outline-none focus:border-primary-content focus:opacity-100 md:input-md"
										bind:value={expense.amount}
										onchange={() => {
											if (expense.amount < 0) expense.amount = 0;
											expense.amount = roundUp(expense.amount);
											summitSplitState.save();
										}}
									/>
								</div>
							</td>

							<!-- Yearly Amount -->
							<td class="cursor-default text-right font-mono opacity-80">
								-{formatCurrency(expense.amount * 12)}
							</td>
							<td>
								<button class="btn hidden btn-sm btn-error group-hover:block md:btn-md" onclick={() => confirmDelete("expense", expense.id, expense.name)}>
									<IconDelete />
								</button>
							</td>
						</tr>
					{/each}

					<tr>
						<td class="col-span-4 border-none"></td>
					</tr>

					<!-- Add Expense Row -->
					<tr class="group bg-base-100 transition-colors">
						<!-- Description -->
						<td class="rounded-l-xl">
							<input
								type="text"
								placeholder="Add new expense..."
								class="input input-sm w-full input-ghost outline-none focus:border-primary-content md:input-md"
								bind:value={newExpenseName}
								onkeydown={(e) => e.key === "Enter" && addExpense()}
							/>
						</td>

						<!-- Monthly Amount -->
						<td>
							<div class="group-[incomeAmount] relative flex">
								<div
									class="absolute inset-0 flex items-center justify-end font-mono group-[incomeAmount]:focus-within:hidden {newExpenseAmount === 0 ? 'text-base-content/40' : ''}"
								>
									-{formatCurrency(newExpenseAmount)}
								</div>
								<input
									type="number"
									step="0.01"
									min="0"
									class="input inset-x-4 input-sm text-right font-mono opacity-0 outline-none focus:border-primary-content focus:opacity-100 md:input-md"
									bind:value={newExpenseAmount}
									onchange={() => {
										newExpenseAmount = roundUp(newExpenseAmount);
									}}
									onkeydown={(e) => e.key === "Enter" && addExpense()}
								/>
							</div>
						</td>

						<!-- Yearly Amount -->
						<td class="text-right font-mono opacity-80">
							-{formatCurrency(newExpenseAmount * 12)}
						</td>

						<!-- Add Button -->
						<td class="rounded-r-xl">
							<button
								class="btn btn-sm {!newExpenseName || newExpenseAmount <= 0 ? 'btn-ghost' : ''} btn-error md:btn-md"
								onclick={addExpense}
								disabled={!newExpenseName || newExpenseAmount <= 0}
							>
								<IconPlus />
							</button>
						</td>
					</tr>
				</tbody>
			</table>

			<!-- Total Expenses for this household -->
			<div class="flex cursor-default items-start justify-end gap-4">
				<p class="font-semibold opacity-75">Total Expenses:</p>
				<div class="flex flex-col items-end">
					<table>
						<tbody class="">
							<tr>
								<td class="pr-2 text-right font-mono text-error">-{formatCurrency(summitSplitState.totalExpenses)}</td>
								<td class="text-left opacity-75">/ month</td>
							</tr>
							<tr>
								<td class="pr-2 text-right font-mono text-error">-{formatCurrency(summitSplitState.totalExpenses * 12)}</td>
								<td class="text-left opacity-75">/ year</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>
		</div>
	</div>

	<!-- 4. Savings Section -->
	<div class="collapse-arrow collapse border-2 border-base-300 bg-info/10">
		<input type="checkbox" bind:checked={summitSplitState.ui.sections.savings} onchange={() => summitSplitState.save()} />
		<div class="collapse-title flex items-center justify-between text-xl font-medium">
			<div class="flex items-center gap-2">
				<IconSavings class="inline size-6 text-info md:size-8 lg:size-10" />
				<h3 class="font-bold text-info">Savings</h3>
			</div>
			{#if !summitSplitState.ui.sections.savings}
				<h3 class="font-mono font-semibold text-info">
					{formatCurrency(summitSplitState.totalSavings)}
				</h3>
			{/if}
		</div>
		<div class="collapse-content flex flex-col gap-4">
			<h4>Allocate your remaining balance to different savings pots.</h4>

			<!-- Remaining Budget -->
			<div class="flex cursor-default flex-col items-center justify-center gap-2 rounded-xl bg-info/20 p-4">
				<p class="font-semibold opacity-75">Remaining Budget:</p>
				<div class="flex flex-col items-end">
					<table>
						<tbody>
							<tr>
								<td class="pr-2 text-right font-mono">{formatCurrency(summitSplitState.remainingBalance)}</td>
								<td class="text-left opacity-75">/ month</td>
							</tr>
							<tr>
								<td class="pr-2 text-right font-mono">{formatCurrency(summitSplitState.remainingBalance * 12)}</td>
								<td class="text-left opacity-75">/ year</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>

			<table class="table">
				<thead>
					<tr>
						<th>Saving Pot</th>
						<th class="text-right">Monthly</th>
						<th class="text-right">Yearly</th>
						<th></th>
					</tr>
				</thead>
				<tbody>
					{#each summitSplitState.savingsPots as pot (pot.id)}
						{@const max = getMaxPotAllocation(pot.id)}
						<tr class="group hover:bg-current/10">
							<!-- Name -->
							<td>
								<input
									type="text"
									class="input input-sm w-full input-ghost outline-none focus:border-primary-content md:input-md"
									bind:value={pot.name}
									onchange={() => summitSplitState.save()}
								/>
							</td>

							<!-- Monthly Amount -->
							<td>
								<div class="group-[incomeAmount]: relative flex">
									<div class="absolute inset-0 flex items-center justify-end font-mono group-[incomeAmount]:focus-within:hidden">
										{formatCurrency(pot.amount)}
									</div>
									<input
										type="number"
										step="0.01"
										min="0"
										{max}
										class="input inset-x-4 input-sm text-right font-mono opacity-0 outline-none focus:border-primary-content focus:opacity-100 md:input-md"
										bind:value={pot.amount}
										onchange={() => {
											if (pot.amount < 0) pot.amount = 0;
											if (pot.amount > max) pot.amount = max;
											pot.amount = roundUp(pot.amount);
											summitSplitState.save();
										}}
									/>
								</div>
							</td>

							<!-- Yearly Amount -->
							<td class="cursor-default text-right font-mono opacity-80">
								{formatCurrency(pot.amount * 12)}
							</td>

							<!-- Delete Button -->
							<td>
								<button class="btn hidden btn-sm btn-error group-hover:block md:btn-md" onclick={() => confirmDelete("pot", pot.id, pot.name)}>
									<IconDelete />
								</button>
							</td>
						</tr>
					{/each}

					<tr>
						<td class="col-span-4 border-none"></td>
					</tr>

					<!-- Add Pot Row -->
					<tr class="group bg-base-100 transition-colors">
						<td class="rounded-l-xl">
							<input
								type="text"
								placeholder="Add new saving pot..."
								class="input input-sm w-full input-ghost outline-none focus:border-primary-content md:input-md"
								bind:value={newPotName}
								onkeydown={(e) => e.key === "Enter" && addPot()}
							/>
						</td>

						<!-- Monthly Amount (Always 0 when adding for pots) -->
						<td class="text-right font-mono text-base-content/40">
							{formatCurrency(0)}
						</td>

						<!-- Yearly Amount -->
						<td class="text-right font-mono opacity-80">
							{formatCurrency(0)}
						</td>

						<td class="rounded-r-xl">
							<button class="btn btn-sm {!newPotName ? 'btn-ghost' : 'btn-info'} md:btn-md" onclick={addPot} disabled={!newPotName}>
								<IconPlus />
							</button>
						</td>
					</tr>
				</tbody>
			</table>

			<!-- Total Savings summary -->
			<div class="flex cursor-default items-start justify-end gap-4">
				<p class="font-semibold opacity-75">Total Savings:</p>
				<div class="flex flex-col items-end">
					<table>
						<tbody>
							<tr>
								<td class="pr-2 text-right font-mono text-info">{formatCurrency(summitSplitState.totalSavings)}</td>
								<td class="text-left opacity-75">/ month</td>
							</tr>
							<tr>
								<td class="pr-2 text-right font-mono text-info">{formatCurrency(summitSplitState.totalSavings * 12)}</td>
								<td class="text-left opacity-75">/ year</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>
		</div>
	</div>

	<!-- 5. Fair Split Calculation -->
	<div class="flex flex-col gap-6 rounded-2xl border-2 border-base-300 bg-primary/10 p-4">
		<div class="flex items-center justify-between">
			<div class="flex items-center gap-2">
				<IconBalanceScale class="inline size-6 text-primary md:size-8 lg:size-10" />
				<h3 class="font-bold text-primary">Fair Split</h3>
			</div>
		</div>
		<div class="flex flex-col gap-6">
			<h4>
				The total monthly costs
				<div class="tooltip tooltip-error" data-tip="Expenses"><span class="px-1 font-mono text-error">{formatCurrency(summitSplitState.totalExpenses)}</span></div>
				+
				<div class="tooltip tooltip-info" data-tip="Savings"><span class="px-1 font-mono text-info">{formatCurrency(summitSplitState.totalSavings)}</span></div>
				=
				<div class="tooltip tooltip-primary" data-tip="Total"><span class="px-1 font-mono text-primary">{formatCurrency(summitSplitState.totalCosts)}</span></div>
				are split based on the relative income of each person.
			</h4>

			<div class="grid grid-cols-1 gap-6">
				<!-- List of shares (Table) -->
				<div class="overflow-x-auto">
					{#if summitSplitState.people.length === 0}
						<div class="alert alert-info">
							<IconAlert />
							<span>Add people to see calculation.</span>
						</div>
					{:else}
						<table class="table">
							<colgroup span="1"></colgroup>
							<colgroup span="3"></colgroup>
							<colgroup span="2"></colgroup>
							<thead>
								<tr>
									<th colspan="1"></th>
									<th colspan="3" class="border-l border-base-content/5 text-center">Fair Share</th>
									<th colspan="2" class="border-l border-base-content/5 text-center">Remaining Income</th>
								</tr>
								<tr>
									<th>Person</th>
									<th class="border-l border-base-content/5 text-right font-semibold">%</th>
									<th class="text-right font-semibold">Monthly</th>
									<th class="text-right font-semibold">Yearly</th>
									<th class="border-l border-base-content/5 text-right font-semibold">Monthly</th>
									<th class="text-right font-semibold">Yearly</th>
								</tr>
							</thead>
							<tbody>
								{#each summitSplitState.people as person (person.id)}
									{@const personIncome = summitSplitState.getPersonIncome(person.id)}
									{@const fairShare = summitSplitState.getFairShare(person.id)}
									{@const incomeShare = summitSplitState.totalIncome > 0 ? (personIncome / summitSplitState.totalIncome) * 100 : 0}
									{@const remainingMonth = personIncome - fairShare}
									{@const remainingYear = remainingMonth * 12}
									<tr class="hover:bg-current/5">
										<td class="flex items-center gap-3">
											<div class="h-3 w-3 rounded-full" style="background-color: {person.color}"></div>
											<span class="font-bold">{person.name}</span>
										</td>
										<td class="border-l border-base-content/5 text-right font-mono opacity-75">
											{incomeShare.toFixed(1)} %
										</td>
										<td class="text-right font-mono font-bold">
											-{formatCurrency(fairShare)}
										</td>
										<td class="text-right font-mono opacity-75">
											-{formatCurrency(fairShare * 12)}
										</td>
										<td class="border-l border-base-content/5 text-right font-mono font-bold text-success">
											{formatCurrency(remainingMonth)}
										</td>
										<td class="text-right font-mono text-success">
											{formatCurrency(remainingYear)}
										</td>
									</tr>
								{/each}
							</tbody>
						</table>
					{/if}
				</div>
			</div>
		</div>
	</div>

	<!-- 6. Analysis -->
	<div class="collapse-arrow collapse border-2 border-base-300 bg-base-200">
		<input type="checkbox" bind:checked={summitSplitState.ui.sections.analysis} onchange={() => summitSplitState.save()} />
		<div class="collapse-title flex items-center justify-between text-xl font-medium">
			<div class="flex items-center gap-2">
				<IconChart class="inline size-6 md:size-8 lg:size-10" />
				<h3 class="font-bold">Analysis</h3>
			</div>
		</div>
		<div class="collapse-content flex flex-col gap-6">
			<!-- Interval Toggle -->
			<div class="flex justify-center">
				<div class="join">
					<input
						class="btn join-item btn-sm btn-neutral checked:btn-primary md:btn-md"
						type="radio"
						name="interval_toggle"
						aria-label="Monthly"
						checked={evaluationInterval === "monthly"}
						onchange={() => (evaluationInterval = "monthly")}
					/>
					<input
						class="btn join-item btn-sm btn-neutral checked:btn-primary md:btn-md"
						type="radio"
						name="interval_toggle"
						aria-label="Yearly"
						checked={evaluationInterval === "yearly"}
						onchange={() => (evaluationInterval = "yearly")}
					/>
				</div>
			</div>

			<!-- Key Metrics (Stats) -->
			<div class="stats stats-vertical border border-base-300 bg-base-100 md:stats-horizontal">
				<div class="stat">
					<div class="stat-title text-sm font-bold tracking-wider uppercase opacity-70">Savings Rate</div>
					<div class="stat-value font-mono text-info">
						{summitSplitState.totalIncome > 0 ? ((summitSplitState.totalSavings / summitSplitState.totalIncome) * 100).toFixed(1) : "0.0"}%
					</div>
					<div class="stat-desc">Contribution vs income</div>
				</div>

				<div class="stat">
					<div class="stat-title text-sm font-bold tracking-wider uppercase opacity-70">Expense Ratio</div>
					<div class="stat-value font-mono text-error">
						{summitSplitState.totalIncome > 0 ? ((summitSplitState.totalExpenses / summitSplitState.totalIncome) * 100).toFixed(1) : "0.0"}%
					</div>
					<div class="stat-desc">Fixed costs vs income</div>
				</div>

				<div class="stat">
					<div class="stat-title text-sm font-bold tracking-wider uppercase opacity-70">Unallocated</div>
					<div class="stat-value font-mono text-xl whitespace-nowrap text-success md:text-2xl">
						{formatCurrency(summitSplitState.remainingBalance * multiplier)}
					</div>
					<div class="stat-desc">{evaluationInterval === "monthly" ? "Monthly" : "Yearly"} remaining</div>
				</div>
			</div>

			<!-- Charts Grid -->
			<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
				<!-- 1. Income Share -->
				<div class="card flex max-h-80 items-center justify-center border border-base-300 bg-base-100 p-4">
					<canvas bind:this={incomeShareChartCanvas}></canvas>
				</div>
				<!-- 2. Income vs Costs -->
				<div class="card flex max-h-80 items-center justify-center border border-base-300 bg-base-100 p-4">
					<canvas bind:this={incomeVsCostsChartCanvas}></canvas>
				</div>
				<!-- 3. Income Sources -->
				<div class="card flex max-h-80 items-center justify-center border border-base-300 bg-base-100 p-4">
					<canvas bind:this={incomeSourcesChartCanvas}></canvas>
				</div>
				<!-- 4. Expenses Breakdown -->
				<div class="card flex max-h-80 items-center justify-center border border-base-300 bg-base-100 p-4">
					<canvas bind:this={expensesChartCanvas}></canvas>
				</div>
				<!-- 5. Savings Breakdown -->
				<div class="card flex max-h-80 items-center justify-center border border-base-300 bg-base-100 p-4 md:col-span-2 md:mx-auto md:w-1/2">
					<canvas bind:this={savingsChartCanvas}></canvas>
				</div>
			</div>
		</div>
	</div>
</div>

<!-- Delete Modal -->
<dialog bind:this={deleteModal} class="modal modal-bottom sm:modal-middle">
	<div class="modal-box">
		<h3 class="flex items-center gap-2 text-lg font-bold text-error"><IconAlert /> Confirm Deletion</h3>
		<p class="py-4">
			Are you sure you want to delete <span class="font-bold">{itemToDelete?.name}</span>?
			<br />
			<span class="text-sm opacity-70">This action cannot be undone.</span>
		</p>
		<div class="modal-action">
			<form method="dialog">
				<!-- if there is a button in form, it will close the modal -->
				<button class="btn btn-ghost">Cancel</button>
				<button class="btn text-white btn-error" onclick={executeDelete}>Delete</button>
			</form>
		</div>
	</div>
</dialog>
