## 伪代码 & 元数据

本分支包含以下内容：

1. 前端关键部分混淆代码
2. banner 元数据

---

## `frontend`文件夹

这个文件夹是哔哩哔哩前端关键部分混淆代码（用于处理 banner 元数据中`extensions`字段下的内容）

### `2020autumn.js`

这个文件来自于 2020 年的哔哩哔哩前端部分代码，用于 2020 秋的景深效果 Banner

### `time.js`

这个文件来自于 2021 年的哔哩哔哩前端部分代码，用于随时间变化的 banner

前端代码：

```
https://s1.hdslb.com/bfs/static/jinkela/international-home/international-home.63b8047ef517f94b4844261f548bcf2daf355953.js
```

示例视频：

- [2021 夏](https://www.bilibili.com/video/BV1DQ4y1R7EM/)
- [2021 秋](https://www.bilibili.com/video/BV1qf4y177AB/)
- [2021 冬](https://www.bilibili.com/video/BV1wr4y1X7Ri/)

### `springGame2022.js`

这个文件来自于 2022 春的哔哩哔哩前端部分代码，用于小游戏"[风叶穿行](https://www.bilibili.com/blackboard/fe/activity-HQjQSdd3L8.html)"

前端代码：

```
https://s1.hdslb.com/bfs/static/laputa-home/client/assets/index.b0cff094.js
```

### `summer2022.js`

这个文件来自于 2022 夏的哔哩哔哩前端部分代码，用于当时的[雨声环境音 banner](https://www.bilibili.com/video/BV1dv4y1g7ji/)

前端代码：

```
https://s1.hdslb.com/bfs/static/laputa-home/client/assets/index.22f9df5d.js
```

### `autumn2022.js`

这个文件来自于 2022 秋的哔哩哔哩前端部分代码，用于当时的[户外环境音 banner](https://www.bilibili.com/video/BV1Ne4y1H73m/)

前端代码：

```
https://s1.hdslb.com/bfs/static/laputa-home/client/assets/index.ea53ff87.js
```

---

## `header`文件夹

这个文件夹是哔哩哔哩部分特殊动态 banner 的元数据（关键：`extensions`字段下的内容）

```json
\"extensions\":{\"springGame2022\":{}}
```
