import { BrowserWindow, ipcMain, screen } from "electron"
import { ElectronDragWindow } from "./type"


export const onWindowDrag = () => {
  ipcMain.on(
    ElectronDragWindow.IpcKey.ELECTRON_DRAG_WINDOW,
    function (e, params: ElectronDragWindow.IpcParams[ElectronDragWindow.IpcKey.ELECTRON_DRAG_WINDOW]) {
      const win = BrowserWindow.getAllWindows().find(win => win.webContents.getProcessId() === e.processId)

      if (!win || win.isDestroyed()) return

      const { mouseX, mouseY } = params

      const { x, y } = screen.getCursorScreenPoint()

      const nextX = x - mouseX
      const nextY = y - mouseY

      if (nextX === x && nextY === y) return

      win.setPosition(nextX, nextY)
    })
}