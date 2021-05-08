# 简介
这是一款可通过**注释块**自动输出 js 方法**说明文档**的babel插件。
# 功能
基于babel-AST，通过AST树遍历注释块，并将注释块转为说明文档内容输出md文件。
# 使用
## 获取代码
 先将代码 clone 到本地（由于未发布该插件，所以直接把代码放到本地使用）
 ```bash
git clone git@github.com:DemoJj/outDocs.git
```
## 安装相关依赖
```bash
npm install 
// 或 cnpm i
```
## 配置.babelrc文件
|属性|介绍|
|---|---|
|outDirName|输出所放文件夹的名称|
|gather|集合所有文档，集合后输出文件的名称|
```javascript
// .babelrc
{
    "plugins": [["./plugins.js", {
      "outDirName": "demoRme",
      "gather": "common" // 集合所有文档，并设定common为文件名
    }] ]
    // "plugins": ["./plugins.js"]
  }
```
## 注释块介绍
|属性|介绍|备注|
|---|---|--|
|@out|含有则输出该函数文档，否则不输出|
|@description|函数描述|
|@param|函数参数| { 'string': '字符串','number': '数值','array': '数组','object': '对象'}|
|@returns|函数返回内容|
```javascript
/** @out
 * @description 测试方法
 * @param {string} a 参数一
 * @param {number} b
 * @returns {void}
 */
function square(n) {
    return n * n;
}
```
## 使用方案
-  方案1（babel）
> 在命令行中执行以下命令：
>```bash
> npx babel test/test.js
> ```
- 方案2（rollup）(可深度输出)
> a. 在根目录下新建 rollup.config.js 文件：
> ```javascript
>// rollup.config.js
>import babel from 'rollup-plugin-babel';
>import clear from 'rollup-plugin-clear';
>export default {
>    input: './test/test.js',
>    plugins:[
>        clear({
>            targets: ['./demoRme']
>        }),
>        babel()
>    ]
>}
>```
>b.在命令行中执行以下命令：
>```bash
>rollup -c
>```
# 效果
a. 方案1(babel)默认生成目录：
![在这里插入图片描述](https://img-blog.csdnimg.cn/20210508182419476.png)
b. 方案2(rollup)默认生成目录：
![在这里插入图片描述](https://img-blog.csdnimg.cn/2021050818232849.png)
c.配置生成目录：
![在这里插入图片描述](https://img-blog.csdnimg.cn/20210508181638396.png)
d.输出文档显示内容
![在这里插入图片描述](https://img-blog.csdnimg.cn/20210508182548181.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L0RlbW9KeA==,size_16,color_FFFFFF,t_70)
源码：
[【点此进入】](https://github.com/DemoJj/outDocs)
