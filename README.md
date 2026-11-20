# Deploy IZIH on Vercel

1. Copy the contents of this folder into the root of your existing GitHub repository. The storefront is now in public/index.html. Vercel serves public/ and deploys the endpoints in api/. Keep the project root pointed at the directory containing vercel.json. Use the Other framework preset and clear any conflicting build/output overrides.
2. Connect Supabase to that Vercel project. In the Supabase SQL Editor, run schema.sql. Add POSTGRES_URL to Vercel with a server-side Supabase connection string, using the transaction pooler for serverless connections. Use the project database owner connection to run this starter (the tables have RLS and no client policies). Keep the real connection string in Vercel, outside Git.
3. In Vercel environment variables, set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET with Razorpay Test Mode credentials. Choose a separate RAZORPAY_WEBHOOK_SECRET and configure the same value in Razorpay. Redeploy after changing environment variables.
4. In Razorpay Test Mode, add a webhook targeting https://YOUR-DEPLOYED-DOMAIN/api/razorpay-webhook and subscribe to payment.captured. Configure automatic capture and verify the webhook URL is publicly reachable. Use an isolated test environment/database before accepting real orders.
5. At the deployed site, add a product using an Indore 452 PIN, check the total, fill shipping details with sample data, and complete a test payment. Check schema izih in Supabase Table Editor (or run select * from izih.orders order by created_at desc; in SQL Editor). The order should move from pending to paid after capture. Inspect izih.order_items by order_id. Confirm a failed payment stays pending and retrying an unchanged checkout does not create another local order.
6. When your Razorpay account is activated and testing passes, configure the Live Mode credentials and a Live Mode webhook in production. Verify the actual Indore delivery PIN list if your service area differs from the current 452xxx rule.

Amounts are integer paise in the database. Product prices include 18% GST and delivery is ₹20 per order. The fulfilment status starts as unfulfilled and can be updated by staff in Supabase. The store does not collect card or UPI credentials. Save real credentials only in Vercel or a local ignored .env file. The supplied .env.example lists the required names.

## Customer accounts and order history

For a deployed store that already has order tables, run accounts-migration.sql in the same Supabase project's SQL Editor before deploying this version. It adds an optional account ID and an index without changing existing orders. A fresh installation can run schema.sql.

In Supabase Authentication, enable email/password sign-in and email confirmation. In Authentication URL Configuration, set Site URL to your production storefront and allow the production storefront URL as an email redirect. Configure SMTP and test that confirmation emails reach customers before launching public sign-ups.

In Vercel Production environment variables, keep POSTGRES_URL and add SUPABASE_URL and SUPABASE_PUBLISHABLE_KEY from the same Supabase project if the integration did not already add them. The browser receives the publishable key. The checkout API verifies each customer's session with Supabase and scopes order history to that account. Keep the database and Razorpay secrets in Vercel.

Redeploy the production branch. Create a test customer, confirm their email, sign in, and submit a sample checkout. Then open Account > Orders. Verify that a second account cannot see the first account's order. A signed-in order is visible when saved even if payment remains pending. Previously placed guest orders are not linked by email automatically. Guest checkout still works.
