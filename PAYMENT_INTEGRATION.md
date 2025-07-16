# Payment Integration Guide - Xendit

This guide explains how the Prescripto Web App integrates multiple payment options while processing all payments through [Xendit](https://www.xendit.co/en/) as the primary payment processor.

## Overview

The application displays multiple payment options to users including **Xendit as the primary recommended option**, along with Credit Card, Virtual Account, E-Wallet, and QR Code to enhance credibility and flexibility. All payments are processed through Xendit's unified payment platform.

## Payment Flow

1. **User Interface**: Users see multiple payment options with Xendit highlighted as the recommended choice
2. **Payment Selection**: User selects their preferred payment method (Xendit is prominently displayed)
3. **Xendit Processing**: All payments are processed through Xendit's API
4. **Payment Completion**: Xendit handles the payment and sends webhook notifications

## Supported Payment Methods

### 1. Xendit 🛡️ (Primary/Recommended)
- **Description**: Secure payment gateway - Credit cards, e-wallets, bank transfer
- **Processing**: Xendit's unified payment platform
- **User Experience**: Redirects to Xendit's secure payment page with multiple payment options
- **Benefits**: Recommended option with special styling and "Recommended" badge

### 2. Credit Card 💳
- **Supported Cards**: Visa, Mastercard, American Express
- **Processing**: Direct card processing through Xendit
- **User Experience**: Secure card form or redirect to payment page

### 3. Virtual Account 🏦
- **Supported Banks**: BCA, Mandiri, BNI, BRI, and more
- **Processing**: Bank transfer via virtual account
- **User Experience**: User gets virtual account details to transfer funds

### 4. E-Wallet 📱
- **Supported Wallets**: OVO, GoPay, DANA, LinkAja, and more
- **Processing**: Direct integration with e-wallet providers
- **User Experience**: Redirect to e-wallet app or QR code scan

### 5. QR Code 📱
- **Supported**: QRIS (Indonesia), various QR standards
- **Processing**: QR code generation for mobile payments
- **User Experience**: Scan QR code with mobile banking app

## Backend Implementation

### Environment Variables

Add these to your `backend/.env` file:

```env
# Xendit Configuration (Primary Payment Processor)
XENDIT_API_KEY=your_xendit_api_key
XENDIT_CALLBACK_TOKEN=your_xendit_callback_token
XENDIT_WEBHOOK_URL=https://your-domain.com/api/user/xendit-webhook
```

### API Endpoints

1. **Get Payment Methods**: `GET /api/user/payment-methods`
   - Returns available payment methods with descriptions

2. **Create Payment**: `POST /api/user/create-xendit-payment`
   - Creates payment based on selected method
   - Parameters: `appointmentId`, `paymentMethod`

3. **Verify Payment**: `POST /api/user/verify-xendit-payment`
   - Verifies payment status
   - Parameters: `externalID`, `paymentID`, `status`

4. **Webhook**: `POST /api/user/xendit-webhook`
   - Receives payment notifications from Xendit
   - Updates appointment payment status

### Key Files

- `backend/config/xendit.js` - Xendit client configuration
- `backend/controllers/userController.js` - Payment processing logic
- `backend/routes/userRoute.js` - Payment API routes

## Frontend Implementation

### Environment Variables

Add these to your `frontend/.env` file:

```env
# Xendit Configuration (Primary Payment Processor)
VITE_XENDIT_PUBLIC_KEY=your_xendit_public_key
```

### Components

- `frontend/src/components/PaymentOptions.jsx` - Payment method selection modal
- `frontend/src/pages/MyAppointments.jsx` - Updated to use new payment flow

### User Experience

1. User clicks "Pay Online" button
2. Payment options modal opens
3. User selects preferred payment method
4. Payment is processed through Xendit
5. User receives confirmation and appointment status updates

## Xendit Setup

### 1. Create Xendit Account
1. Go to [Xendit Dashboard](https://dashboard.xendit.co/)
2. Sign up for a business account
3. Complete KYC verification

### 2. Get API Credentials
1. Navigate to Settings → API Keys
2. Generate new API key
3. Copy the API key and callback token

### 3. Configure Webhooks
1. Go to Settings → Webhooks
2. Add webhook URL: `https://your-domain.com/api/user/xendit-webhook`
3. Select events: `payment.paid`, `payment.completed`

### 4. Enable Payment Methods
1. Go to Settings → Payment Methods
2. Enable required payment methods:
   - Credit Card
   - Virtual Account
   - E-Wallet
   - QR Code

## Security Considerations

### 1. API Key Security
- Never expose API keys in frontend code
- Use environment variables for all sensitive data
- Rotate API keys regularly

### 2. Webhook Security
- Verify webhook signatures
- Use HTTPS for webhook endpoints
- Implement idempotency for webhook processing

### 3. Payment Validation
- Always verify payment status on backend
- Don't rely solely on frontend payment status
- Implement proper error handling

## Testing

### Sandbox Environment
1. Use Xendit's sandbox environment for testing
2. Test all payment methods with test credentials
3. Verify webhook handling

### Test Cards
- **Visa**: 4111111111111111
- **Mastercard**: 5555555555554444
- **American Express**: 378282246310005

### Test Virtual Accounts
- Use Xendit's test virtual account numbers
- Verify payment completion flow

## Production Deployment

### 1. Environment Setup
- Switch to production Xendit credentials
- Update webhook URLs to production domain
- Configure proper SSL certificates

### 2. Monitoring
- Set up payment failure alerts
- Monitor webhook delivery
- Track payment success rates

### 3. Compliance
- Ensure PCI DSS compliance for card processing
- Follow local payment regulations
- Implement proper data protection

## Troubleshooting

### Common Issues

1. **Payment Creation Fails**
   - Check API key validity
   - Verify payment method configuration
   - Check request parameters

2. **Webhook Not Received**
   - Verify webhook URL accessibility
   - Check webhook configuration in Xendit dashboard
   - Test webhook endpoint manually

3. **Payment Status Not Updated**
   - Check webhook processing logic
   - Verify appointment ID mapping
   - Check database connection

### Debug Steps

1. Check Xendit dashboard for payment status
2. Review server logs for errors
3. Test API endpoints with Postman
4. Verify environment variables

## Benefits of Xendit Integration

1. **Unified Platform**: Single integration for multiple payment methods
2. **Regional Coverage**: Optimized for Southeast Asian markets
3. **Security**: Enterprise-grade security and compliance
4. **Reliability**: 99.9% uptime with automatic failover
5. **Analytics**: Comprehensive payment analytics and reporting
6. **Support**: 24/7 customer support

## Cost Structure

- **Setup**: Free integration
- **Transaction Fees**: Based on payment method and volume
- **Monthly Fees**: No monthly fees for basic usage
- **Additional Services**: Custom pricing for enterprise features

For detailed pricing, visit [Xendit Pricing Page](https://www.xendit.co/en/pricing).

## Support

- **Xendit Documentation**: [docs.xendit.co](https://docs.xendit.co/)
- **API Reference**: [api.xendit.co](https://api.xendit.co/)
- **Support**: Available through Xendit dashboard
- **Community**: Developer community and forums 