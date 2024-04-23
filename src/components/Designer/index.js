import { useState } from 'react';
import Layout from '@components/Layout';
import Canvas from '@components/Canvas';
import CodeEditor from '@components/CodeEditor';
import { Button, Col, Row } from 'antd';

const Designer = () => {
  const [content, setContent] = useState({
    states: {},
    variables: {
      hello: 'HELLO',
      world: 'WORLD'
    },
    functions: {
      test: 'console.log("test");',
      test2: 'console.log("test2");'
    },
    data: []
  });

  return (
    <Layout
      navOption={<CodeEditor value={{ states: content.states, variables: content.variables, functions: content.functions }} onChange={setContent} />}
    >
      <Canvas>
        <div className="designer-node" data-designer-id="div-0">
          <Row className="designer-node" data-designer-id="row-0">
            <Col className="designer-node" data-designer-id="col-0">
              <Button className="designer-node" data-designer-id="button-0">
                我是一个按钮
              </Button>
            </Col>
            <Col className="designer-node" data-designer-id="col-1">
              <Button className="designer-node" data-designer-id="button-2">
                我是一个按钮
              </Button>
            </Col>
            <Col className="designer-node designer-node-lock" data-designer-id="col-2">
              哈哈哈哈
              <Button className="designer-node" data-designer-id="button-3">
                我是一个按钮
              </Button>
            </Col>
          </Row>
          <Button>非designer-node</Button>
        </div>
      </Canvas>
    </Layout>
  );
};

export default Designer;
