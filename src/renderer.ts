import type { IpcRenderer } from "electron"
import { ElectronDragWindow } from "./type"

export const bindDragEvent = (send: IpcRenderer['send'], options?: ElectronDragWindow.useMoveWindowOptions) => {
  const { igClassNames = ['ignoreMove'], igTagNames = ['INPUT'], appointClassNames = [], dragMode = ElectronDragWindow.DragMode.All } = options || {}

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

  const checkIgTagName = (dom: HTMLElement): boolean => {
    return igTagNames.includes(dom.tagName)
  }

  const checkClassNames = (classNames: string[], dom: HTMLElement) => {
    let has = false

    for (const name of dom.classList) {
      has = classNames.includes(name)

      if (has) break
    }

    return has
  }

  const checkDomIgnore = (dom: HTMLElement): boolean => {
    if (checkIgTagName(dom)) return true

    const has = checkClassNames(igClassNames, dom)

    if (!has && dom.parentElement) {
      return checkDomIgnore(dom.parentElement)
    }

    return has
  }

  const checkDomAppoint = (dom: HTMLElement): boolean => {
    if (checkIgTagName(dom)) return false

    const has = checkClassNames(appointClassNames, dom)

    if (!has && dom.parentElement) {
      return checkDomAppoint(dom.parentElement)
    }

    return has
  }

  const onMouseDown = (e: MouseEvent) => {
    const dom = e.target as HTMLElement

    let isIg = false

    switch (dragMode) {
      case ElectronDragWindow.DragMode.All: {
        isIg = checkDomIgnore(dom)
        break;
      }
      case ElectronDragWindow.DragMode.Appoint: {
        isIg = !checkDomAppoint(dom)
        break;
      }
    }

    if (isIg) return

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