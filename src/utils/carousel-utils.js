export const ActLoadWebPage = 0
export const ActParseJson = 2
export const ActGotoReader = 3

export class CarouselObject {
  constructor(uri, link, action, obj) {
    this.uri = uri
    this.link = link
    this.action = action
    this.obj = obj
  }
}