import type { IpcRenderer } from "electron"
import { ElectronDragWindow } from "./type"

export const bindDragEvent = (send: IpcRenderer['send'], options?: ElectronDragWindow.useMoveWindowOptions) => {
  const { igClassNames = ['ignoreMove'], igTagNames = ['INPUT'] } = options || {}

  let animationId = 0
  let mouseX = 0
  let mouseY = 0
  let dragging = false

  const onMoveWindow = () => {
    if (!dragging) {
      cancelAnimationFrame(animationId)
      return
    }

    send(ElectronDragWindow.IpcKey.ELECTRON_DRAG_WINDOW, { mouseX, mouseY })

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

    document.addEventListener('mouseup', onMouseUp)

    dragging = true
    mouseX = e.clientX
    mouseY = e.clientY

    requestAnimationFrame(onMoveWindow)
  }

  const onMouseUp = () => {
    dragging = false
    document.removeEventListener('mouseup', onMouseUp)
    cancelAnimationFrame(animationId)
  }


  document.body.addEventListener('mousedown', onMouseDown)
}