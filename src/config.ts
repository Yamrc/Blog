import { friendLinks } from "./data/friend-links";
import type {
	ExpressiveCodeConfig,
	FriendLinksConfig,
	GiscusConfig,
	LicenseConfig,
	NavBarConfig,
	ProfileConfig,
	SiteConfig,
} from "./types/config";
import { LinkPreset } from "./types/config";

export const siteConfig: SiteConfig = {
	title: "RC Blog",
	subtitle: "技术分享与开发笔记",
	description: "Yamrc的个人博客，分享编程技术、开发心得与经验等原创文章。",
	keywords: [
		"博客",
		"技术",
		"编程",
		"开发",
		"RC Blog",
		"Blog",
		"Yamrc",
		"BiliRumble",
	],
	lang: "zh_CN",
	themeColor: {
		hue: 345,
		fixed: true,
	},
	toc: {
		enable: true,
		depth: 2,
	},
	favicon: [
		{
			src: "/favicon.ico",
		},
	],
};

export const navBarConfig: NavBarConfig = {
	links: [LinkPreset.Home, LinkPreset.Archive, LinkPreset.FriendLinks],
};

// Visit https://icones.js.org/ for icon codes
export const profileConfig: ProfileConfig = {
	avatar: "https://q.qlogo.cn/g?b=qq&nk=2951327332&s=640",
	name: "Yamrc",
	bio: "unsafe fn life()",
	links: [
		{
			name: "GitHub",
			icon: "fa6-brands:github",
			url: "https://github.com/Yamrc",
		},
		{
			name: "BiliBili",
			icon: "fa6-brands:bilibili",
			url: "https://space.bilibili.com/475403704",
		},
		{
			name: "Steam",
			icon: "fa6-brands:steam",
			url: "https://steamcommunity.com/id/yamrc/",
		},
	],
};

export const licenseConfig: LicenseConfig = {
	enable: true,
	name: "CC BY-NC-SA 4.0",
	url: "https://creativecommons.org/licenses/by-nc-sa/4.0/",
};

// https://giscus.app/
export const giscusConfig: GiscusConfig = {
	enable: true,
	repo: "Yamrc/Blog",
	repoId: "R_kgDOP1CIlQ",
	category: "Comments",
	categoryId: "DIC_kwDOP1CIlc4CxlCV",
	mapping: "pathname",
	reactionsEnabled: true,
	emitMetadata: false,
	inputPosition: "top",
	theme: "preferred_color_scheme",
	lang: "zh-CN",
	loading: "lazy",
};

export const friendLinksConfig: FriendLinksConfig = {
	enable: true,
	submitMessage: "如何加入友链？请自行提交PR。",
	links: friendLinks,
};

export const expressiveCodeConfig: ExpressiveCodeConfig = {
	theme: "github-dark",
};
