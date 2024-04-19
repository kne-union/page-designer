import style from './style.module.scss';
import { titleCase } from '../Renderer/util';
import Renderer from '../Renderer';
import React from 'react';
import lodash from 'lodash';
import dayjs from 'dayjs';

const getStatesWithInitValue = states => Object.keys(states).map(key => `const [${key}, ${states[key]?.setStateName || `set${titleCase(key)}`}] = useState(${states[key]?.initValue || null});\n`);

const getVariables = ({ variables }) => {
  return Object.keys(variables)?.length ? `const variables = {${Object.keys(variables).map(key => `\n${key}: ${typeof variables[key] === 'string' ? `'${variables[key]}'` : variables[key]}`)}\n};\n` : '';
};

const getStringChildren = (val, states, noBrace) => {
  let tempVal = val.toString();
  const includeLib = tempVal.indexOf('$lib.') > -1;
  const includeVariables = tempVal.indexOf('$variables.') > -1;
  const includeExec = /^\$exec\(.*\)$/.test(tempVal);
  if (includeLib) {
    tempVal = `${tempVal.replace(/\$lib\./g, '')}`;
  }
  (states ? Object.keys(states) : []).forEach(statesKey => {
    if (tempVal.indexOf(`$variables.${statesKey}`) > -1) {
      tempVal = `${tempVal.replace(/\$variables\./g, '')}`;
    } else if (tempVal.indexOf('$variables.') > -1) {
      tempVal = `${tempVal.replace(/\$variables/g, 'variables')}`;
    }
  });
  if (includeExec) {
    tempVal = `${tempVal.match(/^\$exec\((.*)\)$/)[1]}`;
  }
  return (includeLib || includeVariables || includeExec) && !noBrace ? `{${tempVal}}` : tempVal;
};

const getFunc = (func, states, noBrace) => {
  let tempFunc = func.toString();
  if (tempFunc.indexOf('$functions.') > -1) {
    tempFunc = tempFunc.replace(/\$functions\./, '');
  }
  tempFunc = getStringChildren(tempFunc, states, noBrace);
  return tempFunc;
};

const getFunctions = ({ functions, states }) =>
  (Object.keys(functions) || []).map(functionName => {
    let func = getFunc(functions[functionName], states);
    return `const ${functionName} = (...$args) => {
    ${func}\n};\n`;
  });

const getCompile = ({ target, states, withComma }) => {
  if (typeof target === 'string') {
    return target;
  }
  return (Array.isArray(target) ? target : [target])
    .map(item => {
      if (typeof item === 'string') {
        return item;
      }
      const { component, props } = item;
      const profile = Renderer.profiles[component];
      if (!profile) {
        return null;
      }

      const targetComponent = profile.component;

      if (!targetComponent) {
        return null;
      }
      if (profile.props?.module) {
        return (
          `\n<RemoteLoader
module="${profile.props.module.defaultValue}"` +
          `${props?.onClick ? `\nonClick={${getFunc(props.onClick, states, true)}}` : ''}` +
          `${props?.onSubmit ? `\nonSubmit={${getFunc(props.onSubmit, states, true)}}` : ''}` +
          `${props?.list ? `\nlist={[${getCompile({ target: props.list, states, withComma: true })}]}` : ''}` +
          `${props ? `\n{...${JSON.stringify(lodash.omit(props, ['list', 'children', 'onClick', 'onSubmit']))}}` : ''}
>` +
          `${typeof props.children === 'string' ? getStringChildren(props.children, states) : props.children ? getCompile({ target: props.children, states }) : ''}
</RemoteLoader>${withComma ? ',' : ''}`
        );
      } else {
        return `\n<${component === 'Container' ? 'div' : component} ${props?.onClick ? `onClick={${getFunc(props.onClick, states, true)}}` : ''}>
${typeof props.children === 'string' ? getStringChildren(props.children, states) : props.children ? getCompile({ target: props.children, states }) : ''}
</${component === 'Container' ? 'div' : component}>`;
      }
    })
    .join('');
};

const CodeGenerator = ({ componentName, data, functions, states, variables }) => {
  const target = Array.isArray(data) ? data : [data];

  return (
    <div className={style['code-wrapper']}>
      {`import React, { useState } from "react";
import lodash from "lodash";
import RemoteLoader from "@kne/remote-loader";
import dayjs from "dayjs";\n
const ${componentName || 'Example'} = () => {\n`}
      {getStatesWithInitValue(states)}
      {getVariables({ variables })}
      {getFunctions({ functions, states })}
      {`return (<>`}
      {getCompile({ target, states })}
      {`\n</>)\n};\n\n`}
      {`export default ${componentName || 'Example'};`}
    </div>
  );
};

CodeGenerator.defaultProps = {
  data: [],
  states: [],
  functions: {},
  components: {},
  variables: {},
  styles: {},
  lib: Object.assign(
    {},
    {
      react: React,
      lodash,
      dayjs
    }
  )
};

export default CodeGenerator;
