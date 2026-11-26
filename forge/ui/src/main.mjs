import {requestJira} from "@forge/bridge";
import "./style.css";
const $=id=>document.getElementById(id);
let snapshot=null;
$("issue-form").addEventListener("submit",async e=>{
 e.preventDefault();snapshot=null;$("export").disabled=true;$("evidence").textContent="";
 const key=$("issue-key").value.trim().toUpperCase();
 if(!/^[A-Z][A-Z0-9_]*-[1-9][0-9]*$/.test(key)){$("status").textContent="Invalid issue key.";return;}
 const submit=e.submitter;submit.disabled=true;$("status").textContent="Reading Jira…";
 try{
  const r=await requestJira("/rest/api/3/issue/"+encodeURIComponent(key)+"?fields=summary,status,updated,issuelinks");
  if(!r.ok)throw new Error("Jira HTTP "+r.status);
  const j=await r.json();
  snapshot={schema:"redline.jira-evidence.v1",retrievedAt:new Date().toISOString(),issue:{id:j.id,key:j.key,summary:j.fields?.summary,status:j.fields?.status?.name,updated:j.fields?.updated,linkedIssues:(j.fields?.issuelinks??[]).map(l=>({type:l.type?.name,inward:l.inwardIssue?.key,outward:l.outwardIssue?.key}))},releaseDecision:"REVIEW",reason:"Issue metadata is not verified acceptance evidence."};
  $("evidence").textContent=JSON.stringify(snapshot,null,2);$("status").textContent="Jira read successful. Release remains REVIEW.";$("export").disabled=false;
 }catch(err){$("status").textContent="No verified Jira read: "+err.message;}finally{submit.disabled=false;}
});
$("export").onclick=()=>{if(!snapshot)return;const url=URL.createObjectURL(new Blob([JSON.stringify(snapshot,null,2)],{type:"application/json"}));const a=document.createElement("a");a.href=url;a.download="redline-jira-evidence.json";a.click();URL.revokeObjectURL(url);};
