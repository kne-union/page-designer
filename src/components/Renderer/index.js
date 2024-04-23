import Fetch from '@kne/react-fetch';
import lodash, { merge, get, transform } from 'lodash';
import dayjs from 'dayjs';
import React, { useId, useEffect, useState } from 'react';
import ErrorBoundary from '@kne/react-error-boundary';
import { useContext, Provider } from './context';
import { titleCase } from './util';
import RemoteLoader from '@kne/remote-loader';
import { Button } from 'antd';

const ErrorMsg = ({ error }) => {
  useEffect(() => {
    console.error(error);
  }, [error]);
  return <div>渲染发生错误，请检查配置或回滚操作</div>;
};

const compileProps = ({ targetProp, context }) => {};

const Compile = ({ componentProps, profile }) => {
  const context = useContext();
  const TargetComponent = profile.component;
  const compileProps = {};

  const compileFunction =
    funcStr =>
    (...args) => {
      if (typeof funcStr === 'function') {
        return funcStr(...args);
      }
      const functions = transform(
        context.functions,
        (result, value, key) => {
          result[key] = compileFunction(value);
        },
        {}
      );
      // eslint-disable-next-line no-new-func
      return new Function('$args', '$lib', '$variables', '$functions', '$states', funcStr)(
        args,
        context.lib,
        context.variables,
        functions,
        context.states
      );
    };

  Object.keys(profile.props || {}).forEach(name => {
    const { type, typeProps, defaultValue } = profile.props[name];
    const targetProp = componentProps[name];

    if (typeof targetProp === 'string' && targetProp.indexOf('$lib.') === 0 && type === 'function') {
      compileProps[name] = compileFunction(get(context.lib, targetProp.replace(/^\$lib\./, '')));
      return;
    }

    if (typeof targetProp === 'string' && targetProp.indexOf('$components.') === 0 && type === 'jsx') {
      const rendererProps = {};
      const content = get(context.components, targetProp.replace(/^\$components\./, ''));
      typeof content === 'string' ? (rendererProps.url = content) : (rendererProps.content = content);
      compileProps[name] = <Renderer {...rendererProps} />;
      return;
    }

    if (typeof targetProp === 'string' && targetProp.indexOf('$variables.') === 0) {
      compileProps[name] = get(context.variables, targetProp.replace(/^\$variables\./, ''));
      return;
    }

    if (typeof targetProp === 'string' && /^\$exec\(.*\)$/.test(targetProp)) {
      const funcStr = targetProp.match(/^\$exec\((.*)\)$/)[1];
      compileProps[name] = compileFunction('return ' + funcStr)();
      return;
    }

    if (typeof targetProp === 'string' && targetProp.indexOf('$functions.') === 0 && type === 'function') {
      compileProps[name] = compileFunction(get(context.functions, targetProp.replace(/^\$functions\./, '')));
      return;
    }

    if (type === 'jsx' && typeof targetProp === 'object') {
      compileProps[name] = <RendererInner data={targetProp} />;
      return;
    }

    if (type === 'jsx' && typeof targetProp === 'string') {
      compileProps[name] = targetProp;
      return;
    }
    if (type === 'jsx') {
      compileProps[name] = <RendererInner data={defaultValue} />;
      return;
    }

    if (type === 'array' && get(typeProps, 'type') === 'jsx') {
      compileProps[name] = targetProp.map(props => <RendererInner data={props} />);
      return;
    }

    compileProps[name] = targetProp || defaultValue;
  });

  return <TargetComponent {...compileProps} />;
};

Compile.defaultProps = {
  componentProps: {},
  profile: {}
};

const CombineContext = ({ children, states, styles, ...props }) => {
  const [componentStates, setComponentStates] = useState(
    transform(
      states,
      (result, value, key) => {
        result[key] = value.initValue;
      },
      {}
    )
  );
  const prevContext = useContext();
  const id = useId();

  const currentContext = transform(
    states,
    (result, value, key) => {
      result.functions = Object.assign({}, result.functions, {
        [value.setStateName || `setState${titleCase(key)}`]: value => {
          return setComponentStates(object => {
            return Object.assign({}, object, { [key]: typeof value === 'function' ? value(object[key]) : value });
          });
        }
      });
      result.variables = Object.assign({}, result.variables, {
        [key]: componentStates[key]
      });
    },
    transform(
      ['components', 'lib', 'functions', 'variables'],
      (result, value) => {
        result[value] = Object.assign({}, get(prevContext, value), get(props, value));
      },
      { id, states: componentStates, parent: Object.assign({}, prevContext) }
    )
  );

  return (
    <ErrorBoundary errorComponent={ErrorMsg}>
      <Provider value={currentContext}>{children}</Provider>
    </ErrorBoundary>
  );
};

const RendererInner = ({ data, lib, functions, states, components, variables, styles }) => {
  const target = Array.isArray(data) ? data : [data];
  return (
    <CombineContext components={components} states={states} lib={lib} functions={functions} variables={variables} styles={styles}>
      {target.map((item, index) => {
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

        return <Compile key={index} componentProps={props} profile={profile} />;
      })}
    </CombineContext>
  );
};

RendererInner.defaultProps = {
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

const Renderer = ({ content, url, ...options }) => {
  if (!url) {
    return <RendererInner {...content} />;
  }
  return <Fetch {...options} url={url} render={({ data }) => <RendererInner content={merge({}, data, content)} />} />;
};

Renderer.defaultProps = {
  content: {}
};

Renderer.profiles = {
  Container: {
    component: ({ children, onClick }) => {
      return <div onClick={onClick}>{children}</div>;
    },
    props: {
      onClick: {
        type: 'function'
      },
      children: {
        type: 'jsx',
        defaultValue: '容器默认内容'
      }
    }
  },
  Button: {
    component: Button,
    props: {
      onClick: {
        type: 'function'
      },
      children: {
        type: 'jsx',
        defaultValue: '点击'
      }
    }
  },
  LoadingButton: {
    component: RemoteLoader,
    props: {
      module: {
        type: 'string',
        defaultValue: 'components-core:LoadingButton'
      },
      children: {
        type: 'jsx'
      },
      onClick: {
        type: 'function'
      }
    }
  },
  Form: {
    component: RemoteLoader,
    props: {
      module: {
        type: 'string',
        defaultValue: 'components-core:FormInfo@Form'
      },
      onSubmit: {
        type: 'function'
      },
      children: {
        type: 'jsx'
      }
    }
  },
  FormInfo: {
    component: RemoteLoader,
    props: {
      module: {
        type: 'string',
        defaultValue: 'components-core:FormInfo'
      },
      list: {
        type: 'array',
        typeProps: {
          type: 'jsx'
        }
      },
      title: {
        type: 'string'
      }
    }
  },
  Input: {
    component: RemoteLoader,
    props: {
      module: {
        type: 'string',
        defaultValue: 'components-core:FormInfo@Input'
      },
      name: {
        type: 'string'
      },
      label: {
        type: 'string'
      },
      rule: {
        type: 'string'
      }
    }
  },
  SubmitButton: {
    component: RemoteLoader,
    props: {
      module: {
        type: 'string',
        defaultValue: 'components-core:FormInfo@SubmitButton'
      },
      children: {
        type: 'jsx'
      },
      block: {
        type: 'boolean'
      }
    }
  },
  Global: {
    component: RemoteLoader,
    props: {
      module: {
        type: 'string',
        defaultValue: 'components-core:Global@PureGlobal'
      },
      children: {
        type: 'jsx'
      }
    }
  },
  Layout: {
    component: RemoteLoader,
    props: {
      module: {
        type: 'string',
        defaultValue: 'components-core:Layout'
      },
      children: {
        type: 'jsx'
      },
      navigation: {
        type: 'object'
      }
    }
  }
};

export default Renderer;
