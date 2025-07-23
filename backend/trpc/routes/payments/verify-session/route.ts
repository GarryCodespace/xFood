import { z } from 'zod';
import { publicProcedure } from '../../../create-context';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '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', {
  apiVersion: '2024-12-18.acacia',
});

const verifySessionSchema = z.object({
  sessionId: z.string(),
});

export const verifySessionProcedure = publicProcedure
  .input(verifySessionSchema)
  .query(async ({ input }) => {
    try {
      const { sessionId } = input;
      
      const session = await stripe.checkout.sessions.retrieve(sessionId);
      
      return {
        success: true,
        session: {
          id: session.id,
          paymentStatus: session.payment_status,
          customerEmail: session.customer_email,
          amountTotal: session.amount_total,
          currency: session.currency,
          metadata: session.metadata,
          paymentIntentId: session.payment_intent,
        },
      };
    } catch (error) {
      console.error('Session verification failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Session verification failed',
      };
    }
  });