import {database,Problem} from './core.mjs'

const names={karak:'Karak',sufi:'Sufi',zinty:'Zinty',koka:'Koka',hazelnut:'Natkhat',vanilla:'Vanni',caff:'Caff',esra:'Esra'}
const rupees=new Intl.NumberFormat('en-IN',{style:'currency',currency:'INR'})
const money=paise=>rupees.format(paise/100)

export function confirmationMessage(order,items,from){
 const text=[
  'Hi '+order.shipping.name+',',
  '',
  'We received your payment. Thanks for ordering from IZIH!',
  'Order reference: '+order.id,
  '',
  ...items.map(item=> names[item.flavor]+' · Pack of '+item.pack+' × '+item.quantity+' · '+money(item.unit_price*item.quantity)),
  '',
  'Indore delivery: '+money(order.delivery),
  'Total paid: '+money(order.total),
  'Product prices include 18% GST.',
  '',
  'Good vibes. Good chai.',
  'IZIH'
 ].join('\n')
 return {from,to:[order.shipping.email],subject:'Your IZIH order is confirmed',text}
}

export async function sendOrderConfirmation(orderId){
 const apiKey=process.env.RESEND_API_KEY
 const from=process.env.ORDER_EMAIL_FROM
 if(!apiKey||!from)return
 const sql=database()
 await sql.begin(async tx=>{
  const [order]=await tx`select id,shipping,delivery,total from izih.orders
    where id=${orderId} and payment_status='paid' and confirmation_sent_at is null for update`
  if(!order)return
  const items=await tx`select flavor,pack,quantity,unit_price from izih.order_items where order_id=${order.id} order by flavor,pack`
  const response=await fetch('https://api.resend.com/emails',{
   method:'POST',
   headers:{Authorization:'Bearer '+apiKey,'Content-Type':'application/json','Idempotency-Key':'izih-order-confirmation/'+order.id},
   body:JSON.stringify(confirmationMessage(order,items,from)),
   signal:AbortSignal.timeout(6000)
  })
  if(!response.ok)throw new Problem(503,'Order confirmation email could not be sent.')
  await tx`update izih.orders set confirmation_sent_at=now() where id=${order.id}`
 })
}
