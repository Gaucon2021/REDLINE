export function assess(release){
 const invalid=reason=>({decision:"REVIEW",findings:[],reason,releaseAuthorized:false,provenance:"UNVERIFIED_LOCAL_MODEL"});
 if(!release||!Array.isArray(release.requirements)||!release.requirements.length||release.requirements.length>300||!Array.isArray(release.evidence)||release.evidence.length>1500)return invalid("Invalid or oversized release data");
 const requirements=release.requirements,ids=new Set(requirements.map(r=>r?.id));
 const key=x=>typeof x==="string"&&x.length>0&&x.length<=100&&x===x.trim();
 if(ids.size!==requirements.length||requirements.some(r=>!r||!key(r.id)||!Number.isSafeInteger(r.revision)||r.revision<1||!Array.isArray(r.dependencies)||r.dependencies.length>300||new Set(r.dependencies).size!==r.dependencies.length||r.dependencies.some(d=>!ids.has(d))))return invalid("Invalid requirement graph");
 const visiting=new Set(),visited=new Set(),byId=new Map(requirements.map(r=>[r.id,r]));
 function cyclic(id){if(visiting.has(id))return true;if(visited.has(id))return false;visiting.add(id);for(const d of byId.get(id).dependencies)if(cyclic(d))return true;visiting.delete(id);visited.add(id);return false;}
 if(requirements.some(r=>cyclic(r.id)))return invalid("Dependency cycle");
 const evidenceIds=new Set(),grouped=new Map();
 for(const e of release.evidence){
  if(!e||!key(e.id)||evidenceIds.has(e.id)||!ids.has(e.requirement)||!Number.isSafeInteger(e.revision)||e.revision<1||!["PASS","FAIL"].includes(e.result)||typeof e.ref!=="string"||!e.ref.trim()||e.ref.length>2000)return invalid("Invalid or duplicate evidence ID or record");
  evidenceIds.add(e.id);if(!grouped.has(e.requirement))grouped.set(e.requirement,[]);grouped.get(e.requirement).push(e);
 }
 const memo=new Map();
 function check(id){if(memo.has(id))return memo.get(id);const r=byId.get(id),all=grouped.get(id)||[],e=all.filter(e=>e.revision===r.revision),deps=r.dependencies.map(check),stale=all.length-e.length;
 const status=e.some(e=>e.result==="FAIL")?"FAIL":!e.some(e=>e.result==="PASS")?"MISSING":deps.some(d=>d.status!=="PASS")?"DEPENDENCY_BLOCKED":"PASS";
 const item={id,revision:r.revision,status,dependencies:[...r.dependencies],stale,evidence:e.map(e=>({id:e.id,result:e.result,ref:e.ref}))};memo.set(id,item);return item;}
 const findings=requirements.map(r=>check(r.id));return {decision:findings.some(x=>x.status==="FAIL")?"BLOCK":findings.every(x=>x.status==="PASS")?"READY":"REVIEW",findings,releaseAuthorized:false,provenance:"UNVERIFIED_LOCAL_MODEL"};
}
export const fixture={"requirements":[{"id":"SEC","revision":2,"dependencies":[]},{"id":"API","revision":1,"dependencies":["SEC"]},{"id":"RELEASE","revision":1,"dependencies":["API"]}],"evidence":[{"id":"s1","requirement":"SEC","revision":1,"result":"PASS","ref":"fixture:old-security"},{"id":"s2","requirement":"SEC","revision":2,"result":"FAIL","ref":"fixture:current-security"},{"id":"a1","requirement":"API","revision":1,"result":"PASS","ref":"fixture:api"},{"id":"r1","requirement":"RELEASE","revision":1,"result":"PASS","ref":"fixture:approval"}]};
