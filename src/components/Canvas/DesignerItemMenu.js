import { Divider, Space } from 'antd';
import { CopyOutlined, DeleteOutlined, LockOutlined, ToTopOutlined, UnlockOutlined } from '@ant-design/icons';
import style from './style.module.scss';

const DesignerItemMenu = ({ id, prevId, nextId, firstChildId, parentId, isLocked, apis }) => {
  return (
    <Space className={style['designer-item-menu']} size={4} split={<Divider type="vertical" />}>
      <div>{id}</div>
      <Space size={10}>
        {prevId ? (
          <div>
            <ToTopOutlined
              style={{
                transform: 'rotate(-90deg)'
              }}
              onClick={() => {
                apis.setDesignerActive(prevId);
              }}
            />
          </div>
        ) : null}
        <div>
          <ToTopOutlined
            onClick={() => {
              apis.setDesignerActive(parentId);
            }}
          />
        </div>
        {firstChildId ? (
          <div>
            <ToTopOutlined
              style={{
                transform: 'rotate(180deg)'
              }}
              onClick={() => {
                apis.setDesignerActive(firstChildId);
              }}
            />
          </div>
        ) : null}
        {nextId ? (
          <div>
            <ToTopOutlined
              style={{
                transform: 'rotate(90deg)'
              }}
              onClick={() => {
                apis.setDesignerActive(nextId);
              }}
            />
          </div>
        ) : null}
      </Space>
      <Space size={10}>
        <div>{isLocked ? <LockOutlined onClick={apis.lockChange} /> : <UnlockOutlined onClick={apis.lockChange} />}</div>
        <div>
          <CopyOutlined onClick={apis.copy} />
        </div>
        <div>
          <DeleteOutlined onClick={apis.remove} />
        </div>
      </Space>
    </Space>
  );
};

export default DesignerItemMenu;
