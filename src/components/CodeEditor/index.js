import { Button, Space } from 'antd';
import { createWithRemoteLoader } from '@kne/remote-loader';
import Functions from './Functions';

const CodeEditor = createWithRemoteLoader({
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
  const [useModal] = remoteModules;
  const modal = useModal();
  return (
    <Space.Compact size="small">
      <Button
        onClick={() => {
          modal({
            title: '状态管理'
          });
        }}
      >
        状态
      </Button>
      <Button
        onClick={() => {
          modal({
            title: '变量管理'
          });
        }}
      >
        变量
      </Button>
      <Functions
        value={value.functions}
        onChange={newFunction => {
          onChange?.(Object.assign({}, value, { functions: newFunction }));
        }}
      />
    </Space.Compact>
  );
});

export default CodeEditor;
