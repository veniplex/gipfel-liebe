import tailwindcss from "@tailwindcss/vite";
import Icons from 'unplugin-icons/vite';
import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";
import { readFileSync } from "node:fs";

const pkg = JSON.parse(readFileSync("./package.json", "utf-8"));

export default defineConfig({
	plugins: [
        tailwindcss(), 
        sveltekit(), 
        Icons({
			compiler: 'svelte',
			autoInstall: true
		}),
    ],
	define: {
		"import.meta.env.VITE_APP_NAME": JSON.stringify("Gipfel Liebe"),
        "import.meta.env.VITE_APP_VERSION": JSON.stringify(pkg.version),
	}
});
