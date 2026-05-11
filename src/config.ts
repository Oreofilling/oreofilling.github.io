import type {
	ExpressiveCodeConfig,
	LicenseConfig,
	NavBarConfig,
	ProfileConfig,
	SiteConfig,
} from "./types/config";
import { LinkPreset } from "./types/config";

export const siteConfig: SiteConfig = {
	title: "ZEROBOT",
	subtitle: "记录 C++、算法、Linux 与生活",
	lang: "zh_CN",
	themeColor: {
		hue: 210,
		fixed: false,
	},
	banner: {
		enable: true,
		src: "assets/images/banner.jpg",
		position: "center",
		credit: {
			enable: true,
			text: "",
			url: "",
		},
	},
	toc: {
		enable: true,
		depth: 3,
	},
	favicon: [],
	comment: {
		giscus: {
			// Get these values from https://giscus.app
			// Go to the site, enter your repo, and copy the generated values
			repo: "Oreofilling/oreofilling.github.io",
			repoId: "",       // TODO: Fill in from giscus.app
			category: "Comments",
			categoryId: "",   // TODO: Fill in from giscus.app
			mapping: "pathname",
			strict: "0",
			reactionsEnabled: "1",
			emitMetadata: "0",
			inputPosition: "top",
			theme: "preferred_color_scheme",
			lang: "zh-CN",
			loading: "lazy",
		},
	},
};

export const navBarConfig: NavBarConfig = {
	links: [
		LinkPreset.Home,
		LinkPreset.Archive,
		{
			name: "GitHub",
			url: "https://github.com/Oreofilling",
			external: true,
		},
	],
};

export const profileConfig: ProfileConfig = {
	avatar: "assets/images/avatar.jpg",
	name: "zerobot",
	bio: "热爱编程，专注于 C++ / Linux / 算法",
	links: [
		{
			name: "GitHub",
			icon: "fa6-brands:github",
			url: "https://github.com/Oreofilling",
		},
	],
};

export const licenseConfig: LicenseConfig = {
	enable: true,
	name: "CC BY-NC-SA 4.0",
	url: "https://creativecommons.org/licenses/by-nc-sa/4.0/",
};

export const expressiveCodeConfig: ExpressiveCodeConfig = {
	theme: "github-dark",
};
