import classnames from 'classnames';
import { useEffect, useRef, useState } from 'react';
import { Popover } from 'antd';
import { Provider } from '@kne/global-context';
import useRefCallback from '@kne/use-ref-callback';
import { computedSelectedArea } from './utils';
import ComponentsDrag from './ComponentsDrag';
import ComponentsSelected from './ComponentsSelected';
import DesignerItemMenu from './DesignerItemMenu';
import style from './style.module.scss';

const Canvas = ({ className, children, onActiveChange, onLockedChange, onRemove, onCopy }) => {
  const ref = useRef(null);
  const [active, setActive] = useState({});
  const [hover, setHover] = useState({});

  const activeRef = useRef(active);

  const getCanvasContainer = useRefCallback(() => {
    return ref.current;
  });

  const setDesignerActive = useRefCallback(id => {
    const root = getCanvasContainer();
    const activeElement = root.querySelector(`[data-designer-id="${id}"]`);
    if (!activeElement) {
      setActive({});
      return;
    }
    setActive(computedSelectedArea(activeElement, root, false));
  });

  const activeChangeHandler = useRefCallback(onActiveChange);
  const lockedChangeHandler = useRefCallback(onLockedChange);
  const removeHandler = useRefCallback(() => {
    setActive({});
    active?.activeDesignerId && onRemove?.(active?.activeDesignerId);
  });

  const copyHandler = useRefCallback(() => {
    if (!active?.activeDesignerId) {
      return;
    }
    onCopy?.(active?.activeDesignerId);
  });

  const lockChange = useRefCallback(() => {
    if (!active?.activeDesignerId) {
      return;
    }

    setActive(active => {
      return Object.assign({}, active, {
        isLocked: !active.isLocked
      });
    });
  });

  useEffect(() => {
    if (activeRef.current?.activeDesignerId !== active?.activeDesignerId) {
      activeRef.current = active;
      activeChangeHandler(active.activeDesignerId);
    }
    if (activeRef.current?.activeDesignerId === active.activeDesignerId && activeRef.current?.isLocked !== active?.isLocked) {
      lockedChangeHandler(active.activeDesignerId, active.isLocked);
    }
  }, [active, activeChangeHandler, lockedChangeHandler]);

  return (
    <Provider value={{ active, setActive, hover, setHover, getCanvasContainer }}>
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
            content={
              <DesignerItemMenu
                id={active.activeDesignerId}
                nextId={active.nextDesignerId}
                parentId={active.parentDesignerId}
                prevId={active.prevDesignerId}
                firstChildId={active.firstChildDesignerId}
                isLocked={active.isLocked}
                apis={{
                  setDesignerActive,
                  lockChange,
                  remove: removeHandler,
                  copy: copyHandler
                }}
              />
            }
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
