# Stripe Payment Integration for xFood

This document explains how to set up and use the Stripe payment integration in your xFood app.

## 🔧 Setup Instructions

### 1. Environment Variables

Create a `.env` file in your project root with the following variables:

```env
# Stripe Keys
STRIPE_SECRET_KEY=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
STRIPE_PUBLISHABLE_KEY=pk_live_51RkzztGKof8qMjB8gK6AXcSP3S8WJ42Vp5VhOhqGuKR5tXxIIiZT6h4nLCKAKgdDFzdffa7mH3uHM0NmmzdihoBB00zZJXekQH

# Webhook Secret (get this from Stripe Dashboard)
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here

# App URL
BASE_URL=https://your-app-domain.com
```

### 2. Stripe Dashboard Configuration

1. **Create a Stripe Account**: Go to [stripe.com](https://stripe.com) and create an account
2. **Get API Keys**: 
   - Go to Developers > API keys
   - Copy your publishable key and secret key
3. **Set up Webhooks**:
   - Go to Developers > Webhooks
   - Add endpoint: `https://your-app-domain.com/api/stripe/webhook`
   - Select events: `checkout.session.completed`, `payment_intent.succeeded`, `payment_intent.payment_failed`
   - Copy the webhook signing secret

### 3. Stripe Connect (for Marketplace)

Since xFood is a marketplace where bakers sell to customers, you'll need Stripe Connect:

1. **Enable Connect**: Go to Connect in your Stripe Dashboard
2. **Set up your platform**: Choose "Standard" accounts for sellers
3. **Configure application fee**: Set your platform fee (currently 8%)

## 🚀 How It Works

### Payment Flow

1. **User clicks "Pay"** → `PaymentProcessor` component opens
2. **Create checkout session** → tRPC call to `payments.createCheckoutSession`
3. **Redirect to Stripe** → User completes payment on Stripe Checkout
4. **Success/Cancel redirect** → User returns to app
5. **Webhook processing** → Stripe notifies your app of payment status

### Key Components

#### Backend (tRPC Routes)

- `payments.createCheckoutSession` - Creates Stripe checkout session
- `payments.verifySession` - Verifies payment completion
- `payments.webhook` - Handles Stripe webhooks (also available as REST endpoint)

#### Frontend Components

- `PaymentProcessor` - Payment modal with Stripe integration
- `payment-success.tsx` - Success page after payment
- `payment-cancelled.tsx` - Cancellation page
- `orders.tsx` - Order history page

## 💳 Using the Payment System

### In Your Components

```tsx
import { PaymentProcessor } from '@/components/PaymentProcessor';

const [showPayment, setShowPayment] = useState(false);

// Open payment modal
const handleBuyNow = () => {
  setShowPayment(true);
};

// In your JSX
<PaymentProcessor
  visible={showPayment}
  onClose={() => setShowPayment(false)}
  amount={12.99}
  sellerId="seller_stripe_account_id"
  buyerId="buyer_user_id"
  itemId="item_123"
  itemTitle="Chocolate Croissants"
  onSuccess={(paymentId) => {
    console.log('Payment successful:', paymentId);
    // Handle success (e.g., update UI, navigate)
  }}
  onError={(error) => {
    console.error('Payment failed:', error);
    // Handle error
  }}
/>
```

### Platform Fee

The system automatically deducts an 8% platform fee:
- Customer pays: $12.99
- Platform fee (8%): $1.04
- Seller receives: $11.95

## 🔒 Security Features

- **PCI Compliance**: Stripe handles all card data
- **Webhook Verification**: All webhooks are verified using Stripe signatures
- **Secure Redirects**: Success/cancel URLs are validated
- **Environment Variables**: Sensitive keys are stored securely

## 🧪 Testing

### Test Mode

For development, use Stripe's test keys:
- Test publishable key: `pk_test_...`
- Test secret key: `sk_test_...`

### Test Cards

Use these test card numbers:
- **Success**: 4242 4242 4242 4242
- **Decline**: 4000 0000 0000 0002
- **3D Secure**: 4000 0025 0000 3155

## 📱 Platform Support

- ✅ **Web**: Full Stripe Checkout integration
- ✅ **iOS**: Opens Stripe Checkout in Safari
- ✅ **Android**: Opens Stripe Checkout in browser

## 🚨 Important Notes

1. **Live Keys**: The keys in the code are live keys - handle with care
2. **Webhook Endpoint**: Must be publicly accessible for Stripe to send webhooks
3. **HTTPS Required**: Stripe requires HTTPS for live mode
4. **Connect Accounts**: Sellers need to complete Stripe Connect onboarding

## 🔧 Troubleshooting

### Common Issues

1. **"Invalid API Key"**: Check your environment variables
2. **"Webhook signature verification failed"**: Verify webhook secret
3. **"Payment failed"**: Check Stripe Dashboard for error details
4. **"Redirect not working"**: Verify BASE_URL is correct

### Debugging

Enable debug logging:
```tsx
// In your component
console.log('Payment data:', {
  amount,
  sellerId,
  buyerId,
  itemId
});
```

Check Stripe Dashboard:
- Go to Payments to see transaction details
- Check Webhooks for delivery status
- View Logs for API call details

## 📞 Support

- **Stripe Documentation**: [stripe.com/docs](https://stripe.com/docs)
- **Stripe Support**: Available in your Stripe Dashboard
- **xFood Support**: Contact your development team

---

**Note**: This integration is production-ready but should be thoroughly tested before going live with real payments.