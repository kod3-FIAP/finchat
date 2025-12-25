import { db } from "@finchat/db/client";
import type { BetterAuthOptions, BetterAuthPlugin } from "better-auth";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { oAuthProxy } from "better-auth/plugins";

export function initAuth<
	TExtraPlugins extends Array<BetterAuthPlugin> = [],
>(options: {
	baseUrl: string;
	productionUrl: string;
	secret: string | undefined;
	extraPlugins?: TExtraPlugins;
}) {
	const config = {
		baseURL: options.baseUrl,
		database: drizzleAdapter(db, {
			provider: "pg",
		}),
		onAPIError: {
			onError(_error, _ctx) {},
		},
		plugins: [
			oAuthProxy({
				productionURL: options.productionUrl,
			}),
			...(options.extraPlugins ?? []),
		],
		secret: options.secret,
	} satisfies BetterAuthOptions;

	return betterAuth(config);
}

export type Auth = ReturnType<typeof initAuth>;
export type Session = Auth["$Infer"]["Session"];
