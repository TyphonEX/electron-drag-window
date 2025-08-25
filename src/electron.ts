import { BrowserWindow, ipcMain, screen } from "electron"
import { ElectronDragWindow } from "./type"

// save dragging window size and mouse positon
const WindowConfigMap = new Map<Electron.IpcMainEvent['processId'], ElectronDragWindow.WindowConfigMapParams>()

const getWindowByProcessId = (processId: Electron.IpcMainEvent['processId']) => BrowserWindow.getAllWindows().find(win => win.webContents.getProcessId() === processId)

export const onWindowDrag = () => {
  ipcMain.on(
    ElectronDragWindow.IpcKey.ELECTRON_DRAG_WINDOW,
    function (e) {
      const processId = e.processId

      const config = WindowConfigMap.get(processId)

      if (!config) return

      const win = getWindowByProcessId(processId)

      if (!win || win.isDestroyed()) return

      /**
       * change position
       */
      const { x, y } = screen.getCursorScreenPoint()

      const display = screen.getDisplayNearestPoint({ x, y });
      const primaryDisplay = screen.getPrimaryDisplay();

      const scaleFactor = primaryDisplay.scaleFactor / display.scaleFactor

      const { mouseX, mouseY } = config

      const nextX = Math.round(x - scaleFactor * mouseX)
      const nextY = Math.round(y - scaleFactor * mouseY)

      const [oldX, oldY] = win.getPosition()

      if ([x, oldX].includes(nextX) && [y, oldY].includes(nextY)) return

      const { width, height } = config

      const scaledWidth = Math.floor(width * scaleFactor);
      const scaledHeight = Math.floor(height * scaleFactor);

      const lastConfig = {
        x: nextX,
        y: nextY,
        width: scaledWidth,
        height: scaledHeight
      }

      win.setBounds(lastConfig, false)

      /**
       * reset window size, reason by https://github.com/electron/electron/issues/10862
       */

      // win.setSize(width, height)
    }
  )

  // save config
  ipcMain.on(
    ElectronDragWindow.IpcKey.ELECTRON_DRAG_START,
    function (e, _params: ElectronDragWindow.IpcParams[ElectronDragWindow.IpcKey.ELECTRON_DRAG_START]) {
      const processId = e.processId

      const win = getWindowByProcessId(processId)

      if (!win || win.isDestroyed()) return console.error('error dont find win by ELECTRON_DRAG_START')

      const [width, height] = win.getSize()

      // const { mouseX, mouseY } = params

      const [winX, winY] = win.getPosition()

      const { x: mouseX, y: mouseY } = screen.getCursorScreenPoint()

      WindowConfigMap.set(processId, {
        width, height,
        mouseX: mouseX - winX,
        mouseY: mouseY - winY
      })
    }
  )

  // delete config
  ipcMain.on(
    ElectronDragWindow.IpcKey.ELECTRON_DRAG_OVER,
    function (e) {
      WindowConfigMap.delete(e.processId)
    }
  )
}