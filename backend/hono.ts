import { Hono } from "hono";
import { trpcServer } from "@hono/trpc-server";
import { cors } from "hono/cors";
import { appRouter } from "./trpc/app-router";
import { createContext } from "./trpc/create-context";
import Stripe from 'stripe';

// app will be mounted at /api
const app = new Hono();

// Enable CORS for all routes
app.use("*", cors());

// Stripe webhook endpoint (must be before tRPC middleware)
app.post("/stripe/webhook", async (c) => {
  try {
    const body = await c.req.text();
    const signature = c.req.header('stripe-signature');
    
    if (!signature) {
      return c.json({ error: 'Missing stripe-signature header' }, 400);
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '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', {
      apiVersion: '2024-12-18.acacia',
    });

    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
    
    if (!endpointSecret) {
      console.error('Stripe webhook secret not configured');
      return c.json({ error: 'Webhook secret not configured' }, 500);
    }

    const event = stripe.webhooks.constructEvent(body, signature, endpointSecret);

    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object as Stripe.Checkout.Session;
        
        console.log('Payment successful:', {
          sessionId: session.id,
          paymentIntentId: session.payment_intent,
          customerEmail: session.customer_email,
          amountTotal: session.amount_total,
          metadata: session.metadata,
        });

        // Here you would typically:
        // 1. Update order status in your database
        // 2. Send confirmation email to buyer
        // 3. Notify seller
        // 4. Update inventory if applicable
        
        break;

      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log('PaymentIntent succeeded:', paymentIntent.id);
        break;

      case 'payment_intent.payment_failed':
        const failedPayment = event.data.object as Stripe.PaymentIntent;
        console.log('PaymentIntent failed:', failedPayment.id);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return c.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return c.json({ error: 'Webhook processing failed' }, 400);
  }
});

// Mount tRPC router at /trpc
app.use(
  "/trpc/*",
  trpcServer({
    endpoint: "/api/trpc",
    router: appRouter,
    createContext,
  })
);

// Simple health check endpoint
app.get("/", (c) => {
  return c.json({ status: "ok", message: "API is running" });
});

export default app;