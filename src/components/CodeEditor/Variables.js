import { useState } from 'react';
import transform from 'lodash/transform';
import clone from 'lodash/clone';
import { createWithRemoteLoader } from '@kne/remote-loader';
import { Button, Col, Empty, Row } from 'antd';
import style from './style.module.scss';
import MonacoEditor from '@monaco-editor/react';

const variableToString = value => {
  return JSON.stringify(value, null, 2);
};

const VariableCode = ({ value, children }) => {
  const [list, setList] = useState(
    new Map(
      Object.keys(value).map(key => {
        return [key, { id: key, code: variableToString(value[key]) }];
      })
    )
  );
  const [current, setCurrent] = useState(Array.from(list.keys())[0]);
  const [error, setError] = useState(null);

  return children({
    list,
    value: transform(
      Array.from(list.values()),
      (result, value) => {
        const { id, code } = value;
        result[id] = JSON.parse(code);
      },
      {}
    ),
    error,
    current,
    setCurrent,
    onCodeChange: code => {
      try {
        const newList = clone(list);
        const func = new Function(`${code} return ${current};`);
        newList.set(current, { id: current, code: variableToString(func()) });
        setList(newList);
        setError(null);
      } catch (e) {
        setError(e);
      }
    },
    onAdd: key => {
      const newList = clone(list);
      newList.set(key, { id: key, code: `"Variable"` });
      setList(newList);
      if (!current) {
        setCurrent(key);
      }
    },
    onRemove: key => {
      const newList = clone(list);
      newList.delete(key);
      setList(newList);
      if (key === current) {
        setCurrent(newList.keys()[0]);
      }
    }
  });
};

const Variables = createWithRemoteLoader({
  modules: [
    'components-core:Modal@useModal',
    'components-core:FormInfo',
    'components-core:FormInfo@useFormModal',
    'components-core:Menu',
    'components-core:Icon',
    'components-core:ConfirmButton',
    'components-core:Common@SimpleBar'
  ]
})(({ value, onChange, remoteModules }) => {
  const [useModal, FormInfo, useFormModal, Menu, Icon, ConfirmButton, SimpleBar] = remoteModules;
  const modal = useModal();
  const formModal = useFormModal();
  const { Input } = FormInfo.fields;

  return (
    <Button
      onClick={() => {
        modal({
          title: '变量管理',
          size: 'large',
          disabledScroller: true,
          withDecorator: render => {
            return <VariableCode value={value}>{props => render(props)}</VariableCode>;
          },
          rightOptions: ({ list, current, setCurrent, onRemove }) => (
            <SimpleBar
              style={{
                height: 'calc(95vh - 210px)'
              }}
            >
              <Menu
                currentKey={current}
                items={Array.from(list.keys()).map(key => {
                  return {
                    key,
                    label: (
                      <Row>
                        <Col span={22}>{key}</Col>
                        <Col span={2}>
                          <ConfirmButton
                            isModal
                            type="text"
                            className="btn-no-padding"
                            onClick={() => {
                              onRemove(key);
                            }}
                          >
                            <Icon type="icon-shanchu" />
                          </ConfirmButton>
                        </Col>
                      </Row>
                    )
                  };
                })}
                onChange={setCurrent}
              />
            </SimpleBar>
          ),
          footer: ({ onAdd }) => {
            return (
              <Button
                type="link"
                onClick={() => {
                  const addModalApi = formModal({
                    title: '添加变量',
                    size: 'small',
                    formProps: {
                      onSubmit: data => {
                        onAdd(data.name);
                        addModalApi.close();
                      }
                    },
                    children: <FormInfo column={1} list={[<Input name="name" label="变量名" rule="REQ LEN-0-100" />]} />
                  });
                }}
              >
                添加变量
              </Button>
            );
          },
          children: ({ current, list, onCodeChange, error }) => (
            <div className={style['code-editor']}>
              {(() => {
                if (list.length === 0) {
                  return <Empty />;
                }
                const item = list.get(current);
                if (!item) {
                  return <Empty style={{ height: 'calc(95vh - 210px)' }} />;
                }
                return (
                  <MonacoEditor
                    key={current}
                    height="calc(95vh - 210px)"
                    defaultLanguage="javascript"
                    defaultValue={`const ${item.id} = ${item.code || '""'};`}
                    loading="正在加载代码编辑器..."
                    onChange={onCodeChange}
                  />
                );
              })()}
              {error ? <div className={style['code-error']}>{error && <pre>{error.message}</pre>}</div> : null}
            </div>
          ),
          onConfirm: (e, props) => {
            onChange?.(props.value);
          }
        });
      }}
    >
      变量
    </Button>
  );
});

export default Variables;
