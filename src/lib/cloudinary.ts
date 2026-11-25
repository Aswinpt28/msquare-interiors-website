import { createHash } from 'crypto';
const cloud=()=>process.env.CLOUDINARY_CLOUD_NAME||'';
const key=()=>process.env.CLOUDINARY_API_KEY||'';
const secret=()=>process.env.CLOUDINARY_API_SECRET||'';
export function cloudinaryReady(){return !!(cloud()&&key()&&secret());}
function signature(params:Record<string,string>){
 const base=Object.keys(params).sort().map(k=>`${k}=${params[k]}`).join('&');
 return createHash('sha1').update(base+secret()).digest('hex');
}
export async function cloudinarySearch(tag:string,maxResults=100){
 const auth=Buffer.from(`${key()}:${secret()}`).toString('base64');
 const url=`https://api.cloudinary.com/v1_1/${cloud()}/resources/search`;
 const response=await fetch(url,{method:'POST',headers:{Authorization:`Basic ${auth}`,'Content-Type':'application/json'},body:JSON.stringify({expression:`tags=${tag}`,sort_by:[{created_at:'desc'}],max_results:Math.min(Math.max(maxResults,1),500)}),cache:'no-store'});
 if(!response.ok) throw new Error('Unable to retrieve Cloudinary media');
 return response.json();
}
export async function uploadToCloudinary(file:File,kind:string,meta:Record<string,string>){
 const timestamp=Math.floor(Date.now()/1000).toString();
 const folder=kind==='furniture'?'m-square/furniture':kind==='video'?'m-square/videos':'m-square/portfolio';
 const tag=kind==='furniture'?'m2-furniture,m2-product':kind==='video'?'m2-video':'m2-portfolio';
 const context=`caption=${(meta.title||'').replace(/[|=]/g,' ')}|alt=${(meta.description||'').replace(/[|=]/g,' ')}${kind!=='video'?`|category=${meta.category||'Living'}`:''}${kind==='furniture'?`|price=${meta.price||''}`:''}`;
 const params:Record<string,string>={folder,tags:tag,timestamp,context};
 const sig=signature(params);
 const resourceType=kind==='video'?'video':'image';
 const form=new FormData();
 form.append('file',file); form.append('api_key',key()); form.append('timestamp',timestamp);
 form.append('folder',folder); form.append('tags',tag); form.append('context',context); form.append('signature',sig);
 const response=await fetch(`https://api.cloudinary.com/v1_1/${cloud()}/${resourceType}/upload`,{method:'POST',body:form});
 const result=await response.json();
 if(!response.ok) throw new Error(result.error?.message||'Upload failed');
 return result;
}

export async function deleteFromCloudinary(publicId:string, resourceType:'image'|'video'='image') {
 const timestamp=Math.floor(Date.now()/1000).toString();
 const params:Record<string,string>={public_id:publicId,timestamp};
 const sig=signature(params);
 const form=new FormData();
 form.append('public_id',publicId); form.append('timestamp',timestamp);
 form.append('api_key',key()); form.append('signature',sig);
 const response=await fetch(`https://api.cloudinary.com/v1_1/${cloud()}/${resourceType}/destroy`,{method:'POST',body:form});
 const result=await response.json();
 if(!response.ok || result.result!=='ok') throw new Error(result.error?.message||'Cloudinary deletion failed');
 return result;
}
