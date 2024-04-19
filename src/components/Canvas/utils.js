const depthCloneElement = element => {
  const shadowElement = element.cloneNode(false);
  if (element.nodeType === 1) {
    const computedStyle = window.getComputedStyle(element, null);
    shadowElement.setAttribute('class', '');
    [].forEach.call(computedStyle, key => {
      shadowElement.style[key] = computedStyle.getPropertyValue(key);
    });
  }
  if (element.childNodes.length > 0) {
    [].forEach.call(element.childNodes, node => {
      shadowElement.appendChild(depthCloneElement(node));
    });
  }
  return shadowElement;
};

const findDesignerElement = (element, root) => {
  if (!element) {
    return null;
  }
  const designerNodeIsLock = (element, root) => {
    if (!element) {
      return false;
    }
    if (element.classList.contains('designer-node-lock')) {
      return true;
    }
    if (element.parentElement === root || element.parentElement === document.body) {
      return false;
    }
    return designerNodeIsLock(element.parentElement, root);
  };

  if (element.classList.contains('designer-node') && element.getAttribute('data-designer-id') && designerNodeIsLock(element.parentElement, root)) {
    return findDesignerElement(element.parentElement, root);
  }

  if (element.classList.contains('designer-node') && element.getAttribute('data-designer-id')) {
    return element;
  }
  if (element.parentElement === root || element.parentElement === document.body) {
    return null;
  }
  return findDesignerElement(element.parentElement, root);
};

const computedSelectedArea = (activeElement, canvasElement, toggle = true) => {
  const currentDesignerElement = findDesignerElement(activeElement, canvasElement);
  if (!currentDesignerElement) {
    return () => {
      return {};
    };
  }
  const currentDesignerElementClientRect = currentDesignerElement.getBoundingClientRect();
  const canvasElementClientRect = canvasElement.getBoundingClientRect();
  const activeDesignerId = currentDesignerElement.getAttribute('data-designer-id');
  return active => {
    return {
      activeDesignerId: toggle ? (active.activeDesignerId === activeDesignerId ? null : activeDesignerId) : activeDesignerId,
      left: currentDesignerElementClientRect.left - canvasElementClientRect.left,
      top: currentDesignerElementClientRect.top - canvasElementClientRect.top,
      width: currentDesignerElementClientRect.width,
      height: currentDesignerElementClientRect.height
    };
  };
};

const locationInElement = ({ x, y }, element) => {
  const scrollX = document.documentElement.scrollLeft || document.body.scrollLeft,
    scrollY = document.documentElement.scrollTop || document.body.scrollTop;
  const { left, top, width, height } = element.getBoundingClientRect();
  const location = {
    x: x + scrollX,
    y: y + scrollY
  };
  return location.x >= left && location.x <= left + width && location.y >= top && location.y <= top + height;
};

export { depthCloneElement, findDesignerElement, computedSelectedArea, locationInElement };
