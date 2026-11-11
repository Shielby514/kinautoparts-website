(() => {
  const form = document.getElementById('rfq-builder');
  if (!form) return;
  const oe = new URLSearchParams(location.search).get('oe');
  if (oe) form.elements.reference.value = oe.slice(0, 120);
  form.addEventListener('submit', event => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    const fields = [['Reference or part description','reference'],['Vehicle and model year','vehicle'],['Quantity','quantity'],['Destination','destination'],['Additional identification details','details']];
    const message = 'KINP parts quotation request\n' + fields.map(([label,key]) => label+': '+String(data.get(key)||'').trim()).join('\n');
    const channel = event.submitter?.value || 'email';
    const link = channel === 'whatsapp'
      ? 'https://wa.me/8613302408528?text='+encodeURIComponent(message)
      : 'mailto:Ku@kingmay-autoparts.com?subject='+encodeURIComponent('KINP parts quotation request')+'&body='+encodeURIComponent(message);
    document.getElementById('rfq-status').textContent='Opening your '+(channel==='whatsapp'?'WhatsApp':'email')+' draft. Review it and send it in that application. Attach photos there.';
    location.href = link;
  });
})();
