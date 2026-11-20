begin;
alter table izih.orders add column if not exists customer_id uuid;
create index if not exists orders_customer_date on izih.orders (customer_id,created_at desc) where customer_id is not null;
commit;
