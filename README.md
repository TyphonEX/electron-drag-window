# electron-drag-window

## 用于 Electron 在不使用 `-webkit-app-region` 的情况下实现窗体移动

Electron 利用 `-webkit-app-region` 去区分可拖拽和不可拖拽。可拖拽区域会不触发鼠标事件，在一些业务场景下无法满足需求，因此写了该库去替代原方案，建议结合 `-webkit-app-region` 一起使用

如果对你有帮助，可以的话给我一个 star 谢谢


## 效果展示

![悬浮球](https://github.com/TyphonEX/electron-drag-window/assets/49380589/50eef9f0-3382-4172-88be-8f8b43e8cf89)

也可以亲自下载体验一下 [typhon-note-release](https://github.com/TyphonEX/typhon-note-release)


## 安装

[npm 地址](https://www.npmjs.com/package/electron-drag-window)

```javascript
npm i electron-drag-window

or

yarn add electron-drag-window
```


## 实现

几个关键

1. `onmousedown` 事件委托获取鼠标坐标
2. `requestAnimationFrame` 配合 `ipc` 实时与主进程通讯
3. `screen.getCursorScreenPoint()` 获取鼠标坐标
4. `win.setPosition` 更改窗体坐标，达到移动窗体的效果

具体实现直接看源码，很简单的


## 使用

### 主进程 main process

在你的主进程启动文件中

```javascript
import { onWindowDrag } from "electron-drag-window/electron"

...
app.whenReady().then(()=> {
  ...

  onWindowDrag()

  ...
})
```


### 渲染进程 renderer process

#### 参数

1. `ipcRenderer.send` ，因为在绝大部分项目中 `ipcRenderer`是由 `preload` 注入，因此这里是由外部传入，而非包内直接引入
2. `options` 自定义选项

##### options

|参数名|类型|是否可选|默认值|作用|
|-|-|-|-|-|
|igTagNames|`string[]`|可选|`['INPUT']`|忽略拖拽操作的元素名|
|dragMode|`ElectronDragWindow.DragMode`|可选|`ElectronDragWindow.DragMode.All`|拖拽元素模式: `All` 全局拖拽; `Appoint` 指定拖拽|
|appointClassNames|`string[]`|可选|`[]`|`Appoint` 模式下，可拖拽的元素类名|
|igClassNames|`string[]`|可选|`['ignoreMove']`|`All` 模式下，忽略拖拽操作的元素类名|


在你的渲染进程中

````javascript
import { bindDragEvent } from "electron-drag-window/renderer"

// 替换成自身项目中的 ipcRenderer.send 方法
bindDragEvent(IpcRendererSend.originSend, options)

````


##### 注意

该方法是通过绑定 mousedown 事件于 body 上，并通过事件委托的形式去处理，因此单个窗体仅需要初始化一次即可
