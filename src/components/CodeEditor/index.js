import { Space } from 'antd';
import Functions from './Functions';
import Variables from './Variables';
import States from './States';

const CodeEditor = ({ value, onChange }) => {
  return (
    <Space.Compact size="small">
      <States
        value={value.states}
        onChange={newStates => {
          onChange?.(Object.assign({}, value, { states: newStates }));
        }}
      />
      <Variables
        value={value.variables}
        onChange={newVariables => {
          onChange?.(Object.assign({}, value, { variables: newVariables }));
        }}
      />
      <Functions
        value={value.functions}
        onChange={newFunctions => {
          onChange?.(Object.assign({}, value, { functions: newFunctions }));
        }}
      />
    </Space.Compact>
  );
};

export default CodeEditor;
