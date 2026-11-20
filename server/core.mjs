import postgres from 'postgres'
import {createHash,createHmac,timingSafeEqual} from 'node:crypto'

let db
export function database(){
 if(!process.env.POSTGRES_URL) throw new Problem(503,'Order storage is awaiting setup.')
 return db ??= postgres(process.env.POSTGRES_URL,{max:1,prepare:false,connect_timeout:8})
}
export class Problem extends Error {
 constructor(status,message){super(message);this.status=status}
}
export function endpoint(handler){
 return async request=>{
  try{return Response.json(await handler(request),{headers:{'Cache-Control':'no-store'}})}
  catch(error){
   if(error instanceof Problem)return Response.json({error:error.message},{status:error.status})
   return Response.json({error:'Checkout is temporarily unavailable. Please try again.'},{status:503})
  }
 }
}
export async function body(request){
 if(Number(request.headers.get('content-length'))>16000)throw new Problem(413,'Request too large.')
 const raw=await request.text()
 if(Buffer.byteLength(raw)>16000)throw new Problem(413,'Request too large.')
 return raw
}
export function json(raw){
 try{return JSON.parse(raw)}catch{throw new Problem(400,'Invalid request.')}
}
export const hash=value=>createHash('sha256').update(JSON.stringify(value)).digest('hex')
export function signed(data,signature,secret){
 if(!secret||typeof signature!=='string'||!/^[0-9a-f]{64}$/i.test(signature))return false
 return timingSafeEqual(createHmac('sha256',secret).update(data).digest(),Buffer.from(signature,'hex'))
}
export function gatewayKeys(){
 const key=process.env.RAZORPAY_KEY_ID
 const secret=process.env.RAZORPAY_KEY_SECRET
 if(!key||!secret)throw new Problem(503,'Online payments are awaiting setup.')
 return {key,secret}
}
export async function razorpay(path,payload){
 const {key,secret}=gatewayKeys()
 const response=await fetch('https://api.razorpay.com/v1/'+path,{
  method:payload?'POST':'GET',
  headers:{Authorization:'Basic '+Buffer.from(key+':'+secret).toString('base64'),'Content-Type':'application/json'},
  body:payload?JSON.stringify(payload):undefined,signal:AbortSignal.timeout(8000)
 })
 if(!response.ok)throw new Problem(502,'The payment provider is temporarily unavailable.')
 return response.json()
}
export async function markCaptured(payment){
 if(payment?.status!=='captured'||payment.currency!=='INR')return null
 const sql=database()
 const rows=await sql`update izih.orders set payment_status='paid',gateway_payment=${payment.id},paid_at=coalesce(paid_at,now())
 where gateway_order=${payment.order_id} and total=${payment.amount}
 and (gateway_payment is null or gateway_payment=${payment.id}) returning id`
 return rows[0]?.id ?? null
}
