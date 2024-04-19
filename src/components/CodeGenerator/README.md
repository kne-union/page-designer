
# CodeGenerator


### 概述

用于将配置文件生成代码并预览


### 示例

#### 示例代码

- 这里填写示例标题
- 这里填写示例说明
- _CodeGenerator(@components/CodeGenerator),_CoreEditor(@monaco-editor/react)

```jsx
const { default: CodeGenerator } = _CodeGenerator;
const { default: CoreEditor } = _CoreEditor;
const BaseExample = () => {
  return (<CodeGenerator
      {...{
        componentName: 'CodeGenerator', states: {
          open: {
            initValue: true, setStateName: 'setOpen'
          }
        }, variables: {
          hello: 'HELLO', world: 'WORLD', num: 2023
        }, functions: {
          say: 'console.log($args[0])',
          sayHello: '$functions.say($lib.lodash.get($variables,"hello")+" "+$variables.world);'
        }, data: [{
          component: 'Container', props: {
            children: [{
              component: 'Container', props: {
                children: '第一个子节点', onClick: '$functions.sayHello'
              }
            }, {
              component: 'Container', props: {
                children: '第二个子节点', onClick: '$functions.sayHello'
              }
            }, {
              component: 'Container', props: {
                children: '$variables.hello'
              }
            }, {
              component: 'Container', props: {
                children: '$exec(1+1+$variables.hello)'
              }
            }, {
              component: 'Container', props: {
                children: '$exec($variables.open?"开":"关")'
              }
            }, {
              component: 'Button', props: {
                children: '切换', onClick: '$exec(()=>$functions.setOpen(!$variables.open))'
              }
            }, {
              component: 'LoadingButton', props: {
                children: '加载按钮', onClick: '$exec(()=>new Promise((resolve)=>{setTimeout(resolve,1000);}))'
              }
            }, {
              component: 'Global', props: {
                children: {
                  component: 'Form', props: {
                    onSubmit: '$exec((data)=>console.log(data))', children: {
                      component: 'FormInfo', props: {
                        title: '基本信息', list: [{
                          component: 'Input', props: {
                            label: '姓名', name: 'name', rule: 'REQ'
                          }
                        }, {
                          component: 'Input', props: {
                            label: '电话', name: 'phone', rule: 'TEL', block: true
                          }
                        }, {
                          component: 'SubmitButton', props: {
                            children: '提交'
                          }
                        }]
                      }
                    }
                  }
                }
              }
            }, {
              component: 'Global', props: {
                children: {
                  component: 'Layout', props: {
                    navigation: { isFixed: false }
                  }
                }
              }
            }]
          }
        }]
      }}
    />);
};

render(<BaseExample />);

```


### API

| 属性名 | 说明 | 类型 | 默认值 |
| ------ | ---- | ---- | ------ |

