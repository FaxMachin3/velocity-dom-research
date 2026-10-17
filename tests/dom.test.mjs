// Browser behavior is exercised by npm run check. These tests cover compiler restrictions.
import test from 'node:test';import assert from 'node:assert/strict';
import {compile} from '../src/poc/compiler.js';
import {initial,reduce} from '../src/model.js';
test('replacement uses disjoint keys',()=>{const a=initial(1000),b=reduce(a,'replace',1000);assert.equal(b.rows[0].id,1001);assert.equal(new Set([...a.rows,...b.rows].map(r=>r.id)).size,2000);});
test('sparse updates preserve unchanged object references',()=>{const a=initial(1000),b=reduce(a,'update');assert.notEqual(a.rows[0],b.rows[0]);assert.equal(a.rows[1],b.rows[1]);assert.equal(a.rows[0].label,'Item 1');});
test('compiler emits safe text bindings, not HTML injection',()=>{const result=compile('export const Text = value => <output>{value}</output>');assert.match(result.code,/bindText/);assert.doesNotMatch(result.code,/innerHTML/);});
