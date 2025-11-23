import type { AUTO_MODE, DARK_MODE, LIGHT_MODE } from "@constants/constants";

export type SiteConfig = {
	title: string;
	subtitle: string;
	description?: string;

	lang: "en" | "zh_CN";

	themeColor: {
		hue: number;
		fixed: boolean;
	};
	toc: {
		enable: boolean;
		depth: 1 | 2 | 3;
	};

	favicon: Favicon[];

	record?: {
		enable: boolean;
		text: string;
		url: string;
	};
};

export type Favicon = {
	src: string;
	theme?: "light" | "dark";
	sizes?: string;
};

export enum LinkPreset {
	Home = 0,
	Archive = 1,
	About = 2,
	FriendLinks = 3,
}

export type NavBarLink = {
	name: string;
	url: string;
	external?: boolean;
};

export type NavBarConfig = {
	links: (NavBarLink | LinkPreset)[];
};

export type ProfileConfig = {
	avatar?: string;
	name: string;
	bio?: string;
	links: {
		name: string;
		url: string;
		icon: string;
	}[];
};

export type LicenseConfig = {
	enable: boolean;
	name: string;
	url: string;
};

export type LIGHT_DARK_MODE =
	| typeof LIGHT_MODE
	| typeof DARK_MODE
	| typeof AUTO_MODE;

export type BlogPostData = {
	body: string;
	title: string;
	published: Date;
	description: string;
	tags: string[];
	draft?: boolean;
	image?: string;
	category?: string;
	prevTitle?: string;
	prevSlug?: string;
	nextTitle?: string;
	nextSlug?: string;
};

export type ExpressiveCodeConfig = {
	theme: string;
};

export type FriendLink = {
	name: string;
	url: string;
	avatar?: string;
	description?: string;
	tags?: string[];
};

export type FriendLinksConfig = {
	enable: boolean;
	links: FriendLink[];
	submitMessage?: string;
};

export type GiscusConfig = {
	enable: boolean;
	repo: string;
	repoId: string;
	category: string;
	categoryId: string;
	mapping?: "pathname" | "url" | "title" | "og:title";
	reactionsEnabled?: boolean;
	emitMetadata?: boolean;
	inputPosition?: "top" | "bottom";
	theme?:
		| "light"
		| "dark"
		| "preferred_color_scheme"
		| "transparent_dark"
		| "noborder_light"
		| "noborder_dark"
		| "dark_dimmed"
		| "dark_high_contrast"
		| "dark_protanopia"
		| "light_high_contrast"
		| "light_protanopia"
		| "light_tritanopia"
		| "dark_tritanopia";
	lang?: string;
	loading?: "lazy" | "eager";
};

export type UmamiConfig = {
	enable: boolean;
	scriptUrl?: string;
	websiteId?: string;
	apiBase?: string;
	shareId?: string;
	timezone?: string;
};
