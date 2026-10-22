import {parse} from '@babel/parser';
import traverseModule from '@babel/traverse';
import generateModule from '@babel/generator';
import * as t from '@babel/types';
const traverse=traverseModule.default??traverseModule,generate=generateModule.default??generateModule;
const escape=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const voids=new Set(['input','img','br','hr','meta','link','area','base','col','embed','param','source','track','wbr']);
export function compileTemplate(source,filename='view.jsx'){
 const ast=parse(source,{sourceType:'module',plugins:['jsx']}),factory=t.identifier('__velocityTemplate');
 function compile(node){let id=0;const bindings=[];
  const prop=(k,v)=>t.objectProperty(t.identifier(k),v),read=e=>t.arrowFunctionExpression([t.identifier('p')],e);
  function render(n){
   if(t.isJSXFragment(n))return n.children.map(child).join('');
   if(!t.isJSXIdentifier(n.openingElement.name)||!/^[a-z]/.test(n.openingElement.name.name))throw Error('Template views support intrinsic HTML elements; compose via list views or public component APIs');
   const tag=n.openingElement.name.name,attrs=n.openingElement.attributes,target=id++,directives={};let html='<'+tag,marked=false;
   const mark=()=>{if(!marked){html+=' data-v-node="'+target+'"';marked=true;}};
   for(const a of attrs){if(!t.isJSXAttribute(a)||!t.isJSXIdentifier(a.name))throw Error('Spread/namespaced attributes are unsupported');const name=a.name.name;if(name==='data-v-node')throw Error('Reserved compiler attribute');const expression=t.isJSXExpressionContainer(a.value)?a.value.expression:null;
    if(name.startsWith('v-')){directives[name]=expression??(a.value?t.stringLiteral(a.value.value):t.booleanLiteral(true));continue;}
    if(expression||/^on[A-Z]/.test(name)){if(!expression)throw Error('Events require expressions');mark();bindings.push(t.objectExpression([prop('id',t.numericLiteral(target)),prop('kind',t.stringLiteral(/^on[A-Z]/.test(name)?'event':'prop')),prop('name',t.stringLiteral(/^on[A-Z]/.test(name)?name.slice(2).toLowerCase():name)),prop('read',read(expression))]));}
    else html+=' '+(name==='className'?'class':name)+(a.value?'="'+escape(a.value.value)+'"':'');
   }
   if(directives['v-list']){if(!directives['v-view']||!directives['v-key'])throw Error('v-list requires v-view and v-key');if(n.children.some(c=>!t.isJSXText(c)||c.value.trim()))throw Error('List containers cannot have other children');mark();const fields=[prop('id',t.numericLiteral(target)),prop('kind',t.stringLiteral('list')),prop('read',read(directives['v-list'])),prop('view',directives['v-view']),prop('key',directives['v-key'])];if(directives['v-props'])fields.push(prop('props',directives['v-props']));if(directives['v-context'])fields.push(prop('context',read(directives['v-context'])));bindings.push(t.objectExpression(fields));}
   for(const k of Object.keys(directives))if(!['v-list','v-view','v-key','v-props','v-context'].includes(k))throw Error('Unsupported directive '+k);
   html+='>';if(voids.has(tag))return html;return html+n.children.map(child).join('')+'</'+tag+'>';
  }
  function child(n){if(t.isJSXElement(n)||t.isJSXFragment(n))return render(n);if(t.isJSXText(n))return escape(n.value);if(t.isJSXExpressionContainer(n)){if(t.isJSXEmptyExpression(n.expression))return '';const target=id++;bindings.push(t.objectExpression([prop('id',t.numericLiteral(target)),prop('kind',t.stringLiteral('text')),prop('read',read(n.expression))]));return '<!--v:'+target+'-->'; }throw Error('Unsupported template child');}
  const html=render(node);return t.callExpression(factory,[t.stringLiteral(html),t.arrayExpression(bindings)]);
 }
 traverse(ast,{JSXElement(path){path.replaceWith(compile(path.node));path.skip();},JSXFragment(path){path.replaceWith(compile(path.node));path.skip();}});
 ast.program.body.unshift(t.importDeclaration([t.importSpecifier(factory,t.identifier('defineTemplate'))],t.stringLiteral('../runtime/template.js')));
 return generate(ast,{sourceMaps:true,sourceFileName:filename},source);
}
