export function visible(obj, viewTop, viewHeight) {
  return (viewTop <= obj.top && obj.top <= viewTop + viewHeight) ||
         (viewTop < obj.top + obj.height && obj.top + obj.height <= viewTop + viewHeight)
}

export class ScrollObject {
  constructor(top, height, obj) {
    this.top = top
    this.height = height
    this.obj = obj
    this.visible = false
  }
  refreshView(viewTop, viewHeight) {
    this.visible = visible(this, viewTop, viewHeight)
  }
}