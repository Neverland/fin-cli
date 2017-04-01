# fin-cli

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
    1. type: component、input
    2. type: page
 
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
 
```javascript
    fin l
    fin l -u http://111.111.111 -p 8000
```

## changelog

 |version|type|description|date|
 |---|---|---|---|
 |1.0.0|feature|可以同步各浏览器状态并监听文件变化|2017/4/1|
 |1.0.0|feature|自动吊起gitbook服务|2017/4/1|
 |0.7.8|feature|自动创建production和develop两个编译配置文件|2017/3/28|
 |0.7.4|feature|浏览器中打开创建的page URL|2017/3/22|
 