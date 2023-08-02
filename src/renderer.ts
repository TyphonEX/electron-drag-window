import type { IpcRenderer } from "electron"
import { ElectronDragWindow } from "./type"

export const bindDragEvent = (send: IpcRenderer['send'], options?: ElectronDragWindow.useMoveWindowOptions) => {
  const { igClassNames = ['ignoreMove'], igTagNames = ['INPUT'] } = options || {}

  let animationId = 0
  let dragging = false

  const onMoveWindow = () => {
    if (!dragging) {
      cancelAnimationFrame(animationId)
      return
    }

    send(ElectronDragWindow.IpcKey.ELECTRON_DRAG_WINDOW)

    animationId = requestAnimationFrame(onMoveWindow)
  }

  const checkDomIgnore = (dom: HTMLElement): boolean => {
    let has = igTagNames.includes(dom.tagName)

    if (has) return has

    for (const name of dom.classList) {
      has = igClassNames.includes(name)

      if (has) break
    }

    if (!has && dom.parentElement) {
      return checkDomIgnore(dom.parentElement)
    }

    return has
  }

  const onMouseDown = (e: MouseEvent) => {
    const dom = e.target as HTMLElement

    if (checkDomIgnore(dom)) {
      return
    }

    let [mouseX, mouseY] = [e.clientX, e.clientY]

    send(ElectronDragWindow.IpcKey.ELECTRON_DRAG_START, { mouseX, mouseY })

    document.addEventListener('mouseup', onMouseUp)

    dragging = true

    requestAnimationFrame(onMoveWindow)
  }


  const onMouseUp = () => {
    send(ElectronDragWindow.IpcKey.ELECTRON_DRAG_OVER)
    dragging = false
    document.removeEventListener('mouseup', onMouseUp)
    cancelAnimationFrame(animationId)
  }


  document.body.addEventListener('mousedown', onMouseDown)
}