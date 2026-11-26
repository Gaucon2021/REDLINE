import {test} from "node:test";import assert from "node:assert/strict";import{assess,fixture}from "./workbench.mjs";
test("current failure dominates stale pass",()=>assert.equal(assess(fixture).decision,"BLOCK"));
test("dependency blocks passing downstream evidence",()=>assert.equal(assess(fixture).findings[1].status,"DEPENDENCY_BLOCKED"));
test("corrected evidence ready",()=>{const r=structuredClone(fixture);r.evidence[1].result="PASS";assert.equal(assess(r).decision,"READY")});
test("missing current revision is review",()=>assert.equal(assess({...fixture,evidence:fixture.evidence.filter(e=>e.id!=="s2")}).decision,"REVIEW"));
test("duplicate evidence rejected",()=>assert.equal(assess({...fixture,evidence:[...fixture.evidence,fixture.evidence[0]]}).decision,"REVIEW"));
test("cycles rejected",()=>{const r=structuredClone(fixture);r.requirements[0].dependencies=["RELEASE"];assert.equal(assess(r).reason,"Dependency cycle")});
