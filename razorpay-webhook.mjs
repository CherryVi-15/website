import {body,endpoint,json,markCaptured,Problem,signed} from '../server/core.mjs'

export const POST=endpoint(async request=>{
 const raw=await body(request)
 if(!signed(raw,request.headers.get('x-razorpay-signature'),process.env.RAZORPAY_WEBHOOK_SECRET))throw new Problem(401,'Invalid webhook signature.')
 const event=json(raw)
 if(event.event==='payment.captured')await markCaptured(event.payload?.payment?.entity)
 return {ok:true}
})
