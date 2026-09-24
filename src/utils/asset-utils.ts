import path from "node:path";
import type { ImageMetadata } from "astro";

const files = import.meta.glob<ImageMetadata>("../assets/**/*", {
	import: "default",
});

/**
 * 将 src/assets 下的相对路径(如 "assets/images/banner.jpg")解析为
 * 构建产物的绝对 URL,用于 og:image / JSON-LD 等场景。
 * 路径不存在或为外链时返回 undefined(外链原样返回)。
 */
export async function resolveAssetUrl(
	src: string | undefined,
	site: URL | undefined,
): Promise<string | undefined> {
	if (!src) return undefined;
	if (/^(https?:)?\/\//.test(src)) return src;
	const normalized = path.normalize(path.join("../", src)).replace(/\\/g, "/");
	const file = files[normalized];
	if (!file) return undefined;
	const img = await file();
	if (!img?.src) return undefined;
	return site ? new URL(img.src, site).href : img.src;
}
