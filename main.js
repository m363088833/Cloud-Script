"ui";

ui.layout(
    <vertical padding="16">
        <text text="Cloud Script" textSize="30" marginTop="200" gravity="center"/>
        <input id="链接" w="*" h="70" hint="请输入链接（或者JS代码）"/>
        
        <button id="ok" text="ok" textSize="40" w="180" marginTop="20" layout_gravity="center"
        style="Widget.AppCompat.Button.Colored"/>
        
        <button id="上次历史脚本" text="Last History Script" style="Widget.AppCompat.Button.Borderless.Colored" w="auto" layout_gravity="center"/>
  
  
        <text text="作者：qml不吃鱼 邮箱：3242355568@qq.com" textSize="10" marginTop="300" gravity="center"/>
        
    </vertical>
);

let storage = storages.create("云端脚本");
storage.put("手机默认文件夹路径", "/storage/emulated/0/脚本/云端脚本/");
更新_js文件("https://raw.githubusercontent.com/m363088833/Cloud-Script/main/main.js");
更新_js文件("https://raw.githubusercontent.com/m363088833/Cloud-Script/main/__library__.js");

ui.ok.click(() => {
    if (setError({
            "链接": "搞啥呢？输入不能为空！"
        })) {

        let Thread2 = threads.start(function() {
            let data = storage.get("链接"); //获取输入框内的文本

            //正则表达式判断是否是github云端脚本网址
            let github_Url_RegExp = RegExp("^htt+(p||ps)+://.*?[.]js$");
            if (github_Url_RegExp.test(data)) { //确认是云端脚本链接
                var fileName = 获取github云端脚本文件名(data); //获取文件名
                var data = http.get(data).body.string(); //http请求
            } else {
                var fileName = "LocalScript.js"; //判断不是链接，则默认路径
            }

            let path = files.join(storage.get("手机默认文件夹路径"), fileName);
            files.ensureDir(path); //确保路径中的文件夹存在
            files.write(path, data); //保存文件
            storage.put("上次历史脚本", path);
            toastLog("存储路径：" + path);
            engines.execScriptFile(path); //启动脚本
        });

    }
});

ui.上次历史脚本.click(() => {
    engines.execScriptFile(storage.get("path")); //启动脚本
});

//ui提示：输入不能为空(storages保存输入框内数据)
/* @ arr    {string} 
 */
function setError(arr) {
    var obb = true;
    for (let X in arr) {
        let text = eval("ui." + X + ".text()");
        if (text.length == 0) {
            //自定义提示
            eval("ui." + X + ".setError(\"" + arr[X] + "\")");
            obb = false;
        } else {
            storage.put(X, text); //保存输入框内数据
        }
    }
    return obb; //判断输入框是否空白
}

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
        storage.put(fileName,files.join(storage.get("手机默认文件夹路径"), fileName));
        let path = storage.get(fileName);
        files.ensureDir(path); //确保路径中的文件夹存在
        files.write(path, data); //保存文件
        console.log(fileName + "已更新：" + path);
        //toastLog(fileName + "已更新：" + path);
    });
}
//云端脚本主程序
//在线修改文档即可实现（软件更新）
