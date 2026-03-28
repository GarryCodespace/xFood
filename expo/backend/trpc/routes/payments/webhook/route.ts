import { z } from 'zod';
import { publicProcedure } from '../../../create-context';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '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', {
  apiVersion: '2025-06-30.basil',
});

const webhookSchema = z.object({
  body: z.string(),
  signature: z.string(),
});

export const stripeWebhookProcedure = publicProcedure
  .input(webhookSchema)
  .mutation(async ({ input }) => {
    try {
      const { body, signature } = input;
      const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

      if (!endpointSecret) {
        throw new Error('Stripe webhook secret not configured');
      }

      const event = stripe.webhooks.constructEvent(body, signature, endpointSecret);

      switch (event.type) {
        case 'checkout.session.completed':
          const session = event.data.object as Stripe.Checkout.Session;
          
          // Handle successful payment
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

      return { success: true, received: true };
    } catch (error) {
      console.error('Webhook error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Webhook processing failed',
      };
    }
  });