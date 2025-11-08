# Stripe Payment Integration Guide

## Overview
This guide explains the end-to-end Stripe payment integration for the EAZYDRIVING platform.

## Architecture

### Frontend (React)
- **Location**: `driving-school-platform/src/components/payment/StripePaymentForm.js`
- **Booking Flow**: `driving-school-platform/src/pages/BookingFlow.js`
- **Stripe Elements**: Uses `@stripe/react-stripe-js` for secure card input

### Backend (Node.js/Express)
- **Controller**: `driving-school-platform/server/src/controllers/paymentController.js`
- **Routes**: `driving-school-platform/server/src/routes/payment.js`
- **Server Config**: `driving-school-platform/server/src/server.js`

## Setup Instructions

### 1. Environment Variables

#### Frontend `.env`
```bash
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key
REACT_APP_API_URL=http://localhost:5001/api
```

#### Backend `.env`
```bash
STRIPE_SECRET_KEY=sk_test_your_secret_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
```

### 2. Get Stripe Keys

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/)
2. Navigate to **Developers** > **API keys**
3. Copy the **Publishable key** and **Secret key**
4. Use **Test mode** keys for development

### 3. Setup Webhook (for Production)

1. Go to **Developers** > **Webhooks** in Stripe Dashboard
2. Click **Add endpoint**
3. Enter your webhook URL: `https://your-domain.com/api/payment/webhook`
4. Select events to listen to:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `charge.refunded`
5. Copy the **Webhook signing secret**
6. Add it to your backend `.env` as `STRIPE_WEBHOOK_SECRET`

### 4. Testing Locally with Stripe CLI

```bash
# Install Stripe CLI
brew install stripe/stripe-brew/stripe

# Login to Stripe
stripe login

# Forward webhooks to local server
stripe listen --forward-to localhost:5001/api/payment/webhook

# Copy the webhook signing secret from the output
# Add it to server/.env as STRIPE_WEBHOOK_SECRET
```

## Payment Flow

### 1. User Journey
```
Select Instructor → Choose Package → Book Lessons → Register → Payment → Confirmation
```

### 2. Technical Flow

#### Step 1: User Enters Card Details
- Frontend displays Stripe Elements (CardNumberElement, CardExpiryElement, CardCvcElement)
- Stripe.js validates card details in real-time
- No card data touches your server (PCI compliance)

#### Step 2: Create Payment Intent
```javascript
// Frontend calls backend
POST /api/payment/create-payment-intent
{
  "amount": 720.50,
  "currency": "aud",
  "metadata": {
    "learnerEmail": "user@example.com",
    "learnerName": "John Doe"
  }
}

// Backend creates PaymentIntent
const paymentIntent = await stripe.paymentIntents.create({
  amount: Math.round(amount * 100), // Convert to cents
  currency: 'aud',
  automatic_payment_methods: { enabled: true },
  metadata: metadata
});

// Returns client secret
{
  "success": true,
  "clientSecret": "pi_xxx_secret_xxx",
  "paymentIntentId": "pi_xxx"
}
```

#### Step 3: Confirm Payment
```javascript
// Frontend confirms with Stripe
const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
  payment_method: {
    card: cardElement,
    billing_details: {
      name: "John Doe",
      email: "user@example.com",
      phone: "0400000000"
    }
  }
});
```

#### Step 4: Handle Result
- **Success**: `paymentIntent.status === 'succeeded'`
  - Save booking to database
  - Show confirmation to user
  - Redirect to dashboard
- **Failure**: Display error message
  - Allow user to retry with different card

#### Step 5: Webhook Confirmation
```javascript
// Stripe sends webhook to your server
POST /api/payment/webhook
{
  type: "payment_intent.succeeded",
  data: {
    object: { /* payment intent details */ }
  }
}

// Server verifies signature and processes
- Update booking status
- Send confirmation email
- Update payment records
```

## Test Cards

### Successful Payments
```
Card Number: 4242 4242 4242 4242
Expiry: Any future date
CVC: Any 3 digits
ZIP: Any 5 digits
```

### Card Errors
```
# Card Declined
4000 0000 0000 0002

# Insufficient Funds
4000 0000 0000 9995

# Incorrect CVC
4000 0000 0000 0127

# Expired Card
4000 0000 0000 0069
```

## API Endpoints

### Create Payment Intent
```
POST /api/payment/create-payment-intent
Body: { amount, currency, metadata }
Response: { success, clientSecret, paymentIntentId }
```

### Confirm Payment
```
POST /api/payment/confirm-payment
Body: { paymentIntentId }
Response: { success, paymentIntent }
```

### Get Payment Status
```
GET /api/payment/status/:paymentIntentId
Response: { success, status, amount, currency, paymentIntent }
```

### Create Customer
```
POST /api/payment/create-customer
Body: { email, name, phone, metadata }
Response: { success, customer }
```

### Webhook Handler
```
POST /api/payment/webhook
Headers: { stripe-signature }
Body: Raw Stripe event
Response: { received: true }
```

## Error Handling

### Frontend
- Card validation errors (real-time)
- Network errors
- Payment declined
- Insufficient funds
- Invalid card details
- Stripe.js loading errors

### Backend
- Invalid amount
- Missing required fields
- Stripe API errors
- Webhook signature verification
- Database errors

## Security Best Practices

### ✅ Implemented
- Card data never touches your server
- HTTPS for all payment requests
- Webhook signature verification
- CORS configuration
- Helmet security headers
- Environment variables for secrets

### 🔒 Additional Recommendations
- Implement rate limiting
- Add request logging
- Monitor for suspicious activity
- Implement fraud detection
- Use Stripe Radar for fraud prevention
- Add 3D Secure for high-value transactions

## Monitoring & Logs

### What to Monitor
- Payment success/failure rates
- Average transaction amount
- Failed payment reasons
- Webhook delivery status
- API response times

### Stripe Dashboard
- View all transactions
- Monitor disputes/chargebacks
- Download reports
- Track refunds

## Common Issues & Solutions

### Issue: "Stripe has not loaded yet"
**Solution**: Ensure `stripePromise` is initialized before rendering payment form

### Issue: "No client secret received"
**Solution**: Check backend logs for Payment Intent creation errors

### Issue: Webhook signature verification failed
**Solution**: Ensure webhook secret matches Stripe dashboard and raw body is used

### Issue: Payment succeeds but booking not saved
**Solution**: Check `handlePaymentSuccess` function and database connection

### Issue: CORS errors
**Solution**: Add frontend URL to `CLIENT_URL` in backend `.env`

## Development Checklist

- [ ] Stripe keys added to `.env` files
- [ ] Stripe CLI installed for webhook testing
- [ ] Test cards working correctly
- [ ] Error messages displayed to user
- [ ] Success flow redirects properly
- [ ] Booking saved to database
- [ ] Webhook handler tested
- [ ] Payment confirmation email sent

## Production Checklist

- [ ] Switch to live Stripe keys
- [ ] Update webhook endpoint URL
- [ ] Configure production webhook secret
- [ ] Enable HTTPS/SSL
- [ ] Test payment flow end-to-end
- [ ] Monitor first transactions
- [ ] Setup Stripe email notifications
- [ ] Configure payout schedule
- [ ] Review fraud detection settings

## Support & Resources

- [Stripe Documentation](https://stripe.com/docs)
- [Stripe Testing](https://stripe.com/docs/testing)
- [Stripe React Elements](https://stripe.com/docs/stripe-js/react)
- [Webhooks Guide](https://stripe.com/docs/webhooks)
- [Error Codes](https://stripe.com/docs/error-codes)

## Contact

For issues with this integration, check:
1. Browser console for frontend errors
2. Server logs for backend errors
3. Stripe Dashboard logs
4. Webhook delivery status

---

**Last Updated**: 2025-01-07
**Integration Version**: 1.0
**Stripe API Version**: Latest
