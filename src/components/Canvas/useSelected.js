import { useEffect, useRef } from 'react';
import useRefCallback from '@kne/use-ref-callback';
import debounce from 'lodash/debounce';
import { computedSelectedArea } from './utils';

const useSelected = ({ designerId, getEventElement, toggle, callback }) => {
  const eventRef = useRef(null);
  eventRef.current = getEventElement();
  const designerIdRef = useRef(designerId);
  designerIdRef.current = designerId;
  const handlerCallback = useRefCallback(callback);
  const handlerGetEventElement = useRefCallback(getEventElement);
  useEffect(() => {
    const eventElement = handlerGetEventElement();
    const recomputed = debounce(() => {
      if (!designerIdRef.current) {
        return;
      }
      const activeElement = document.querySelector(`[data-designer-id="${designerIdRef.current}"]`);
      handlerCallback(computedSelectedArea(activeElement, eventElement, false));
    }, 200);
    const mutationObserver = new MutationObserver(recomputed),
      resizeObserver = new ResizeObserver(recomputed);
    mutationObserver.observe(eventElement, { subtree: true, childList: true });
    resizeObserver.observe(eventElement);
    return () => {
      resizeObserver.disconnect();
      mutationObserver.disconnect();
    };
  }, [handlerCallback, handlerGetEventElement]);

  return useRefCallback(({ clientX, clientY }) => {
    const eventElement = handlerGetEventElement(),
      componentsElement = eventElement.querySelector('.canvas-render');
    componentsElement.style['pointer-events'] = 'all';
    const currentClickElement = document.elementFromPoint(clientX, clientY);
    componentsElement.style['pointer-events'] = 'none';
    return handlerCallback(computedSelectedArea(currentClickElement, eventElement, toggle));
  });
};

export default useSelected;
