import { loadStripe } from '@stripe/stripe-js';

// Your Stripe publishable key
const stripePromise = loadStripe('pk_live_51RkzztGKof8qMjB8gK6AXcSP3S8WJ42Vp5VhOhqGuKR5tXxIIiZT6h4nLCKAKgdDFzdffa7mH3uHM0NmmzdihoBB00zZJXekQH');

export { stripePromise };