import { z } from 'zod';
import { publicProcedure } from '../../../create-context';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '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', {
  apiVersion: '2025-06-30.basil',
});

const createCheckoutSessionSchema = z.object({
  itemName: z.string(),
  itemPrice: z.number(),
  userEmail: z.string().email(),
  sellerId: z.string(),
  buyerId: z.string(),
  itemId: z.string(),
  platformFeePercent: z.number().default(8),
});

export const createCheckoutSessionProcedure = publicProcedure
  .input(createCheckoutSessionSchema)
  .mutation(async ({ input }) => {
    try {
      const { itemName, itemPrice, userEmail, sellerId, buyerId, itemId, platformFeePercent } = input;
      
      const platformFee = Math.round(itemPrice * 100 * (platformFeePercent / 100));
      const sellerAmount = Math.round(itemPrice * 100) - platformFee;
      
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [{
          price_data: {
            currency: 'usd',
            product_data: {
              name: itemName,
              description: `Delicious baked goods from xFood`,
            },
            unit_amount: Math.round(itemPrice * 100), // price in cents
          },
          quantity: 1,
        }],
        mode: 'payment',
        success_url: `${process.env.BASE_URL || 'https://your-app.com'}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.BASE_URL || 'https://your-app.com'}/payment-cancelled`,
        customer_email: userEmail,
        metadata: {
          sellerId,
          buyerId,
          itemId,
          platformFee: platformFee.toString(),
          sellerAmount: sellerAmount.toString(),
        },
        payment_intent_data: {
          application_fee_amount: platformFee,
          transfer_data: {
            destination: sellerId, // This should be the seller's Stripe Connect account ID
          },
        },
      });

      return {
        success: true,
        sessionId: session.id,
        url: session.url,
      };
    } catch (error) {
      console.error('Stripe checkout session creation failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Payment session creation failed',
      };
    }
  });