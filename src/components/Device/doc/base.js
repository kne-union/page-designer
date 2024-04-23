const { default: Device, deviceList } = _Device;
const { Select, Space } = antd;
const { useState } = React;
const BaseExample = () => {
  const [name, setName] = useState('iphone-14-pro');
  return (
    <Space direction="vertical">
      <Device name={name}>显示内容啊哈哈哈哈</Device>
      <Select
        style={{ width: '200px' }}
        value={name}
        onChange={setName}
        options={deviceList.map(([value, label]) => {
          return { label, value };
        })}
      />
    </Space>
  );
};

render(<BaseExample />);
