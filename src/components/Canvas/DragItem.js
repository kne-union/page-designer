import { useGlobalContext as useContext } from '@kne/global-context';
import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { depthCloneElement } from './utils';
import style from './style.module.scss';

const DragItem = () => {
  const { active } = useContext();
  const activeRef = useRef({});
  activeRef.current = active;
  const ref = useRef(null);
  useEffect(() => {
    const active = activeRef.current;
    const activeElement = document.querySelector(`[data-designer-id="${active.activeDesignerId}"]`);
    ref.current.appendChild(depthCloneElement(activeElement));
    return () => {};
  }, []);
  return createPortal(
    <div
      ref={ref}
      className={style['drag-item']}
      style={{
        '--left': active.dragLocation.x + 'px',
        '--top': active.dragLocation.y + 'px'
      }}
    />,
    document.body
  );
};

export default DragItem;
