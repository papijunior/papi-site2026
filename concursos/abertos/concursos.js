(function(){
var busca=document.getElementById('busca'),uf=document.getElementById('uf'),area=document.getElementById('area');
var cards=[].slice.call(document.querySelectorAll('.concurso')),ads=[].slice.call(document.querySelectorAll('#lista .anuncio'));
var cont=document.getElementById('contagem'),vazio=document.getElementById('vazio');
function dobra(s){return s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();}
function filtrar(){
  var termos=dobra(busca.value).split(/\s+/).filter(Boolean),u=uf?uf.value:'',a=area.value,n=0;
  cards.forEach(function(c){
    var ok=(!u||c.dataset.uf===u)&&(!a||(' '+c.dataset.areas+' ').indexOf(' '+a+' ')>=0)&&termos.every(function(t){return c.dataset.texto.indexOf(t)>=0;});
    c.hidden=!ok;if(ok)n++;
  });
  var filtrado=termos.length||u||a;ads.forEach(function(x){x.hidden=!!filtrado;});
  cont.textContent=filtrado?n+' concurso(s) com esse filtro':'';vazio.hidden=n>0;
}
[busca,uf,area].forEach(function(el){if(el)el.addEventListener('input',filtrar);});
var casa=[].slice.call(document.querySelectorAll('[data-casa]'));
function semCasa(){casa.forEach(function(a){a.removeAttribute('href');a.classList.add('fora');a.textContent=a.getAttribute('data-casa')||'Cadastro de alertas indisponível agora, tente mais tarde';});}
if(casa.length){var ctl=window.AbortController?new AbortController():null;var t=setTimeout(function(){if(ctl)ctl.abort();},4000);
fetch('https://casa.papijunior.com.br/papi-alertaconcurso/ping.php',{cache:'no-store',signal:ctl&&ctl.signal}).then(function(r){clearTimeout(t);if(!r.ok)semCasa();}).catch(semCasa);}
document.addEventListener('click',function(ev){
  var a=ev.target.closest('[data-evento]');
  if(a&&window.gtag){var card=a.closest('.concurso');gtag('event',a.dataset.evento,{concurso:card?card.querySelector('h2').textContent:'',link_url:a.href});}
});
})();
