export function assess(release){
 if(!release||!Array.isArray(release.requirements)||!release.requirements.length||!Array.isArray(release.evidence))return {decision:"REVIEW",findings:[],reason:"Invalid release data"};
 const requirements=release.requirements,ids=new Set(requirements.map(r=>r?.id));
 if(ids.size!==requirements.length||requirements.some(r=>!r||typeof r.id!=="string"||!r.id||!Number.isSafeInteger(r.revision)||r.revision<1||!Array.isArray(r.dependencies)||r.dependencies.some(d=>!ids.has(d))))return {decision:"REVIEW",findings:[],reason:"Invalid requirement graph"};
 const visiting=new Set(),visited=new Set(),byId=new Map(requirements.map(r=>[r.id,r]));
 function cyclic(id){if(visiting.has(id))return true;if(visited.has(id))return false;visiting.add(id);for(const d of byId.get(id).dependencies)if(cyclic(d))return true;visiting.delete(id);visited.add(id);return false;}
 if(requirements.some(r=>cyclic(r.id)))return {decision:"REVIEW",findings:[],reason:"Dependency cycle"};
 const evidenceIds=new Set();if(release.evidence.some(e=>!e||typeof e.id!=="string"||!e.id||evidenceIds.has(e.id)||!evidenceIds.add(e.id)))return {decision:"REVIEW",findings:[],reason:"Invalid or duplicate evidence ID"};
 const memo=new Map();
 function check(id){if(memo.has(id))return memo.get(id);const r=byId.get(id),e=release.evidence.filter(e=>e.requirement===id&&e.revision===r.revision&&typeof e.ref==="string"&&e.ref.trim());
 const deps=r.dependencies.map(check),stale=release.evidence.filter(e=>e.requirement===id&&e.revision!==r.revision).length;
 let status=e.some(e=>e.result==="FAIL")?"FAIL":!e.some(e=>e.result==="PASS")?"MISSING":deps.some(d=>d.status!=="PASS")?"DEPENDENCY_BLOCKED":"PASS";
 const item={id,revision:r.revision,status,dependencies:r.dependencies,stale,evidence:e.map(e=>({id:e.id,result:e.result,ref:e.ref}))};memo.set(id,item);return item;}
 const findings=requirements.map(r=>check(r.id));return {decision:findings.some(x=>x.status==="FAIL")?"BLOCK":findings.every(x=>x.status==="PASS")?"READY":"REVIEW",findings,provenance:"local fixture or imported unverified evidence"};
}
export const fixture={requirements:[{id:"SEC",revision:2,dependencies:[]},{id:"API",revision:1,dependencies:["SEC"]},{id:"RELEASE",revision:1,dependencies:["API"]}],evidence:[{id:"s1",requirement:"SEC",revision:1,result:"PASS",ref:"fixture:old-security"},{id:"s2",requirement:"SEC",revision:2,result:"FAIL",ref:"fixture:current-security"},{id:"a1",requirement:"API",revision:1,result:"PASS",ref:"fixture:api"},{id:"r1",requirement:"RELEASE",revision:1,result:"PASS",ref:"fixture:approval"}]};
