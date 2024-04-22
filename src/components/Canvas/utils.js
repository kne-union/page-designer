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

const findRelationElements = (element, root) => {
  // 获取下一个元素兄弟节点
  function getNextElementSibling(el) {
    let sibling = el.nextSibling;
    while (sibling && sibling.nodeType !== 1 && sibling.classList.contains('designer-node') && sibling.getAttribute('data-designer-id')) {
      sibling = sibling.nextSibling;
    }
    return sibling;
  }

  // 获取上一个元素兄弟节点
  function getPreviousElementSibling(el) {
    let sibling = el.previousSibling;
    while (sibling && sibling.nodeType !== 1 && sibling.classList.contains('designer-node') && sibling.getAttribute('data-designer-id')) {
      sibling = sibling.previousSibling;
    }
    return sibling;
  }

  return {
    next: getNextElementSibling(element),
    prev: getPreviousElementSibling(element),
    parent: findDesignerElement(element.parentElement, root, false),
    firstChild: element.classList.contains('designer-node-lock')
      ? null
      : (() => {
          const target = findDesignerElement(element.querySelector('[data-designer-id].designer-node'), root);
          return element.contains(target) ? target : null;
        })()
  };
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
  const { next, prev, firstChild, parent } = findRelationElements(currentDesignerElement, canvasElement);
  return active => {
    return {
      activeDesignerId: toggle ? (active.activeDesignerId === activeDesignerId ? null : activeDesignerId) : activeDesignerId,
      nextDesignerId: next ? next.getAttribute('data-designer-id') : null,
      prevDesignerId: prev ? prev.getAttribute('data-designer-id') : null,
      firstChildDesignerId: firstChild ? firstChild.getAttribute('data-designer-id') : null,
      parentDesignerId: parent ? parent.getAttribute('data-designer-id') : null,
      isLocked: currentDesignerElement.classList.contains('designer-node-lock'),
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
