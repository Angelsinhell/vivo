jsonp.default = {
  url: location.href,
  data: null,
  callback: 'callback',
  success: null,
  failed: null,
  timeout: 3000
};
function jsonp(options) {
  var { data, url, callback, success, failed, timeout } = {
    ...jsonp.default,
    ...options
  };

  // 1 对data格式化
  if (typeof data !== 'string') {
    data = new URLSearchParams(data).toString();
  }

  // 2 创建全局函数 可以 处理 数据
  // 2.1 函数的名字: 'jsonp_' + 时间的毫秒值
  var globalCallbackName = 'jsonp_' + Date.now();
  // 2.2 定义全局函数
  window[globalCallbackName] = function(data) {
    // 处理垃圾
    delete window[globalCallbackName];
    document.body.removeChild(scriptEle);
    window.clearTimeout(timer);
    // 处理数据
    success && success(data);
  };

  // 3 拼接url
  url += `?${data}&${callback}=${globalCallbackName}`;

  // 4 创建“请求对象”（script标签）
  var scriptEle = document.createElement('script');
  document.body.appendChild(scriptEle);

  // 5 发送请求
  scriptEle.src = url;

  // 6 开始定时
  var timer = setTimeout(() => {
    // 处理垃圾
    delete window[globalCallbackName];
    document.body.removeChild(scriptEle);
    window.clearTimeout(timer);

    failed && failed(new Error('请求失败.'));
  }, timeout);
}
