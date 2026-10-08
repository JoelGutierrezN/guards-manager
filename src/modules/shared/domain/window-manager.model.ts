export interface WindowManager<Window extends string, Payload = null> {
  window: Window
  payload: Payload | null
}
