## <% component %>

### UI 效果
![手持身份证拍照前](/images/fin-rm/handheld-idcard-1.png)

### 组件介绍
XXX

### 依赖组件
* [拍照组件](/fin-rm/take-photo/)

### 依赖接口
无

### 使用方法
**1. 使用默认参数**

```html
<handheld-idcard></handheld-idcard>
```

**2. 使用全部参数**

```html
<handheld-idcard :uuid="uuid" :desc="desc" :title="title"></handheld-idcard>
```

Vue 实例 data

```javascript
data: {
    uuid: '53e4e824c250ab3e3833e2cc656d1052',
    desc: '自定义描述文案',
    title: '自定义示例标题'
}
```

### 参数说明
* uuid：字符串、非必选。图片反显 key，根据 uuid 获取图片。

### 更新日志
* 版本：0.0.1，日期：<% date %>，描述：创建文档

### 维护人员
百度 Hi：[xxxx](xxxx)

