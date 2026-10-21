// Positions belonging to a longest strictly increasing subsequence.
// Zero denotes an inserted key and is excluded. O(n log n), O(n) storage.
export function stablePositions(values){
 const tails=[],links=new Int32Array(values.length);links.fill(-1);
 for(let i=0;i<values.length;i++){
  const v=values[i];if(!v)continue;
  let lo=0,hi=tails.length;
  while(lo<hi){const mid=(lo+hi)>>>1;if(values[tails[mid]]<v)lo=mid+1;else hi=mid;}
  if(lo)links[i]=tails[lo-1];tails[lo]=i;
 }
 const stable=new Uint8Array(values.length);
 for(let i=tails.length?tails[tails.length-1]:-1;i>=0;i=links[i])stable[i]=1;
 return stable;
}
