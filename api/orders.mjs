import {body,database,endpoint,gatewayKeys,hash,json,Problem,razorpay} from '../server/core.mjs'

const products=new Set(['karak','sufi','zinty','koka','hazelnut','vanilla','caff','esra'])
const prices={2:7000,5:15000,10:24900}
export function validateOrder(input){
 if(!input||typeof input.id!=='string'||!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(input.id))throw new Problem(400,'Invalid order reference.')
 if(!Array.isArray(input.items)||!input.items.length||input.items.length>24)throw new Problem(400,'Check your cart items.')
 const seen=new Set()
 const items=input.items.map(item=>{
  if(!item||!products.has(item.id)||!Number.isInteger(item.pack)||!Object.hasOwn(prices,item.pack)||!Number.isInteger(item.qty)||item.qty<1||item.qty>99)throw new Problem(400,'Check your cart items.')
  const key=item.id+':'+item.pack
  if(seen.has(key))throw new Problem(400,'Duplicate cart item.')
  seen.add(key)
  return {flavor:item.id,pack:item.pack,quantity:item.qty,unit_price:prices[item.pack]}
 })
 const shipping={city:'Indore',state:'Madhya Pradesh'}
 for(const [key,limit] of Object.entries({name:120,email:254,phone:22,address:500,pin:6})){
  const value=input.shipping?.[key]
  if(typeof value!=='string'||!value.trim()||value.trim().length>limit)throw new Problem(400,'Check your shipping details.')
  shipping[key]=value.trim()
 }
 if(!/^452\d{3}$/.test(shipping.pin))throw new Problem(400,'Enter an eligible Indore PIN.')
 if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(shipping.email)||!/^\+?[\d ()-]{10,22}$/.test(shipping.phone)||shipping.phone.replace(/\D/g,'').length<10)throw new Problem(400,'Check your email and phone number.')
 const subtotal=items.reduce((total,item)=>total+item.unit_price*item.quantity,0)
 return {id:input.id,shipping,items,subtotal}
}

export const POST=endpoint(async request=>{
 const order=validateOrder(json(await body(request)))
 const sql=database()
 const fingerprint=hash(order)
 await sql.begin(async tx=>{
  const inserted=await tx`insert into izih.orders (id,request_hash,shipping,subtotal,delivery)
  values (${order.id},${fingerprint},${tx.json(order.shipping)},${order.subtotal},2000)
  on conflict(id) do nothing returning id`
  if(!inserted.length){
   const [existing]=await tx`select request_hash from izih.orders where id=${order.id}`
   if(existing?.request_hash!==fingerprint)throw new Problem(409,'Cart details changed. Start checkout again.')
  }
  if(inserted.length){
   const rows=order.items.map(item=>({order_id:order.id,...item}))
   await tx`insert into izih.order_items ${tx(rows,'order_id','flavor','pack','quantity','unit_price')}`
  }
 })
 const {key}=gatewayKeys()
 return sql.begin(async tx=>{
  const [record]=await tx`select * from izih.orders where id=${order.id} for update`
  if(record.request_hash!==fingerprint)throw new Problem(409,'Cart details changed. Start checkout again.')
  if(record.payment_status==='paid')return {id:record.id,paid:true}
  let gatewayOrder=record.gateway_order
  if(!gatewayOrder){
   const remote=await razorpay('orders',{amount:record.total,currency:'INR',receipt:record.id})
   if(typeof remote.id!=='string'||!remote.id.startsWith('order_'))throw new Problem(502,'Could not open the payment provider.')
   gatewayOrder=remote.id
   await tx`update izih.orders set gateway_order=${gatewayOrder} where id=${record.id}`
  }
  return {id:record.id,key,gatewayOrder,amount:record.total}
 })
})
