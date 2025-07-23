import { createTRPCRouter } from "./create-context";
import hiRoute from "./routes/example/hi/route";
import { createCheckoutSessionProcedure } from "./routes/payments/create-checkout-session/route";
import { stripeWebhookProcedure } from "./routes/payments/webhook/route";
import { verifySessionProcedure } from "./routes/payments/verify-session/route";

export const appRouter = createTRPCRouter({
  example: createTRPCRouter({
    hi: hiRoute,
  }),
  payments: createTRPCRouter({
    createCheckoutSession: createCheckoutSessionProcedure,
    webhook: stripeWebhookProcedure,
    verifySession: verifySessionProcedure,
  }),
});

export type AppRouter = typeof appRouter;