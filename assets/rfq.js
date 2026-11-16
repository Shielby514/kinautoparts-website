(async () => {
 const form=document.getElementById('rfq-builder');if(!form)return;
 const status=document.getElementById('rfq-status'),picker=form.elements.attachments,filesStatus=document.getElementById('rfq-files');
 const oe=new URLSearchParams(location.search).get('oe');if(oe)form.elements.reference.value=oe.slice(0,120);
 function files(){const list=[...(picker?.files||[])];const ok=list.length<=3&&list.reduce((n,f)=>n+f.size,0)<=10485760&&list.every(f=>/\.(xls|xlsx|csv|pdf|jpe?g|png|webp)$/i.test(f.name));picker?.setCustomValidity(ok?'':'Choose up to 3 XLS, XLSX, CSV, PDF or image files, 10 MB total.');return {list,ok};}
 picker?.addEventListener('change',()=>{const {list,ok}=files();filesStatus.textContent=ok?list.map(x=>x.name).join(', '):'Choose up to 3 supported files, 10 MB total.';});
 const base64=bytes=>{let s='';for(let i=0;i<bytes.length;i+=8192)s+=String.fromCharCode(...bytes.subarray(i,i+8192));return btoa(s).match(/.{1,76}/g)?.join('\r\n')||'';};
 form.addEventListener('submit',async event=>{event.preventDefault();const selected=files();if(!form.reportValidity()||!selected.ok)return;
 const data=new FormData(form),fields=[['Name','name'],['Email','email'],['Company','company'],['Phone / WhatsApp','phone'],['Reference or part description','reference'],['Vehicle and model year','vehicle'],['Quantity','quantity'],['Destination','destination'],['Additional identification details','details']];
 const message='KINP parts quotation request\n'+fields.map(([label,key])=>label+': '+String(data.get(key)||'').trim()).join('\n');
 const channel=event.submitter?.value||'email';
 if(channel==='email'&&selected.list.length){try{const boundary='KINP-'+crypto.randomUUID();let eml='To: Ku@kingmay-autoparts.com\r\nSubject: KINP parts quotation request\r\nX-Unsent: 1\r\nMIME-Version: 1.0\r\nContent-Type: multipart/mixed; boundary="'+boundary+'"\r\n\r\n--'+boundary+'\r\nContent-Type: text/plain; charset=UTF-8\r\nContent-Transfer-Encoding: base64\r\n\r\n'+base64(new TextEncoder().encode(message))+'\r\n';
 for(const f of selected.list){const name=f.name.replace(/[^a-zA-Z0-9._ -]/g,'_').slice(0,120)||'attachment';eml+='--'+boundary+'\r\nContent-Type: application/octet-stream\r\nContent-Disposition: attachment; filename="'+name+'"\r\nContent-Transfer-Encoding: base64\r\n\r\n'+base64(new Uint8Array(await f.arrayBuffer()))+'\r\n';}
 eml+='--'+boundary+'--\r\n';const url=URL.createObjectURL(new Blob([eml],{type:'message/rfc822'}));const a=document.createElement('a');a.href=url;a.download='KINP-inquiry-draft.eml';a.click();setTimeout(()=>URL.revokeObjectURL(url),60000);status.textContent='Email draft downloaded with '+selected.list.length+' attachment(s). Open in a compatible email application, review, then send. Nothing has been sent or uploaded.';}catch{status.textContent='Unable to prepare the attached draft. Please email your enquiry and files to Ku@kingmay-autoparts.com.';}return;}
 status.textContent='Opening your '+(channel==='whatsapp'?'WhatsApp':'email')+' draft. Review and send it there.'+(selected.list.length?' Attach your selected files manually in WhatsApp.':'');
 location.href=channel==='whatsapp'?'https://wa.me/8613302408528?text='+encodeURIComponent(message):'mailto:Ku@kingmay-autoparts.com?subject='+encodeURIComponent('KINP parts quotation request')+'&body='+encodeURIComponent(message);
 });
})();
