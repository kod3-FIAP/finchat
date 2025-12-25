import type { NextConfig } from "next/types";

// biome-ignore lint/correctness/noUnusedImports: Import env files to validate at build time
import { env } from "~/env";

const config: NextConfig = {
	/** Enables hot reloading for local packages without a build step */
	transpilePackages: [
		"@finchat/api",
		"@finchat/auth",
		"@finchat/db",
		"@finchat/ui",
	],

	/** We already do linting and tscing as separate tasks in CI */
	typescript: { ignoreBuildErrors: true },
};

export default config;
