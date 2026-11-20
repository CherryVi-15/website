begin;
create schema if not exists izih;
revoke all on schema izih from public;
create table if not exists izih.orders (
 id uuid primary key,
 request_hash text not null,
 created_at timestamptz not null default now(),
 shipping jsonb not null,
 subtotal integer not null check (subtotal > 0),
 delivery integer not null check (delivery = 2000),
 total integer generated always as (subtotal + delivery) stored,
 gst_included_rate numeric not null default 18,
 gateway_order text unique,
 gateway_payment text unique,
 payment_status text not null default 'pending' check (payment_status in ('pending','paid')),
 fulfillment_status text not null default 'unfulfilled',
 paid_at timestamptz
);
create table if not exists izih.order_items (
 order_id uuid not null references izih.orders(id),
 flavor text not null,
 pack integer not null check (pack in (2,5,10)),
 quantity integer not null check (quantity between 1 and 99),
 unit_price integer not null check (unit_price > 0),
 primary key (order_id, flavor, pack)
);
alter table izih.orders enable row level security;
alter table izih.order_items enable row level security;
commit;
