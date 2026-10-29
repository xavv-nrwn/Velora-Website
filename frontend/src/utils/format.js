export const rupiah=v=>new Intl.NumberFormat('id-ID',{style:'currency',currency:'IDR',maximumFractionDigits:0}).format(Number(v||0)).replace('Rp','Rp').replace(/,00$/,'');
export const today=()=>new Date().toLocaleDateString('en-CA',{timeZone:'Asia/Jakarta'});
export const dateText=v=>new Date(v+'T00:00:00').toLocaleDateString('id-ID',{day:'numeric',month:'short',year:'numeric'});
