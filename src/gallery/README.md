## 展示页面

这里是用于 Banner 展示页面的相关代码，目前有三个页面

---

### HTML 文档

1. `index.html`

这个页面使用通过 CDN 引入的[`TimelineJS3`](https://timeline.knightlab.com/)构建时间线

可以在构建后访问`http://localhost:8080`预览

2. `list.html`

这个页面是一个简易的展示页面，可以在构建后访问`http://localhost:8080/list`预览

3. `demo.html`

这个页面是示例 HTML，可以在构建后访问`http://localhost:8080/demo`预览

---

### TimelineJS3 配置

\* 如果只需要组件和资源文件，这些文件可删除

1. `res/gallery.json`为展示页面`TimelineJS3`的配置数据入口文件
2. `res/galery/(.*).json`为展示页面`TimelineJS3`各分区的配置数据
