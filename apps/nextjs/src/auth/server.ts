import "server-only";

import { initAuth } from "@finchat/auth";
import { nextCookies } from "better-auth/next-js";
import { headers } from "next/headers";
import { cache } from "react";

import { env } from "~/env";
import { getBaseUrl } from "~/trpc/react";

export const auth = initAuth({
	baseUrl: getBaseUrl(),
	extraPlugins: [nextCookies()],
	productionUrl: `https://${env.VERCEL_PROJECT_PRODUCTION_URL ?? "finchat.vercel.app"}`,
	secret: env.AUTH_SECRET,
});

export const getSession = cache(async () =>
	auth.api.getSession({ headers: await headers() }),
);
