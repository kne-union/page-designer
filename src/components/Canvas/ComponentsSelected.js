import { useGlobalContext as useContext } from '@kne/global-context';
import { useEffect, useRef } from 'react';
import useSelected from './useSelected';

const ComponentsSelected = ({ children }) => {
  const { active, setActive, hover, setHover } = useContext();
  const eventRef = useRef(null);
  const activeRef = useRef({});
  activeRef.current = active;
  const selectCallback = useSelected({
    designerId: active.activeDesignerId,
    getEventElement: () => {
      return eventRef.current;
    },
    callback: setActive
  });
  const hoverCallback = useSelected({
    designerId: hover.activeDesignerId,
    toggle: false,
    getEventElement: () => {
      return eventRef.current;
    },
    callback: setHover
  });

  useEffect(() => {
    const handlerMouseLeave = () => {
      setHover({});
    };
    const eventElement = eventRef.current;
    eventElement.addEventListener('click', selectCallback, true);
    eventElement.addEventListener('mousemove', hoverCallback, true);
    eventElement.addEventListener('mouseleave', handlerMouseLeave, true);
    return () => {
      eventElement.removeEventListener('click', selectCallback, true);
      eventElement.removeEventListener('mousemove', hoverCallback, true);
      eventElement.removeEventListener('mouseleave', handlerMouseLeave, true);
    };
  }, [selectCallback, selectCallback]);
  return <div ref={eventRef}>{children}</div>;
};

export default ComponentsSelected;
