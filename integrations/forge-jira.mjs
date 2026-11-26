// Integration candidate for Atlassian Forge Custom UI. Install @forge/bridge in a registered Forge app.
// This reads issue metadata as the current Jira user; issue status is not independent release evidence.
import {requestJira} from "@forge/bridge";
export async function readIssue(key){
 if(!/^[A-Z][A-Z0-9_]*-[1-9][0-9]*$/.test(key))throw new Error("Invalid Jira issue key");
 const response=await requestJira("/rest/api/3/issue/"+encodeURIComponent(key)+"?fields=summary,status,updated,issuelinks");
 if(!response.ok)throw new Error("Jira HTTP "+response.status);
 const issue=await response.json();
 return {id:issue.id,key:issue.key,summary:issue.fields?.summary,status:issue.fields?.status?.name,updated:issue.fields?.updated,links:issue.fields?.issuelinks??[],provenance:"Jira API as current user"};
}
