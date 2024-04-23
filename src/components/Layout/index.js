import { Col, ConfigProvider, Row, Select } from 'antd';
import classnames from 'classnames';
import Device, { deviceList } from '@components/Device';
import style from './style.module.scss';
import 'devices.css/dist/devices.css';
import { useState } from 'react';

const Layout = ({ className, navOption, menu, tools, children }) => {
  const [name, setName] = useState('desktop');
  return (
    <ConfigProvider>
      <div className={classnames(className, style['layout'])}>
        <Row className={style['top-bar']} justify="space-between" align="middle">
          <Col></Col>
          <Col>
            <Select
              size="small"
              style={{ width: '150px' }}
              value={name}
              onChange={setName}
              options={deviceList.map(([value, label]) => {
                return { label, value };
              })}
            />
          </Col>
          <Col>{navOption}</Col>
        </Row>
        <Row className={style['main']}>
          <Col className={style['menu']} flex={'348px'}>
            {menu}
          </Col>
          <Col flex={1} className={style['canvas']}>
            <div className={classnames(style['page'])}>
              <Device className={style['device']} name={name}>
                {children}
              </Device>
            </div>
          </Col>
          <Col className={style['props']}>{tools}</Col>
        </Row>
      </div>
    </ConfigProvider>
  );
};

export default Layout;
