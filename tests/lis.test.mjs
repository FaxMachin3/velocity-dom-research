import test from 'node:test';import assert from 'node:assert/strict';
import {stablePositions} from '../src/poc/lis.js';
test('LIS membership matches independent quadratic length oracle',()=>{
 let seed=123;for(let round=0;round<300;round++){
  const a=Array.from({length:round%70},()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed%90;});
  const dp=a.map(()=>0);let expected=0;for(let i=0;i<a.length;i++)if(a[i]){dp[i]=1;for(let j=0;j<i;j++)if(a[j]&&a[j]<a[i])dp[i]=Math.max(dp[i],dp[j]+1);expected=Math.max(expected,dp[i]);}
  const stable=stablePositions(a),chosen=a.filter((_,i)=>stable[i]);assert.equal(chosen.length,expected);for(let i=1;i<chosen.length;i++)assert.ok(chosen[i]>chosen[i-1]);
 }
});
