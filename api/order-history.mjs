import {database,endpoint} from '../server/core.mjs'
import {customer} from '../server/auth.mjs'
export const GET=endpoint(async request=>{
 const id=await customer(request)
 const sql=database()
 const orders=await sql`
  select o.id,o.created_at,o.total,o.delivery,o.payment_status,o.fulfillment_status,
   coalesce((select json_agg(i order by i.flavor,i.pack)
    from (select flavor,pack,quantity,unit_price from izih.order_items where order_id=o.id) i),'[]'::json) as items
  from izih.orders o where o.customer_id=${id}
  order by o.created_at desc limit 100`
 return {orders}
})
