更新_js文件("https://raw.githubusercontent.com/m363088833/Cloud-Script/main/main.js","./main.js");

function 获取github云端脚本文件名(url) {
    var 仓库 = "https://raw.githubusercontent.com/m363088833/Cloud-Script/main/";
    var arr = url.split(仓库)[url.split(仓库).length - 1];
    //console.log("仓库名：" + arr);
    return arr;
}

function 更新_js文件(url, path) {
    //更新本地_js文件
    let Thread1 = threads.start(function() {
        let fileName = 获取github云端脚本文件名(url); //获取文件名
        let data = http.get(url).body.string(); //http请求
        if (path == undefined) {
            let path = files.join(storage.get("手机默认文件夹路径"), fileName);
        } else {
            let path = files.join(path, fileName);
        }
        storage.put("path", path); //put保存路径
        path = storage.get("path");
        files.ensureDir(path); //确保路径中的文件夹存在
        files.write(path, data); //保存文件
        toastLog(fileName + "已更新：" + path);
    });
}
