"ui";

/*
marginLeft 左外边距
marginRight 右外边距
marginTop 上外边距
marginBottom 下外边距

gravity
View的"重力"。需要搭配框架<frame></frame>
用于决定View的内容相对于View的位置，可以设置的值为:
left 靠左
right 靠右
top 靠顶部
bottom 靠底部
center 居中
center_vertical 垂直居中
center_horizontal 水平居中

*/

ui.layout(
    <vertical padding="16">
        <text text="Cloud Script" w="auto" h="auto" textSize="35" marginTop="200" layout_gravity="center"/>
        <input id="链接" hint="请输入链接(或JS代码)" w="*" h="60" textSize="16"/>
        
        <button id="运行" text="运行" w="150" textSize="40" marginTop="25" layout_gravity="center"
        style="Widget.AppCompat.Button.Colored"/>
        
        <button id="上次历史脚本" text="Last History Script" style="Widget.AppCompat.Button.Borderless.Colored" w="auto" layout_gravity="center"/>
        
        <text text="作者：小丘不吃鱼  邮箱：3242355568@qq.com" textSize="10" w="auto" h="auto" marginTop="300" layout_gravity="center"/>
    </vertical>
);


let storage = storages.create("云端脚本");
storage.put("默认文件夹路径", "/storage/emulated/0/脚本/云端脚本/");
//更新_js文件("https://raw.githubusercontent.com/m363088833/Cloud-Script/main/__library__.js");
ui.statusBarColor("#0099FF"); //设置通知栏颜色


let lastPressedTime = 0;
ui.emitter.on("back_pressed", (e) => {
    let time = Date.now();
    if (time - lastPressedTime < 600) {
        return;
    }
    toast("再按一次退出程序");
    e.consumed = true;
    lastPressedTime = time;
});



//点击OK
ui.运行.click(() => {
    if (setError({
            "链接": "搞啥呢？输入不能为空！"
        })) {

        let Thread2 = threads.start(function() {
            var data = storage.get("链接"); //获取输入框内的文本

            //正则表达式判断是否是要建立新的文件名称来保存输入框内文本
            let 获取中间文本 = data.match("^//file:(.*?)//");

            //正则表达式判断是否是个人github云端脚本url
            let github_Url_RegExp = new RegExp("^htt+(p||ps)+://.*?[.]js$");
           
            if (github_Url_RegExp.test(data)) { //确认是云端脚本url
                var fileName = 获取github云端脚本文件名(data); //获取文件名
                var data = http.get(data).body.string(); //http请求
            } else if (获取中间文本) {
                var fileName = 获取中间文本[1]; //输入框内的文本
                //alert(data);//测试：是否保存输入框内文本与新建文件
            } else {
                var fileName = "LocalScript.js"; //判断不是github脚本链接，则设置默认脚本文件名
            }

            let path = files.join(storage.get("默认文件夹路径"), fileName);
            files.ensureDir(path); //确保路径中的文件夹存在
            files.write(path, data); //保存文件
            storage.put("历史脚本", path); //记录上次保存文件的路径
            toastLog("存储路径：" + path); //显示存储路径
            engines.execScriptFile(path); //启动脚本
        });

    }
});


ui.上次历史脚本.click(() => {
    engines.execScriptFile(storage.get("历史脚本")); //启动脚本
});


//ui提示：输入不能为空(storages保存输入框内数据
function setError(arr) {
    var obb = true;
    for (let X in arr) {
        let text = eval("ui." + X + ".text()"); //获取id输入框内文本
        if (text.length == 0) {
            //自定义提示
            eval("ui." + X + ".setError(\"" + arr[X] + "\")"); //定义输入框空白提示
            obb = false;
        } else {
            storage.put(X, text); //保存输入框内数据
        }
    }
    return obb; //判断输入框是否空白
}


function 获取github云端脚本文件名(url) {
    var 仓库 = "https://raw.githubusercontent.com/m363088833/Cloud-Script/main/";
    var arr = url.split(仓库)[url.split(仓库).length - 1]; //使用分离方法得出github的文件名
    //console.log("仓库名：" + arr);
    return arr;
}


function 更新_js文件(url) {
    //更新本地_js文件
    let Thread1 = threads.start(function() {
        let data = http.get(url).body.string(); //http请求
        let fileName = 获取github云端脚本文件名(url); //获取文件名
        storage.put("fileNamePath", files.join(storage.get("默认文件夹路径"), fileName)); //保存key：文件名，保存数据为路径
        let path = storage.get("fileNamePath"); //赋予path路径名
        files.ensureDir(path); //确保路径中的文件夹存在
        files.write(path, data); //保存文件
        //console.log(fileName + "已更新：" + path);
        toastLog(fileName + "已更新：" + path);
    });
}
//云端脚本主程序
