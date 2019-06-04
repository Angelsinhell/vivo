function _(selector) {
  return document.querySelector(selector);
}

function __(selector) {
  return document.querySelectorAll(selector);
}

function setCss(dom, cssName, cssValue) {
  if (cssName == 'opacity') {
    cssValue = cssValue / 100;
  } else if (cssName == 'zIndex') {
  } else {
    cssValue = cssValue + 'px';
  }

  dom.style[cssName] = cssValue;
}

function getCss(dom, cssName) {
  return getComputedStyle(dom)[cssName];
}

function css(dom, cssName, cssValue) {
  if (cssValue == undefined) {
    return getCss(dom, cssName);
  }
  setCss(dom, cssName, cssValue);
}

function animate(dom, options, completeFn) {
  var start, dest, step;
  clearInterval(dom.timer);
  for (let key in options) {
    if (key == 'opacity') {
      options[key] *= 100;
    }
  }
  dom.timer = setInterval(() => {
    var flag = true;
    for (var prop in options) {
      var val = css(dom, prop);
      val == 'auto' && (val = 0);
      start = prop == 'opacity' ? val * 100 : parseInt(val);
      dest = options[prop];
      step = (dest - start) / 10;
      step = step > 0 ? Math.ceil(step) : Math.floor(step);

      start += step;
      if (start != dest) {
        flag = false;
      }
      css(dom, prop, start);
    }
    // 动画停止了
    if (flag) {
      // 如果用户 指定了 动画完成的回调，那么就 执行它 同时将动画元素  传递进去
      completeFn && completeFn(dom);
      clearInterval(dom.timer);
    }
  }, 20);
}
// 删除指定dom的 样式 类
function removeClass(dom, cls) {
  dom.classList.remove(cls);
}

function addClass(dom, cls) {
  dom.classList.add(cls);
}

function each(likeArray, callback) {
  var i = 0,
    l = likeArray.length;
  for (; i < l; i++) {
    if (callback(likeArray[i], i) === false) {
      break;
    }
  }
}
