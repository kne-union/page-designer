import style from './style.module.scss';
import { createWithRemoteLoader } from '@kne/remote-loader';
import classnames from 'classnames';
import 'devices.css/dist/devices.css';

const Device = createWithRemoteLoader({
  modules: ['components-core:Common@SimpleBar']
})(({ className, name, children, remoteModules }) => {
  const [SimpleBar] = remoteModules;
  return (
    <div className={classnames(className, style['device-outer'])}>
      <div className={classnames(`device-${name}`, 'device-location')}>
        <div className={classnames(`device device-${name}`, style['device-display'])}>
          <div className="device-frame">
            <div className={classnames('device-screen', style['device-content'])}></div>
          </div>
          <div className="device-stripe"></div>
          <div className="device-header"></div>
          <div className="device-sensors"></div>
          <div className="device-btns"></div>
          <div className="device-power"></div>
          <div className="device-home"></div>
        </div>
        <div className={classnames(`device-${name}`, style['device-children'])}>
          <div className="device-frame">
            <div className={classnames('device-screen')}>
              <div className={classnames('device-header', style['device-header'])} />
              <SimpleBar className={style['device-view']}>{children}</SimpleBar>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

Device.defaultProps = {
  name: 'iphone-14-pro'
};

export default Device;

export { default as deviceList } from './deviceList';
