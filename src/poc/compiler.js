// A deliberately restricted JSX compiler. Emits direct DOM creation and bindings.
import {parse} from '@babel/parser';
import traverseModule from '@babel/traverse';
import generateModule from '@babel/generator';
import * as t from '@babel/types';
const traverse = traverseModule.default ?? traverseModule;
const generate = generateModule.default ?? generateModule;
export function compile(source, filename = 'component.jsx') {
  const ast = parse(source, {sourceType:'module', plugins:['jsx'], sourceFilename:filename});
  let serial = 0;
  const call = (name, args) => t.callExpression(t.identifier(name), args);
  const memberCall = (obj, method, args) => t.expressionStatement(t.callExpression(t.memberExpression(obj,t.identifier(method)),args));
  function element(node) {
    const tag = node.openingElement.name;
    if (!t.isJSXIdentifier(tag) || !/^[a-z]/.test(tag.name)) throw new Error('v0 supports intrinsic lowercase HTML tags only');
    const id = t.identifier(`_v${serial++}`), statements = [];
    statements.push(t.variableDeclaration('const',[t.variableDeclarator(id,t.callExpression(t.memberExpression(t.identifier('document'),t.identifier('createElement')),[t.stringLiteral(tag.name)]))]));
    for (const a of node.openingElement.attributes) {
      if (!t.isJSXAttribute(a) || !t.isJSXIdentifier(a.name)) throw new Error('Spread/namespaced attributes are not supported');
      const name = a.name.name;
      const val = !a.value ? t.booleanLiteral(true) : t.isStringLiteral(a.value) ? a.value : a.value.expression;
      if (/^on[A-Z]/.test(name)) statements.push(t.expressionStatement(call('listen',[id,t.stringLiteral(name.slice(2).toLowerCase()),val])));
      else if (t.isJSXExpressionContainer(a.value)) statements.push(t.expressionStatement(call('bindProp',[id,t.stringLiteral(name),t.arrowFunctionExpression([],val)])));
      else statements.push(t.expressionStatement(call('setProp',[id,t.stringLiteral(name),val])));
    }
    for (const child of node.children) {
      if (t.isJSXElement(child)) statements.push(memberCall(id,'append',[element(child)]));
      else if (t.isJSXText(child)) {
        const text = child.value.replace(/\s+/g,' ');
        if (text.trim()) statements.push(memberCall(id,'append',[t.stringLiteral(text)]));
      } else if (t.isJSXExpressionContainer(child) && !t.isJSXEmptyExpression(child.expression)) {
        statements.push(t.expressionStatement(call('bindText',[id,t.arrowFunctionExpression([],child.expression)])));
      } else if (!t.isJSXExpressionContainer(child)) throw new Error('Unsupported JSX child');
    }
    statements.push(t.returnStatement(id));
    return t.callExpression(t.arrowFunctionExpression([],t.blockStatement(statements)),[]);
  }
  traverse(ast,{JSXElement(path) {path.replaceWith(element(path.node)); path.skip();}, JSXFragment() {throw new Error('Fragments are not supported in v0');}});
  return generate(ast,{sourceMaps:true,sourceFileName:filename},source);
}
