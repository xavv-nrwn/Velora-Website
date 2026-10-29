export const rupiah=v=>new Intl.NumberFormat('id-ID',{style:'currency',currency:'IDR',maximumFractionDigits:0}).format(Number(v||0)).replace('Rp','Rp').replace(/,00$/,'');
export const today=()=>new Date().toLocaleDateString('en-CA',{timeZone:'Asia/Jakarta'});
export const dateInput=v=>{if(!v)return '';const match=String(v).match(/^\d{4}-\d{2}-\d{2}/);return match?match[0]:''};
export const dateText=v=>{const value=dateInput(v);if(!value)return 'Tanggal tidak valid';const [year,month,day]=value.split('-').map(Number);const date=new Date(year,month-1,day);return Number.isNaN(date.getTime())?'Tanggal tidak valid':date.toLocaleDateString('id-ID',{day:'numeric',month:'short',year:'numeric'})};
