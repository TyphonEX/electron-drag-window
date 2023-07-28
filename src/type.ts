export namespace ElectronDragWindow {
  export interface useMoveWindowOptions {
    igClassNames?: string[]
    igTagNames?: Element['tagName'][]
  }

  export enum IpcKey {
    ELECTRON_DRAG_WINDOW = 'ELECTRON_DRAG_WINDOW'
  }

  export interface IpcParams {
    [IpcKey.ELECTRON_DRAG_WINDOW]: {
      mouseX: number,
      mouseY: number
    }
  }
}
