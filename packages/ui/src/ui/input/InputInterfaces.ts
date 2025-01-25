import type { ViewListener } from '../state/StateUIManager'

export interface ClickableElementHolder {
  getClickableElement(): ViewListener
}
