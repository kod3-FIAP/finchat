import { createEnv } from "@t3-oss/env-core";
import { z } from "zod/v4";

export const authEnv = () =>
	createEnv({
		runtimeEnv: process.env,
		server: {
			AUTH_SECRET:
				process.env.NODE_ENV === "production"
					? z.string().min(1)
					: z.string().min(1).optional(),
			NODE_ENV: z.enum(["development", "production"]).optional(),
		},
		skipValidation:
			!!process.env.CI || process.env.npm_lifecycle_event === "lint",
	});
