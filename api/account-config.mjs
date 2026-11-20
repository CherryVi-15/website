export default function handler(request,response){
 response.setHeader('Cache-Control','no-store')
 if(request.method!=='GET'){
  response.setHeader('Allow','GET')
  return response.status(405).json({error:'Method not allowed.'})
 }
 const url=(process.env.SUPABASE_URL||'').trim().replace(/\/$/,'')
 const key=(process.env.SUPABASE_PUBLISHABLE_KEY||process.env.SUPABASE_ANON_KEY||'').trim()
 let isPublic=key.startsWith('sb_publishable_')
 if(key.startsWith('eyJ')){
  try{isPublic=JSON.parse(Buffer.from(key.split('.')[1],'base64url')).role==='anon'}catch{}
 }
 if(!/^https:\/\/[a-z0-9][a-z0-9.-]*$/i.test(url)||!isPublic){
  return response.status(503).json({error:'Customer accounts are awaiting setup.'})
 }
 return response.status(200).json({url,key})
}
