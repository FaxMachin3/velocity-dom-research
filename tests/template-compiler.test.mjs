import test from 'node:test';import assert from 'node:assert/strict';
import {compileTemplate} from '../src/poc/template-compiler.js';
test('compiled templates keep untrusted dynamic text out of HTML',()=>{const code=compileTemplate('export const A = <p>{p.value}</p>').code;assert.match(code,/read: p => p.value/);assert.match(code,/kind: "text"/);assert.doesNotMatch(code,/innerHTML/);});
test('compiler supports multi-node views',()=>assert.match(compileTemplate('export const A = <><input value={p.value}/><span>{p.value}</span></>').code,/__velocityTemplate/));
test('list syntax requires explicit identity and view',()=>assert.throws(()=>compileTemplate('const A = <div v-list={p.rows}/>'),/requires/));
test('unsupported directives fail at compilation',()=>assert.throws(()=>compileTemplate('const A = <div v-mystery={p.x}/>'),/Unsupported directive/));
test('reserved marker cannot collide with author markup',()=>assert.throws(()=>compileTemplate('const A = <div data-v-node="0"/>'),/Reserved/));
