import type { TRPCRouterRecord } from "@trpc/server";

import { protectedProcedure, publicProcedure } from "../trpc";

export const authRouter = {
	getSecretMessage: protectedProcedure.query(
		() => "you can see this secret message!",
	),
	getSession: publicProcedure.query(({ ctx }) => ctx.session),
} satisfies TRPCRouterRecord;
