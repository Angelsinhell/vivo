ajas.default = {
    type: 'get',
    url: location.href,
    data: '',
    dataType: 'json'
};

function ajas(options) {
    return new Promise((resolve, reject) => {
        var { data, type, url, success, failed, dataType } = {...ajas.default, ...options };
        var xhr = new XMLHttpRequest();

        //如果data 不是string 类型 那么需要将其转换成
        if (typeof data !== 'string') {
            data = new URLSearchParams(data).toString();
        }

        if (type.toLowerCase() === 'get') {

            url += '?' + data;
        }
        xhr.open(type, url);

        if (type.toLowerCase() === 'post') {
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        }
        xhr.onreadystatechange = function() {
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
        xhr.send(type.toLowerCase() == 'get' ? null : data);
    });
}