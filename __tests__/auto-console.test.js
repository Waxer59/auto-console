const Babel = require('@babel/standalone');

Babel.registerPlugin('autoConsole', require('../lib'));
const autoConsole = (code) =>
  Babel.transform(code, {
    plugins: ['autoConsole']
  })
    .code.replace(/(\r\n|\n|\r)/gm, '')
    .replace(/ /g, '');

describe('autoConsole', () => {
  test('Does not replace console.log', () => {
    const code = 'console.log("Hello, world!");';
    const transformed = autoConsole(code);
    expect(transformed).toBe(
      'console.log("Hello, world!");'
        .replace(/(\r\n|\n|\r)/gm, '')
        .replace(/ /g, '')
    );
  });

  test('Replaces non-console.log calls with console.log', () => {
    const code = 'alert("Hello, world!");';
    const transformed = autoConsole(code);
    expect(transformed).toBe(
      'console.log(alert("Hello, world!"));'
        .replace(/(\r\n|\n|\r)/gm, '')
        .replace(/ /g, '')
    );
  });

  test('Does not replaces referenced identifiers with console.log on a console.log call', () => {
    const code = 'const foo = 42; console.log(foo);';
    const transformed = autoConsole(code);
    expect(transformed).toBe(
      'const foo = 42; console.log(foo);'
        .replace(/(\r\n|\n|\r)/gm, '')
        .replace(/ /g, '')
    );
  });

  test('Does not replace binary expressions with console.log on variable declarations', () => {
    const code = 'const sum = 1 + 2; console.log(sum);';
    const transformed = autoConsole(code);
    expect(transformed).toBe(
      'const sum = 1 + 2; console.log(sum);'
        .replace(/(\r\n|\n|\r)/gm, '')
        .replace(/ /g, '')
    );
  });

  test("Add console.log to a declarated variable that's not using console.log", () => {
    const code = 'const a = 1; a;';
    const transformed = autoConsole(code);
    expect(transformed).toBe(
      'const a = 1; console.log(a);'
        .replace(/(\r\n|\n|\r)/gm, '')
        .replace(/ /g, '')
    );
  });

  test('Does not add console.log to a undeclarated variable', () => {
    const code = 'variable;';
    const transformed = autoConsole(code);
    expect(transformed).toBe(
      'variable;'.replace(/(\r\n|\n|\r)/gm, '').replace(/ /g, '')
    );
  });

  test('Do not add console.log to items that are inside a function.', () => {
    const code = 'function sayHi(){const hi = "hi"; hi;}';
    const transformed = autoConsole(code);
    expect(transformed).toBe(
      'function sayHi(){const hi = "hi"; hi;}'
        .replace(/(\r\n|\n|\r)/gm, '')
        .replace(/ /g, '')
    );
  });

  test('Add console.log to a mathematical operation.', () => {
    const code = '1+1;';
    const transformed = autoConsole(code);
    expect(transformed).toBe(
      'console.log(1+1);'.replace(/(\r\n|\n|\r)/gm, '').replace(/ /g, '')
    );
  });

  test('Add console.log to a mathematical operation with a variable.', () => {
    const code = 'const n = 3; 1+n;';
    const transformed = autoConsole(code);
    expect(transformed).toBe(
      'const n = 3; console.log(1+n);'
        .replace(/(\r\n|\n|\r)/gm, '')
        .replace(/ /g, '')
    );
  });

  test('Replace non-console.log calls with console.log inside an if statement', () => {
    const code = 'if (true) { alert("Hello, world!"); }';
    const transformed = autoConsole(code);
    expect(transformed).toBe(
      'if (true) { console.log(alert("Hello, world!")); }'
        .replace(/(\r\n|\n|\r)/gm, '')
        .replace(/ /g, '')
    );
  });

  test('Replace non-console.log calls with console.log', () => {
    const code = 'someFunction(alert("Hello, world!"));';
    const transformed = autoConsole(code);
    expect(transformed).toBe(
      'console.log(someFunction(alert("Hello, world!")));'
        .replace(/(\r\n|\n|\r)/gm, '')
        .replace(/ /g, '')
    );
  });

  test('Replace non-console.log calls with console.log inside a class', () => {
    const code = 'class MyClass { method() { alert("Hello, world!"); } }';
    const transformed = autoConsole(code);
    expect(transformed).toBe(
      'class MyClass { method() { console.log(alert("Hello, world!")); } }'
        .replace(/(\r\n|\n|\r)/gm, '')
        .replace(/ /g, '')
    );
  });

  test('Replace non-console.log calls with console.log inside a try-catch block', () => {
    const code =
      'try { alert("Hello, world!"); } catch (e) { console.error(e); }';
    const transformed = autoConsole(code);
    expect(transformed).toBe(
      'try { console.log(alert("Hello, world!")); } catch (e) { console.error(e); }'
        .replace(/(\r\n|\n|\r)/gm, '')
        .replace(/ /g, '')
    );
  });

  test('Replace non-console.log calls with console.log inside a while loop', () => {
    const code = 'while (true) { alert("Hello, world!"); }';
    const transformed = autoConsole(code);
    expect(transformed).toBe(
      'while (true) { console.log(alert("Hello, world!")); }'
        .replace(/(\r\n|\n|\r)/gm, '')
        .replace(/ /g, '')
    );
  });

  test('Replace non-console.log calls with console.log inside a for loop', () => {
    const code = 'for (let i = 0; i < 10; i++) { alert("Hello, world!"); }';
    const transformed = autoConsole(code);
    expect(transformed).toBe(
      'for (let i = 0; i < 10; i++) { console.log(alert("Hello, world!")); }'
        .replace(/(\r\n|\n|\r)/gm, '')
        .replace(/ /g, '')
    );
  });

  test('Replace non-console.log calls with console.log inside a do-while loop', () => {
    const code = 'do { alert("Hello, world!"); } while (true);';
    const transformed = autoConsole(code);
    expect(transformed).toBe(
      'do { console.log(alert("Hello, world!")); } while (true);'
        .replace(/(\r\n|\n|\r)/gm, '')
        .replace(/ /g, '')
    );
  });
  test('Does not add console.log to an arrow function expression', () => {
    const code = 'const add = (a, b) => a + b;';
    const transformed = autoConsole(code);
    expect(transformed).toBe(
      'const add = (a, b) => a + b;'
        .replace(/(\r\n|\n|\r)/gm, '')
        .replace(/ /g, '')
    );
  });

  test('Does not add console.log to a function declaration', () => {
    const code = 'function multiply(a, b) {return a * b;}';
    const transformed = autoConsole(code);
    expect(transformed).toBe(
      'function multiply(a, b) {return a * b;}'
        .replace(/(\r\n|\n|\r)/gm, '')
        .replace(/ /g, '')
    );
  });

  test('Does not add console.log to a variable declarator', () => {
    const code = 'const str = "hello";';
    const transformed = autoConsole(code);
    expect(transformed).toBe(
      'const str = "hello";'.replace(/(\r\n|\n|\r)/gm, '').replace(/ /g, '')
    );
  });

  test('Add console.log to a ternary expression', () => {
    const code = 'const a = 1; const b = 2; a < b ? a : b;';
    const transformed = autoConsole(code);
    expect(transformed).toBe(
      'const a = 1; const b = 2; console.log(a < b ? a : b);'
        .replace(/(\r\n|\n|\r)/gm, '')
        .replace(/ /g, '')
    );
  });

  test('Doesnt add console.log to a variable declaration with a ternary expression', () => {
    const code = 'const a = 1; const b = 2; const min = a < b ? a : b;';
    const transformed = autoConsole(code);
    expect(transformed).toBe(
      'const a = 1; const b = 2; const min = a < b ? a : b;'
        .replace(/(\r\n|\n|\r)/gm, '')
        .replace(/ /g, '')
    );
  });

  test('Doesnt add console.log to a variable inside a switch statement', () => {
    const code = 'const a = 1; switch(a){}';
    const transformed = autoConsole(code);
    expect(transformed).toBe(
      'const a = 1; switch(a){}'.replace(/(\r\n|\n|\r)/gm, '').replace(/ /g, '')
    );
  });

  test('Doesnt add console.log to a variable inside a if statement', () => {
    const code = 'const a = 1; if(a){}';
    const transformed = autoConsole(code);
    expect(transformed).toBe(
      'const a = 1; if(a){}'.replace(/(\r\n|\n|\r)/gm, '').replace(/ /g, '')
    );
  });

  test('Add console.log to a variable inside a case statement', () => {
    const code = 'const a = 1; switch(a){ case 1: a }';
    const transformed = autoConsole(code);
    expect(transformed).toBe(
      'const a = 1; switch(a){ case 1: console.log(a); }'
        .replace(/(\r\n|\n|\r)/gm, '')
        .replace(/ /g, '')
    );
  });

  test('Add console.log to a multiple mathematical operations', () => {
    const code = '2+2/2*4-5';
    const transformed = autoConsole(code);
    expect(transformed).toBe(
      'console.log(2+2/2*4-5);'.replace(/(\r\n|\n|\r)/gm, '').replace(/ /g, '')
    );
  });

  test('Doesnt add console.log to a binary expression in a if statement', () => {
    const code = 'const a = 1; if(a===2){a}';
    const transformed = autoConsole(code);
    expect(transformed).toBe(
      'const a = 1; if(a===2){console.log(a);}'
        .replace(/(\r\n|\n|\r)/gm, '')
        .replace(/ /g, '')
    );
  });

  test('Add console.log to a binary expression outside a statement', () => {
    const code = '1 === 2';
    const transformed = autoConsole(code);
    expect(transformed).toBe(
      'console.log(1===2);'.replace(/(\r\n|\n|\r)/gm, '').replace(/ /g, '')
    );
  });

  test('Add console.log to a logical expression outside a statement', () => {
    const code = 'const a = 0; a || 2';
    const transformed = autoConsole(code);
    expect(transformed).toBe(
      'const a = 0; console.log(a||2);'
        .replace(/(\r\n|\n|\r)/gm, '')
        .replace(/ /g, '')
    );
  });

  test('Doesnt add console.log to a logical combination expression inside a if statement', () => {
    const code = 'if(10 === 20 || 20 === 30 && 30 > 0){}';
    const transformed = autoConsole(code);
    expect(transformed).toBe(
      'if(10 === 20 || 20 === 30 && 30 > 0){}'
        .replace(/(\r\n|\n|\r)/gm, '')
        .replace(/ /g, '')
    );
  });
});
