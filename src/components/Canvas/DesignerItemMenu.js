import { Col, Row } from 'antd';
import style from './style.module.scss';

const DesignerItemMenu = ({ id, apis }) => {
  return (
    <Row className={style['designer-item-menu']} wrap={false} gutter={4}>
      <Col>{id}</Col>
      <Col>返回上一级</Col>
      <Col>锁定</Col>
      <Col>复制</Col>
      <Col>删除</Col>
    </Row>
  );
};

export default DesignerItemMenu;
