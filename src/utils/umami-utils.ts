import { umamiConfig } from "@/config";

type ShareAuth = {
	websiteId: string;
	token: string;
};

export type UmamiStats = {
	pageviews: number;
	visitors: number;
	visits: number;
};

const DEFAULT_API_BASE = "https://cloud.umami.is/analytics/us/api";
const apiBase = (umamiConfig.apiBase || DEFAULT_API_BASE).replace(/\/$/, "");
const SITE_CACHE_KEY = "__site__";
const statsCache = new Map<string, Promise<UmamiStats | null>>();
let shareAuthPromise: Promise<ShareAuth | null> | null = null;

const timezone = umamiConfig.timezone || "Asia/Shanghai";

function logWarn(message: string, detail?: unknown) {
	if (import.meta.env?.DEV) {
		console.warn(`[Umami] ${message}`, detail);
	}
}

function normalizePath(path: string): string {
	if (!path || path === "/") return "/";
	let normalized = path.replace(/\/+/g, "/");
	normalized = normalized.startsWith("/") ? normalized : `/${normalized}`;
	return normalized;
}

async function requestShareAuth(): Promise<ShareAuth | null> {
	if (!umamiConfig.enable) return null;

	if (!umamiConfig.shareId) {
		logWarn("缺少 shareId 配置，无法获取 Umami token。");
		return null;
	}

	try {
		const response = await fetch(`${apiBase}/share/${umamiConfig.shareId}`);
		if (!response.ok) {
			logWarn("获取 share token 失败。", response.status);
			return null;
		}

		const data = (await response.json()) as ShareAuth;
		const websiteId = umamiConfig.websiteId || data.websiteId;
		if (!websiteId) {
			logWarn("share 接口未返回 websiteId，且配置中也未提供。");
			return null;
		}

		return {
			websiteId,
			token: data.token,
		};
	} catch (error) {
		logWarn("请求 share token 异常。", error);
		return null;
	}
}

async function getShareAuth(): Promise<ShareAuth | null> {
	if (!umamiConfig.enable) return null;

	if (!shareAuthPromise) {
		shareAuthPromise = requestShareAuth();
	}

	const auth = await shareAuthPromise;
	if (!auth) {
		shareAuthPromise = null;
	}
	return auth;
}

async function requestStats(path?: string): Promise<UmamiStats | null> {
	const auth = await getShareAuth();
	if (!auth) return null;

	const params = new URLSearchParams({
		startAt: "0",
		endAt: Date.now().toString(),
		unit: "hour",
		timezone,
		compare: "false",
	});

	if (path) {
		params.set("path", `eq.${normalizePath(path)}`);
	}

	try {
		const response = await fetch(
			`${apiBase}/websites/${auth.websiteId}/stats?${params.toString()}`,
			{
				headers: {
					"x-umami-share-token": auth.token,
				},
			},
		);

		if (!response.ok) {
			logWarn("请求统计数据失败。", response.status);
			return null;
		}

		const data = (await response.json()) as Partial<UmamiStats>;
		return {
			pageviews: data.pageviews ?? 0,
			visitors: data.visitors ?? 0,
			visits: data.visits ?? 0,
		};
	} catch (error) {
		logWarn("请求统计数据异常。", error);
		return null;
	}
}

export function toAnalyticsPath(urlOrPath: string): string {
	try {
		const url = new URL(urlOrPath, "http://localhost");
		return normalizePath(url.pathname);
	} catch {
		return normalizePath(urlOrPath);
	}
}

export async function getPageViews(path?: string): Promise<UmamiStats | null> {
	if (!umamiConfig.enable) return null;

	const normalizedPath = path ? normalizePath(path) : undefined;
	const cacheKey = normalizedPath ?? SITE_CACHE_KEY;

	if (!statsCache.has(cacheKey)) {
		statsCache.set(cacheKey, requestStats(normalizedPath));
	}

	const result = await (statsCache.get(cacheKey) ?? Promise.resolve(null));
	if (!result) {
		statsCache.delete(cacheKey);
	}
	return result;
}

export async function getPageViewCount(path?: string): Promise<number | null> {
	const stats = await getPageViews(path);
	return stats?.pageviews ?? null;
}
