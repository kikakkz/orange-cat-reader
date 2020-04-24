import {PixelRatio} from 'react-native'
export const dp2px = dp=>PixelRatio.getPixelSizeForLayoutSize(dp)
export const px2dp = px=>PixelRatio.roundToNearestPixel(px)

import { Dimensions } from 'react-native'
export const screenWidth = Dimensions.get('window').width
export const screenHeight = Dimensions.get('window').height

export const AREA_TOP_LEFT = 0
export const AREA_TOP_RIGHT = 1
export const AREA_CENTER_LEFT = 2
export const AREA_CENTER_CENTER = 3
export const AREA_CENTER_RIGHT = 4
export const AREA_BOTTOM_LEFT = 5
export const AREA_BOTTOM_RIGHT = 6

export function touchArea(touchX, touchY, viewW, viewH) {
  if (touchY <= viewH * 0.4) {
    if (touchX <= viewW * 0.5) {
      return AREA_TOP_LEFT
    }
    return AREA_TOP_RIGHT
  } else if (touchY <= viewH * 0.6) {
    if (touchX <= viewW * 0.3) {
      return AREA_CENTER_LEFT
    } else if (touchX <= viewW * 0.7) {
      return AREA_CENTER_CENTER
    }
    return AREA_CENTER_RIGHT
  } else {
    if (touchX <= viewW * 0.5) {
        return AREA_BOTTOM_LEFT
      }
      return AREA_BOTTOM_RIGHT
  }
}