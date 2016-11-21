# fin-cli

fin-cli  曼哈顿cli

## start
```javascript
    npm install fin-cli -g

```

## usage

### fin init

#### option

    -uri|u git.github.com  [固定值，内部地址不能外传至github, 你懂得]
    -path|path /git/${path}  [可选，你的项目所在git的地址，如果有此值会直接把代码push到对应仓库]

```javascript
    fin init -u git.github.com -p  /git/${path}
    
```

### fin create

#### option

    -type|t 类型
        1. type: component、input
        2. type: page
 
```javascript
    // 创建普通component
    fin create -t component
```

### fin config

#### option

    -email|e email前缀
    -author|a auhtor
 
```javascript
    fin config -e abc
    fin config -a abc
    fin config -e abc -a abc
```

### fin documentation

#### option

    -sever|s 启动doc server 默认port 4000
    -create|c 生成文档
 
```javascript
    fin documentation -c
    fin documentation -s
```
