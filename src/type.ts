export namespace ElectronDragWindow {
  export interface useMoveWindowOptions {
    igClassNames?: string[]
    igTagNames?: Element['tagName'][]
  }

  export enum IpcKey {
    ELECTRON_DRAG_WINDOW = 'ELECTRON_DRAG_WINDOW',
    ELECTRON_DRAG_START = 'ELECTRON_DRAG_START',
    ELECTRON_DRAG_OVER = 'ELECTRON_DRAG_OVER'
  }

  export interface IpcParams {
    [IpcKey.ELECTRON_DRAG_START]: {
      mouseX: number,
      mouseY: number
    }
  }

  export interface WindowConfigMapParams {
    width: number,
    mouseX: number,
    mouseY: number,
    height: number
  }
}
