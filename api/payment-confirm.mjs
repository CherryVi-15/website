import {body,database,endpoint,gatewayKeys,json,markCaptured,Problem,razorpay,signed} from '../server/core.mjs'

export const POST=endpoint(async request=>{
 const data=json(await body(request))
 const {razorpay_order_id:order,razorpay_payment_id:payment,razorpay_signature:signature}=data??{}
 if(typeof order!=='string'||!/^order_[a-zA-Z0-9]+$/.test(order)||typeof payment!=='string'||!/^pay_[a-zA-Z0-9]+$/.test(payment))throw new Problem(400,'Invalid payment details.')
 const sql=database()
 const [record]=await sql`select gateway_order,total from izih.orders where gateway_order=${order}`
 if(!record||!signed(record.gateway_order+'|'+payment,signature,gatewayKeys().secret))throw new Problem(400,'Payment signature could not be verified.')
 const captured=await razorpay('payments/'+payment)
 if(captured.id!==payment||captured.order_id!==record.gateway_order||captured.amount!==record.total)throw new Problem(400,'Payment does not match the order.')
 return {paid:Boolean(await markCaptured(captured))}
})
