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
