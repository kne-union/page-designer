
# Canvas


### 概述

实现拖拽布局画布


### 示例

#### 示例代码

- 这里填写示例标题
- 这里填写示例说明
- _Canvas(@components/Canvas),antd(antd)

```jsx
const { default: Canvas } = _Canvas;
const { Button, Row, Col } = antd;
const BaseExample = () => {
  return (
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
  );
};

render(<BaseExample />);

```


### API

| 属性名 | 说明 | 类型 | 默认值 |
| ------ | ---- | ---- | ------ |

