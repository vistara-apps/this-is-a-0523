import { loadStripe } from '@stripe/stripe-js';

const stripePublishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;

if (!stripePublishableKey) {
  console.warn('Stripe configuration missing. Please set VITE_STRIPE_PUBLISHABLE_KEY environment variable.');
}

export const stripePromise = loadStripe(stripePublishableKey || '');

// Pricing configuration
export const PRICING_PLANS = {
  free: {
    name: 'Free',
    price: 0,
    scansPerMonth: 3,
    features: [
      '3 scans per month',
      'Basic keyword analysis',
      'Skills gap identification',
      'AI-powered rewriting'
    ]
  },
  pro: {
    name: 'Pro',
    price: 10,
    priceId: 'price_1234567890', // Replace with actual Stripe price ID
    scansPerMonth: 'unlimited',
    features: [
      'Unlimited scans',
      'Advanced keyword optimization',
      'Detailed skills gap analysis',
      'AI-powered rewriting',
      'Tone & style adjustment',
      'Priority support',
      'Export to multiple formats'
    ]
  }
};

export const createCheckoutSession = async (priceId, userId, userEmail) => {
  try {
    const response = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        priceId,
        userId,
        userEmail,
        successUrl: `${window.location.origin}/success`,
        cancelUrl: `${window.location.origin}/cancel`,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to create checkout session');
    }

    const { sessionId } = await response.json();
    
    const stripe = await stripePromise;
    const { error } = await stripe.redirectToCheckout({ sessionId });

    if (error) {
      throw error;
    }
  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw error;
  }
};

export const createPortalSession = async (customerId) => {
  try {
    const response = await fetch('/api/create-portal-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        customerId,
        returnUrl: window.location.origin,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to create portal session');
    }

    const { url } = await response.json();
    window.location.href = url;
  } catch (error) {
    console.error('Error creating portal session:', error);
    throw error;
  }
};

// Mock implementation for development (when backend is not available)
export const mockUpgradeSubscription = async (userId) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  console.log('Mock subscription upgrade for user:', userId);
  
  // In a real implementation, this would:
  // 1. Create a Stripe checkout session
  // 2. Redirect user to Stripe checkout
  // 3. Handle webhook to update user subscription status
  
  return {
    success: true,
    message: 'Subscription upgraded successfully (mock)'
  };
};
