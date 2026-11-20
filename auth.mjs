import {Problem} from './core.mjs'

export function authConfig(){
 const url=process.env.SUPABASE_URL
 const key=process.env.SUPABASE_PUBLISHABLE_KEY||process.env.SUPABASE_ANON_KEY
 let isPublic=key?.startsWith('sb_publishable_')
 if(key?.startsWith('eyJ')){
  try{isPublic=JSON.parse(Buffer.from(key.split('.')[1],'base64url')).role==='anon'}catch{}
 }
 if(!url||!isPublic)throw new Problem(503,'Customer accounts are awaiting setup.')
 return {url:url.replace(/\/$/,''),key}
}

export async function customer(request,{optional=false}={}){
 const authorization=request.headers.get('authorization')
 if(!authorization&&optional)return null
 if(!authorization||!/^Bearer [\w.\-]+$/.test(authorization))throw new Problem(401,'Sign in to continue.')
 const {url,key}=authConfig()
 const response=await fetch(url+'/auth/v1/user',{headers:{apikey:key,Authorization:authorization},signal:AbortSignal.timeout(6000)})
 if(response.status===401||response.status===403)throw new Problem(401,'Your session expired. Please sign in again.')
 if(!response.ok)throw new Problem(503,'Account verification is temporarily unavailable.')
 const user=await response.json()
 if(!user.id||!user.email_confirmed_at)throw new Problem(401,'Confirm your email and sign in again.')
 return user.id
}
