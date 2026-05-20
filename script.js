const proteins = [
  {id:'4INS', name:'인슐린', emoji:'💉', tag:'혈당 조절', function:'인슐린은 혈당 조절에 관여하는 호르몬 단백질이다. 작은 크기이지만, 구조가 기능과 매우 밀접하게 연결되어 있어 단백질 구조 학습의 대표 사례로 적합하다.', point:'사슬이 어떻게 접혀 작은 호르몬 단백질의 형태를 만드는지 관찰한다.'},
  {id:'1HHO', name:'헤모글로빈', emoji:'🩸', tag:'산소 운반', function:'헤모글로빈은 혈액 속에서 산소 운반에 관여하는 단백질이다. 여러 소단위체가 모여 기능하는 대표적인 단백질 구조 사례이다.', point:'여러 단백질 사슬이 모여 하나의 기능 단위를 이루는 모습을 확인한다.'},
  {id:'1CAG', name:'콜라겐', emoji:'🧵', tag:'구조 단백질', function:'콜라겐은 피부, 뼈, 힘줄 등에 많은 구조 단백질이다. 긴 섬유 형태와 삼중 나선 구조가 특징이다.', point:'길게 꼬인 구조가 조직을 지지하는 기능과 어떻게 연결되는지 생각한다.'},
  {id:'1SMD', name:'아밀레이스', emoji:'🍚', tag:'소화 효소', function:'아밀레이스는 녹말을 분해하는 효소이다. 효소 단백질은 특정 구조를 통해 특정 물질과 결합하고 반응을 돕는다.', point:'효소의 입체 구조가 기질과의 결합에 왜 중요한지 관찰한다.'},
  {id:'1IGT', name:'항체', emoji:'🛡️', tag:'면역 작용', function:'항체는 외부 물질을 인식하는 면역 단백질이다. Y자 형태의 구조가 항원 인식 기능과 관련된다.', point:'항체의 양쪽 끝부분이 외부 물질을 인식하는 구조적 특징을 살펴본다.'}
];

let viewer, currentProtein, spinning=false;
const pages = document.querySelectorAll('.page');
function showPage(id){ pages.forEach(p=>p.classList.toggle('active', p.id===id)); window.scrollTo({top:0,behavior:'smooth'}); }
document.querySelectorAll('[data-target]').forEach(btn=>btn.addEventListener('click',()=>showPage(btn.dataset.target)));

const cards = document.getElementById('proteinCards');
proteins.forEach(p=>{
  const b=document.createElement('button');
  b.className='protein-card';
  b.innerHTML=`<div class="emoji">${p.emoji}</div><span class="tag">${p.tag}</span><h3>${p.name}</h3><p>${p.function.slice(0,82)}...</p>`;
  b.addEventListener('click',()=>openProtein(p));
  cards.appendChild(b);
});

function openProtein(p){
  currentProtein=p; spinning=false;
  document.getElementById('pdbId').textContent=`PDB ID: ${p.id}`;
  document.getElementById('proteinName').textContent=p.name;
  document.getElementById('proteinFunction').textContent=p.function;
  document.getElementById('proteinPoint').textContent=p.point;
  document.getElementById('rcsbLink').href=`https://www.rcsb.org/structure/${p.id}`;
  showPage('viewerPage');
  setTimeout(()=>loadViewer('cartoon'),100);
}

function loadViewer(style){
  const el=document.getElementById('viewer'); el.innerHTML='';
  viewer=$3Dmol.createViewer(el,{backgroundColor:'#f7fbff'});
  const url=`https://files.rcsb.org/download/${currentProtein.id}.pdb`;
  fetch(url).then(r=>r.text()).then(data=>{
    viewer.addModel(data,'pdb');
    viewer.setStyle({}, style==='stick'?{stick:{radius:0.15}}:{cartoon:{color:'spectrum'}});
    viewer.zoomTo(); viewer.render();
  }).catch(()=>{
    el.innerHTML='<div style="padding:30px;text-align:center;color:#5f718a">3D 구조를 불러오지 못했습니다. 인터넷 연결을 확인하거나 RCSB 원본 링크를 열어보세요.</div>';
  });
}

document.getElementById('styleCartoon').addEventListener('click',()=>loadViewer('cartoon'));
document.getElementById('styleStick').addEventListener('click',()=>loadViewer('stick'));
document.getElementById('zoomReset').addEventListener('click',()=>{ if(viewer){viewer.zoomTo(); viewer.render();} });
document.getElementById('spinToggle').addEventListener('click',(e)=>{ if(!viewer)return; spinning=!spinning; viewer.spin(spinning); e.target.textContent=spinning?'회전 정지':'회전 시작'; });
