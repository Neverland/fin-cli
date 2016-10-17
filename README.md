# fin-cli
----------------------

fin-cli  曼哈顿cli

## start
```javascript
    npm install fin-cli -g

```

## usage

### fin init

#### option

    -uri|u git仓库所在的uri

```javascript
    fin install -u git.fin.com
```

### fin create

#### option

    -type|t 类型
        1. type: component、input
        2. type: page
 
```javascript
    // 创建普通component
    fin create -t component
    // 创建普通input component
    fin create -t component -i
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
