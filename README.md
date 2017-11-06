# fin-cli

[![npm](https://img.shields.io/npm/v/fin-cli.svg)](https://www.npmjs.com/package/fin-cli)
[![Github All Releases](https://img.shields.io/npm/dm/fin-cli.svg)](https://www.npmjs.com/package/fin-cli)

<center>

![](./static/image/logo.jpg)
</center>

fin-cli  曼哈顿cli

## START
```javascript
    npm install fin-cli -g

```

## USAGE

### fin init
    $ fin init|i
#### option

 - uri|u git.github.com  [固定值，内部地址不能外传至github, 你懂得]
 - path|p /git/${path}  [可选，你的项目所在git的地址，如果有此值会直接把代码push到对应仓库]
 - type|t 类型 default: NORMAL
    1. type: NORMAL                     // 创建需要其他后端语言配合的项目
    2. type: NODE                       // 创建基于javascript， NODEjs的全栈项目

```javascript
    $ fin i -u git.github.com -p  /git/${path}
    $ fin i -u git.github.com -p  /git/${path} -t NODE
    $ fin i -u git.github.com -p  /git/${path} -t NORMAL
    $ fin i -u git.github.com -p 
    $ fin i -u git.github.com -t NODE
```

### fin create
    $ fin create|c
#### option

 - type|t 类型
    1. type: component
    2. type: page
    3. type: batch
    4. type: index
 - extra|x 附加page类型page|webpage(default: page)
 
```javascript
    $ fin create -t component             // 创建普通component
    $ fin create -t widget                // 创建fis widget
    $ fin create -t page                  // 创建page
    $ fin create -t webpage               // 创建fis page
    $ fin create -t batch                 // 批量创建page
    $ fin create -t batch -x webpage      // 批量创建fis page
    $ fin create -t index                 // 创建项目的聚合页
```

>注意：项目变更时必须更新pName,pId才能在创建page时创建对应的mock文件

##### batch create

1. 对应`模块`下必须有，`index.yml` 文件${module}/index.yml
2. yml样例如下
```
preApply:           // ${category} required
  - name: index     // ${pageName} required
    title: '首页'   // ${title}
  - name: home
    title: '主页'
apply:
  - name: index     // ${pageName} required
    title: '首页'   // ${title}
  - name: home
    title: '主页'
```

### fin config
    $ fin config|C
#### option

 - email|e email前缀
 - author|a author
 - pName|N fin init时录入的名称
 - pId|I 项目唯一识别


```javascript
    $ fin config -e abc
    $ fin config -N abc-xyz
    $ fin config -I abc
    $ fin config -a abc
    $ fin config -e abc -a abc
```

### fin documentation
    $ fin documentation|d
#### option

 - sever|s 打印启动server命令
 - gitbook|g 生成gitbook文档
 
```javascript
    $ fin d -g
    $ fin d -s
```

### fin live
    $ fin live|l
#### option

 - url|u 需要代理的url default: http://localhost
 - port|p 需要监听的端口 default: 8080
 - dir|d 指定需要监听的文件夹
 
```javascript
    $ fin l
    $ fin l -u http://111.111.111 -p 8000
```

### fin format
    $ fin format|f
#### option

 - type|t 类型
    1. type: vue(default: vue)
 - path|p 路径 (default: process.cwd())
 
```javascript
    $ fin f                   // 格式化`当前目录中`的`vue`文件
    $ fin f -p .              // 格式化`指定路径中`的`vue`文件
    $ fin f -p . -t vue       // 格式化`指定路径中`的`vue`文件
```


### fin remove
    $ fin remove|r
#### option

 - type|t 类型
    1. type: page
 
```javascript
    $ fin r -t page // page, mock, router
```

## CHANGELOG

|version|type|description|date|
|---|---|---|---|
|1.8.0|feature|fin init --type NODE 支持创建node项目|2017/11/6|
|1.7.0|feature|fin format --type vue|2017/5/20|
|1.6.0|feature|fin remove --type page(可以删除page及page对应的mock，server.conf中的router)|2017/4/26|
|1.5.0|feature|可以创建fis widget，fis page|2017/4/17|
|1.4.0|feature|创建，安装流程中添加loading|2017/4/17|
|1.3.0|feature|使用fin create -t index 可以根据yml创建page index|2017/4/14|
|1.2.0|feature|使用fin create -t batch 可以根据yml批量创建page|2017/4/7|
|1.1.0|feature|使用fin create -t page创建page时会创建好mockup|2017/4/5|
|1.0.1|bugfixed|live 可以监听指定目录|2017/4/5|
|1.0.0|feature|可以同步各浏览器状态并监听文件变化|2017/4/1|
|1.0.0|feature|自动调起gitbook服务|2017/4/1|
|0.7.8|feature|自动创建production和develop两个编译配置文件|2017/3/28|
|0.7.4|feature|浏览器中打开创建的page URL|2017/3/22|
 