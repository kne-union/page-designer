import { useGlobalContext as useContext } from '@kne/global-context';
import { useEffect, useRef } from 'react';
import { locationInElement, depthCloneElement, computedSelectedArea } from './utils';
import DragItem from './DragItem';

const ComponentsDrag = ({ children }) => {
  const { active, setActive } = useContext();
  const ref = useRef(null);
  const activeRef = useRef({});
  activeRef.current = active;
  useEffect(() => {
    const currentElement = ref.current,
      componentsElement = currentElement.querySelector('.canvas-render');
    const startHandler = e => {
      const active = activeRef.current;
      if (!active.activeDesignerId) {
        return;
      }
      const activeElement = document.querySelector(`[data-designer-id="${active.activeDesignerId}"]`);
      if (!activeElement) {
        return;
      }
      if (!locationInElement({ x: e.pageX, y: e.pageY }, activeElement)) {
        return;
      }
      setActive(active => {
        return Object.assign({}, active, {
          dragStart: { x: e.pageX, y: e.pageY },
          dragLocation: { x: e.pageX, y: e.pageY },
          dragElement: depthCloneElement(activeElement)
        });
      });
    };
    const moveHandler = e => {
      const active = activeRef.current;
      if (!active.activeDesignerId) {
        return;
      }
      if (!active.dragStart) {
        return;
      }
      const activeElement = document.querySelector(`[data-designer-id="${active.activeDesignerId}"]`);
      if (!activeElement) {
        return;
      }
      setActive(active => {
        return Object.assign({}, active, {
          isDrag: Math.max(Math.abs(active.dragStart.x - e.pageX), Math.abs(active.dragStart.y - e.pageY)) > 10,
          dragLocation: { x: e.pageX, y: e.pageY }
        });
      });
      componentsElement.style['pointer-events'] = 'all';
      const currentClickElement = document.elementFromPoint(e.clientX, e.clientY);
      componentsElement.style['pointer-events'] = 'none';
      const target = computedSelectedArea(currentClickElement, currentElement, false)(active);
      if (!target.activeDesignerId) {
        setActive(active => Object.assign({}, active, { sign: null }));
        return;
      }
      const targetElement = document.querySelector(`[data-designer-id="${target.activeDesignerId}"]`);

      if (!targetElement) {
        setActive(active => Object.assign({}, active, { sign: null }));
        return;
      }

      if (activeElement.contains(targetElement)) {
        setActive(active => Object.assign({}, active, { sign: null }));
        return;
      }

      setActive(active => {
        const { activeDesignerId, left, top, width, height } = computedSelectedArea(targetElement.parentElement, currentElement, false)(active);
        if (!activeDesignerId) {
          return Object.assign({}, active, { sign: null });
        }
        return Object.assign({}, active, {
          sign: { left, top, width, height }
        });
      });
    };
    const cancelHandler = () => {
      setActive(active => {
        return Object.assign({}, active, {
          isDrag: false,
          dragStart: null,
          dragLocation: null,
          sign: null
        });
      });
    };
    currentElement.addEventListener('mousedown', startHandler, true);
    document.addEventListener('mousemove', moveHandler, true);
    document.addEventListener('mouseup', cancelHandler, true);
    return () => {
      currentElement.removeEventListener('mousedown', startHandler, true);
      document.removeEventListener('mousemove', moveHandler, true);
      document.removeEventListener('mouseup', cancelHandler, true);
    };
  }, [setActive]);
  return (
    <>
      <div ref={ref}>{children}</div>
      {active.isDrag && <DragItem />}
    </>
  );
};

export default ComponentsDrag;
