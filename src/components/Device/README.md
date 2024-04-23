
# Device


### 概述

用于显示一个模拟设备


### 示例

#### 示例代码

- 这里填写示例标题
- 这里填写示例说明
- _Device(@components/Device),antd(antd)

```jsx
const { default: Device, deviceList } = _Device;
const { Select, Space } = antd;
const { useState } = React;
const BaseExample = () => {
  const [name, setName] = useState('iphone-14-pro');
  return <Space direction="vertical">
    <Device name={name}>
      显示内容啊哈哈哈哈
    </Device>
    <Select style={{ width: '200px' }} value={name} onChange={setName} options={deviceList.map(([value, label]) => {
      return { label, value };
    })} />
  </Space>;
};

render(<BaseExample />);

```


### API

|属性名|说明|类型|默认值|
|  ---  | ---  | --- | --- |

