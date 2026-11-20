# Deploy IZIH on Vercel

1. Copy the contents of this folder into the root of your existing GitHub repository. The storefront is now in public/index.html. Vercel serves public/ and deploys the endpoints in api/. Keep the project root pointed at the directory containing vercel.json. Use the Other framework preset and clear any conflicting build/output overrides.
2. Connect Supabase to that Vercel project. In the Supabase SQL Editor, run schema.sql. Add POSTGRES_URL to Vercel with a server-side Supabase connection string, using the transaction pooler for serverless connections. Use the project database owner connection to run this starter (the tables have RLS and no client policies). Keep the real connection string in Vercel, outside Git.
3. In Vercel environment variables, set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET with Razorpay Test Mode credentials. Choose a separate RAZORPAY_WEBHOOK_SECRET and configure the same value in Razorpay. Redeploy after changing environment variables.
4. In Razorpay Test Mode, add a webhook targeting https://YOUR-DEPLOYED-DOMAIN/api/razorpay-webhook and subscribe to payment.captured. Configure automatic capture and verify the webhook URL is publicly reachable. Use an isolated test environment/database before accepting real orders.
5. At the deployed site, add a product using an Indore 452 PIN, check the total, fill shipping details with sample data, and complete a test payment. Check schema izih in Supabase Table Editor (or run select * from izih.orders order by created_at desc; in SQL Editor). The order should move from pending to paid after capture. Inspect izih.order_items by order_id. Confirm a failed payment stays pending and retrying an unchanged checkout does not create another local order.
6. When your Razorpay account is activated and testing passes, configure the Live Mode credentials and a Live Mode webhook in production. Verify the actual Indore delivery PIN list if your service area differs from the current 452xxx rule.

Amounts are integer paise in the database. Product prices include 18% GST and delivery is ₹20 per order. The fulfilment status starts as unfulfilled and can be updated by staff in Supabase. The store does not collect card or UPI credentials. Save real credentials only in Vercel or a local ignored .env file. The supplied .env.example lists the required names.


## Updating an existing IZIH deployment

Run order-email-migration.sql in the existing Supabase SQL Editor. Older orders and account records are preserved. New checkouts are guests, and shipping details remain available in izih.orders. Delete these obsolete paths from the existing production branch after uploading the new files: api/account-config.mjs, api/order-history.mjs, server/auth.mjs, and public/store-accounts.js. You can also switch off Allow new users to sign up in Supabase Authentication to retire registration. Keep POSTGRES_URL in Vercel.

## Order confirmation emails

1. Add izih.in (or a dedicated sending subdomain) under Domains in Resend. Add the exact DNS records Resend provides and wait for verification.
2. Create a Resend sending API key. Add RESEND_API_KEY and ORDER_EMAIL_FROM in Vercel Production. An example sender, after verifying izih.in, is IZIH <orders@izih.in>. Save the credentials in Vercel and redeploy.
3. Configure the Razorpay webhook as described above. Use test credentials first. A valid payment.captured event marks the matching order paid, then sends one order confirmation to the shipping email. The email includes the order reference, items and total paid. confirmation_sent_at shows when Resend accepted the send. Check Resend's email activity for delivery to the recipient.
4. If Resend rejects a configured send, the webhook returns an error so Razorpay can retry. Payment remains recorded. If you enable email after a test payment was already captured, test again with a new order. This setup does not send confirmations for unpaid orders.

## Using another payment gateway

Razorpay is the included checkout adapter. If you choose a different gateway, its checkout and authenticated payment webhook need to be connected before taking payments. The order database and order confirmation email template can be reused. After verifying a provider event, match the payment to your saved order, verify the amount, currency and successful capture, and record the payment in Supabase. Then call sendOrderConfirmation(orderId) from server/order-email.mjs with the internal IZIH order ID. It checks the paid state and uses the shipping email. There is no public email-sending endpoint.
