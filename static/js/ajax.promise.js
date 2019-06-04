ajax.default = {
  type: 'get',
  url: location.href,
  data: '',
  dataType: 'json'
};
function ajax(options) {
  return new Promise((resolve, reject) => {
    var { data, type, url, success, failed, dataType } = {
      ...ajax.default,
      ...options
    };
    var xhr = new XMLHttpRequest();

    // 如果 data 不是 string类型，那么需要将其转换成 查询字符串
    if (typeof data !== 'string') {
      data = new URLSearchParams(data).toString();
    }

    // 如果 为 get请求类型
    if (type.toLowerCase() === 'get') {
      // 将 查询字符串 拼接到url上
      url += '?' + data;
    }

    xhr.open(type, url);
    if (type.toLowerCase() === 'post') {
      // 如果 是 post请求 就设置请求头Content-Type
      xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    }

    xhr.onreadystatechange = () => {
      if (xhr.readyState == 4) {
        if (xhr.status == 200) {
          resolve(
            dataType == 'json' ? JSON.parse(xhr.responseText) : xhr.responseText
          );
        } else {
          reject(new Error('请求失败'));
        }
      }
    };

    // 当 请求 为 get时，不需要给send方法传参数，
    // 否则 将data 传入即可
    xhr.send(type.toLowerCase() == 'get' ? null : data);
  });
}
