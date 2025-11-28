<script lang="ts">
import Giscus from "@giscus/svelte";
import { getHue } from "@utils/setting-utils.ts";
import { onDestroy, onMount } from "svelte";
import { giscusConfig } from "@/config";

let hue = getHue();
let mode = document.documentElement.classList.contains("dark")
	? "dark"
	: "light";
let theme: string;

const styles = {
	base: null as string | null,
	dark: null as string | null,
	light: null as string | null,
};

Promise.all([
	import("@styles/giscus/layout.css?raw"),
	import("@styles/giscus/dark.css?raw"),
	import("@styles/giscus/light.css?raw"),
])
	.then(([baseModule, darkModule, lightModule]) => {
		styles.base = baseModule.default;
		styles.dark = darkModule.default;
		styles.light = lightModule.default;
		theme = getGiscusTheme();
	})
	.catch(console.error);

let giscusIframe: HTMLIFrameElement | null = null;

const observer = new MutationObserver(() => {
	const newHue = getHue();
	const newMode = document.documentElement.classList.contains("dark")
		? "dark"
		: "light";

	if (hue !== newHue || mode !== newMode) {
		hue = newHue;
		mode = newMode;
		updateGiscusTheme();
	}
});

onMount(() => {
	findGiscusIframe();
	observer.observe(document.documentElement, {
		attributes: true,
		attributeFilter: ["class", "style"],
	});
});

onDestroy(() => observer.disconnect());

function findGiscusIframe(retries = 0) {
	giscusIframe = document
		.getElementById("comments")
		?.shadowRoot?.querySelector("iframe") as HTMLIFrameElement;
	if (!giscusIframe && retries < 10) {
		setTimeout(() => findGiscusIframe(retries + 1), 100 * 1.5 ** retries);
	}
}

function getGiscusTheme() {
	if (!styles.base || !styles.dark || !styles.light) return mode;

	const hueStyle = `main { --hue: ${hue}; }`;
	const css =
		hueStyle + (mode === "dark" ? styles.dark : styles.light) + styles.base;
	return `data:text/css;base64,${btoa(css)}`;
}

function updateGiscusTheme(retries = 0) {
	if (!giscusIframe?.contentWindow && retries < 10) {
		setTimeout(() => updateGiscusTheme(retries + 1), 100 * 1.5 ** retries);
		return;
	}

	giscusIframe?.contentWindow?.postMessage(
		{
			giscus: { setConfig: { theme: getGiscusTheme() } },
		},
		"https://giscus.app",
	);
}
</script>

<Giscus
	id="comments"
	{theme}
	repo={giscusConfig.repo}
	repoId={giscusConfig.repoId}
	category={giscusConfig.category}
	categoryId={giscusConfig.categoryId}
	mapping={giscusConfig.mapping}
	term={""}
	strict={giscusConfig.strict}
	reactionsEnabled={giscusConfig.reactionsEnabled}
	inputPosition={giscusConfig.inputPosition}
	lang={giscusConfig.lang}
	loading={giscusConfig.loading}
/>