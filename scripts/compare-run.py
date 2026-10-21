import json,statistics,sys
r=json.load(open(sys.argv[1]));fs=list(dict.fromkeys(x['framework'] for x in r['samples']))
print('samples',len(r['samples']),'failures',len(r['failures']))
print('scenario | '+' | '.join(fs))
for s in dict.fromkeys(x['scenario'] for x in r['samples']):
 vals=[]
 for f in fs:
  a=[x['commitLayoutMs'] for x in r['samples'] if x['framework']==f and x['scenario']==s]
  vals.append(f'{statistics.median(a):.2f}' if a else '-')
 print(s+' | '+' | '.join(vals))
