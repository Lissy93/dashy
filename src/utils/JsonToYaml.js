import { typeOf } from 'remedial';

const trimWhitespace = (input) => input.split('\n').map(x => x.trimRight()).join('\n');

const throwError = (msg) => {
  throw new Error(`Error in Json to YAML conversion: ${msg}`);
};

/* A function that converts valid JSON into valid YAML */
const stringify = (data) => {
  let indentLevel = '';
  const handlers = {
    undefined() {
      return 'null';
    },
    null() {
      return 'null';
    },
    number(x) {
      return x;
    },
    boolean(x) {
      return x ? 'true' : 'false';
    },
    string(x) {
      return JSON.stringify(x);
    },
    array(x) {
      let output = '';
      if (x.length === 0) {
        output += '[]';
        return output;
      }

      indentLevel = indentLevel.replace(/$/, '  ');
      x.forEach((y) => {
        const handler = handlers[typeOf(y)];

        if (!handler) throwError(typeOf(y));

        output += `\n${indentLevel}- ${handler(y, true)}`;
      });
      indentLevel = indentLevel.replace(/ {2}/, '');

      return output;
    },
    object(x, inArray, rootNode) {
      let output = '';

      if (Object.keys(x).length === 0) {
        output += '{}';
        return output;
      }

      if (!rootNode) {
        indentLevel = indentLevel.replace(/$/, '  ');
      }

      Object.keys(x).forEach((k, i) => {
        const val = x[k];
        const handler = handlers[typeOf(val)];

        if (typeof val === 'undefined') {
          return;
        }

        if (!handler) throwError(typeOf(val));

        if (!(inArray && i === 0)) {
          output += `\n${indentLevel}`;
        }

        output += `${k}: ${handler(val)}`;
      });
      indentLevel = indentLevel.replace(/ {2}/, '');

      return output;
    },
    function() {
      return '[object Function]';
    },
  };

  return trimWhitespace(`${handlers[typeOf(data)](data, true, true)}\n`);
};

export default stringify;
