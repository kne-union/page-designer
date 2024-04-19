import classnames from 'classnames';
import { useRef, useState } from 'react';
import { Popover } from 'antd';
import { Provider } from '@kne/global-context';
import { computedSelectedArea } from './utils';
import ComponentsDrag from './ComponentsDrag';
import ComponentsSelected from './ComponentsSelected';
import DesignerItemMenu from './DesignerItemMenu';
import style from './style.module.scss';

const Canvas = ({ className, children }) => {
  const ref = useRef(null);
  const [active, setActive] = useState({});
  const [hover, setHover] = useState({});
  const setParentDesignerActive = () => {
    const activeElement = document.querySelector(`[data-designer-id="${active.activeDesignerId}"]`);
    setActive(computedSelectedArea(activeElement.parentElement, ref.current, false));
  };

  return (
    <Provider value={{ active, setActive, hover, setHover }}>
      <div ref={ref} className={classnames(style['canvas'], className)}>
        <div className={style['canvas-components']}>
          <ComponentsDrag>
            <ComponentsSelected>
              <div className={classnames(style['canvas-render'], 'canvas-render')}>{children}</div>
            </ComponentsSelected>
          </ComponentsDrag>
        </div>
        {active.activeDesignerId ? (
          <Popover
            key={active.activeDesignerId}
            getPopupContainer={() => ref.current}
            open
            arrow={false}
            overlayClassName={classnames(style['designer-item-menu-overlay'], {
              [style['is-drag']]: active.isDrag
            })}
            placement="bottomRight"
            content={<DesignerItemMenu id={active.activeDesignerId} apis={{ setParentDesignerActive }} />}
          >
            <div
              className={classnames(style['canvas-controller'], {
                [style['is-drag']]: active.isDrag
              })}
              style={{
                '--left': active.left + 'px',
                '--top': active.top + 'px',
                '--width': active.width + 'px',
                '--height': active.height + 'px'
              }}
            ></div>
          </Popover>
        ) : null}
        {active.sign && active.isDrag && (
          <div
            className={classnames(style['canvas-sign'])}
            style={{
              '--left': active.sign.left + 'px',
              '--top': active.sign.top + 'px',
              '--width': active.sign.width + 'px',
              '--height': active.sign.height + 'px'
            }}
          />
        )}
        {hover.activeDesignerId && !active.isDrag && (
          <div
            className={classnames(style['canvas-hover'])}
            style={{
              '--left': hover.left + 'px',
              '--top': hover.top + 'px',
              '--width': hover.width + 'px',
              '--height': hover.height + 'px'
            }}
          />
        )}
      </div>
    </Provider>
  );
};

export default Canvas;
