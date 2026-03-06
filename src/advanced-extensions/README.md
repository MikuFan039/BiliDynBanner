## `advanced-extensions` 高级扩展

**此处是动态 Banner 的高级扩展，参照官方前端的实现**

---

### `springGame2022`

哔哩哔哩 2022 春季的[`风叶穿行`](https://www.bilibili.com/blackboard/fe/activity-HQjQSdd3L8.html)小游戏 Banner

前端代码：

```
https://s1.hdslb.com/bfs/static/laputa-home/client/assets/index.b0cff094.js
```

### `summer2022`

哔哩哔哩 2022 夏季的[雨声环境音 banner](https://www.bilibili.com/video/BV1dv4y1g7ji/)

前端代码：

```
https://s1.hdslb.com/bfs/static/laputa-home/client/assets/index.22f9df5d.js
```

### `autumn2022`

哔哩哔哩 2022 秋季的[户外环境音 banner](https://www.bilibili.com/video/BV1Ne4y1H73m/)

前端代码：

```
https://s1.hdslb.com/bfs/static/laputa-home/client/assets/index.ea53ff87.js
```

---

## 附加说明

1. 启用高级扩展

启用高级扩展需保证 banner 的 json 信息中包含了`extensions`对象，例：

```json
\"extensions\":{\"springGame2022\":{}}
```

2. 跳过 GPU 检测

运行`summer2022`和`autumn2022`扩展时会使用`detect-gpu`检测 GPU 等级，也可以通过配置`extensions`跳过

```json
\"extensions\":{\"summer2022\":{\"skipGpuCheck\":true}}
```
