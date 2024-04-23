
# Renderer


### 概述

组件渲染器

可以将满足组件描述协议的组件渲染到 Canvas 上

```json
{
  "name": "组件名",
  "label": "组件中文名",
  "props": {
    "属性名": {
      "label": "属性中文名",
      "type": "属性type,string,boolean,number,object,jsx,array,function",
      "typeProps": {},
      "defaultValue": "属性默认值"
    }
  }
}
```

```json
{
  "name": "",
  "variable": {
    "name": "",
    "valueCode": ""
  },
  "state": [
    {
      "name": "状态名称",
      "setStateName": "设置状态方法"
    }
  ],
  "hooks": [
    {
      "name": "hooks名称",
      "functionCode": "",
      "dependencies": [],
      "returnVariableName": "返回值名称"
    }
  ],
  "props": {
    "children": [
      {
        "name": ""
      }
    ]
  }
}
```


### 示例

#### 示例代码

- 这里填写示例标题
- 这里填写示例说明
- _Renderer(@components/Renderer)

```jsx
const { default: Renderer } = _Renderer;
const BaseExample = () => {
  return (<Renderer
      content={{
        states: {
          open: {
            initValue: true, setStateName: 'setOpen'
          }
        }, variables: {
          hello: 'HELLO', world: 'WORLD'
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

