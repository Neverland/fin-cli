# fin-cli

[TOC]

<center>

![](./static/image/logo.jpg)
</center>

fin-cli  曼哈顿cli

## start
```javascript

    npm install fin-cli -g

```

## usage

### fin init
    fin init|i
#### option

 - uri|u git.github.com  [固定值，内部地址不能外传至github, 你懂得]
 - path|path /git/${path}  [可选，你的项目所在git的地址，如果有此值会直接把代码push到对应仓库]

```javascript

    fin i -u git.github.com -p  /git/${path}
```

### fin create
    fin create|c
#### option

 - type|t 类型
    1. type: component
    2. type: page
    3. type: bath
    4. type: index
 
```javascript
    // 创建普通component
    fin create -t component
```

### fin config
    fin config|C
#### option

 - email|e email前缀
 - author|a auhtor
 - projectName|N fin init时录入的名称
 - p|projectId 项目唯一识别
 
```javascript

    fin config -e abc
    fin config -N abc-xyz
    fin config -p abc
    fin config -a abc
    fin config -e abc -a abc
```

##### batch create

1. 对应`模块`下必须有，`index.yal` 文件${module}/index.yml
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

### fin documentation
    fin documentation|d
#### option

 - sever|s 打印启动server命令
 - gitbook|g 生成gitbook文档
 
```javascript
    fin d -g
    fin d -s
```

### fin live
    fin live|l
#### option

 - url|u 需要代理的url default: http://localhost
 - port|p 需要监听的端口 default: 8080
 - dir|d 指定需要监听的文件夹
 
```javascript
    fin l
    fin l -u http://111.111.111 -p 8000
```

## changelog

|version|type|description|date|
|---|---|---|---|
|1.3.0|feature|使用fin create -t index 可以根据yml创建page index|2017/4/14|
|1.2.0|feature|使用fin create -t batch 可以根据yml批量创建page|2017/4/7|
|1.1.0|feature|使用fin create -t page创建page时会创建好mockup|2017/4/5|
|1.0.1|bugfixed|live 可以监听指定目录|2017/4/5|
|1.0.0|feature|可以同步各浏览器状态并监听文件变化|2017/4/1|
|1.0.0|feature|自动调起gitbook服务|2017/4/1|
|0.7.8|feature|自动创建production和develop两个编译配置文件|2017/3/28|
|0.7.4|feature|浏览器中打开创建的page URL|2017/3/22|
 