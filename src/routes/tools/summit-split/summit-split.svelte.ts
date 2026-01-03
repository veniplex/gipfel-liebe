import { browser } from '$app/environment';

export interface Person {
	id: string;
	name: string;
	color: string;
}

export interface IncomeSource {
	id: string;
	name: string;
	amount: number;
	personId: string;
}

export interface Expense {
	id: string;
	name: string;
	amount: number;
}

export interface SavingsPot {
	id: string;
	name: string;
	amount: number; // Allocated amount this month
}

export interface Settings {
	currency: string;
}

export interface UIState {
	sections: {
		settings: boolean;
		income: boolean;
		expenses: boolean;
		savings: boolean;
		fairSplit: boolean;
		analysis: boolean;
		personIncome: Record<string, boolean>;
	};
}

export class SummitSplitState {
	people = $state<Person[]>([]);
	incomes = $state<IncomeSource[]>([]);
	expenses = $state<Expense[]>([]);
	savingsPots = $state<SavingsPot[]>([]);
	settings = $state<Settings>({ currency: "EUR" });
	ui = $state<UIState>({
		sections: {
			settings: true,
			income: true,
			expenses: true,
			savings: true,
			fairSplit: true,
			analysis: true,
			personIncome: {}
		}
	});

	constructor() {
		if (browser) {
			this.load();
		}
	}

	load() {
		const data = localStorage.getItem('summit-split-data');
		if (data) {
			try {
				const parsed = JSON.parse(data);
				this.people = parsed.people || [];
				this.incomes = parsed.incomes || [];
				this.expenses = parsed.expenses || [];
				this.savingsPots = parsed.savingsPots || [];
				this.settings = parsed.settings || { currency: "EUR" };
				this.ui = parsed.ui || {
					sections: {
						settings: true,
						income: true,
						expenses: true,
						savings: true,
						fairSplit: true,
						analysis: true,
						personIncome: {}
					}
				};
			} catch (e) {
				console.error('Failed to load Summit Split data', e);
			}
		}
	}

	save() {
		if (browser) {
			const data = {
				people: this.people,
				incomes: this.incomes,
				expenses: this.expenses,
				savingsPots: this.savingsPots,
				settings: this.settings,
				ui: this.ui
			};
			localStorage.setItem('summit-split-data', JSON.stringify(data));
		}
	}

	addPerson(name: string, color: string = '#000000') {
		this.people.push({
			id: crypto.randomUUID(),
			name,
			color
		});
		this.save();
	}

	removePerson(id: string) {
		this.people = this.people.filter((p) => p.id !== id);
        this.incomes = this.incomes.filter(i => i.personId !== id);
		this.save();
	}

	addIncome(name: string, amount: number, personId: string) {
		this.incomes.push({
			id: crypto.randomUUID(),
			name,
			amount,
			personId
		});
		this.save();
	}

    removeIncome(id: string) {
        this.incomes = this.incomes.filter(i => i.id !== id);
        this.save();
    }

	addExpense(name: string, amount: number) {
		this.expenses.push({
			id: crypto.randomUUID(),
			name,
			amount
		});
		this.save();
	}

    removeExpense(id: string) {
        this.expenses = this.expenses.filter(e => e.id !== id);
        this.save();
    }

	addSavingsPot(name: string, amount: number = 0) {
		this.savingsPots.push({
			id: crypto.randomUUID(),
			name,
			amount
		});
		this.save();
	}

    removeSavingsPot(id: string) {
        this.savingsPots = this.savingsPots.filter(s => s.id !== id);
        this.save();
    }
    
    updateSavingsPot(id: string, amount: number) {
        const pot = this.savingsPots.find(p => p.id === id);
        if (pot) {
            pot.amount = amount;
            this.save();
        }
    }

    updateSettings(currency: string) {
        this.settings.currency = currency;
        this.save();
    }

    // Calculations
    get totalIncome() {
        return this.incomes.reduce((sum, i) => sum + i.amount, 0);
    }

    get totalExpenses() {
        return this.expenses.reduce((sum, e) => sum + e.amount, 0);
    }

    get totalSavings() {
        return this.savingsPots.reduce((sum, s) => sum + s.amount, 0);
    }

    get totalCosts() {
        return this.totalExpenses + this.totalSavings;
    }
    
    get netBalanceBeforeSavings() {
        return this.totalIncome - this.totalExpenses;
    }

    get remainingBalance() {
        return this.netBalanceBeforeSavings - this.totalSavings;
    }

    getPersonIncome(personId: string) {
        return this.incomes
            .filter(i => i.personId === personId)
            .reduce((sum, i) => sum + i.amount, 0);
    }

    getFairShare(personId: string) {
        if (this.totalIncome === 0) return 0;
        const personIncome = this.getPersonIncome(personId);
        const sharePercentage = personIncome / this.totalIncome;
        return this.totalCosts * sharePercentage;
    }
}
