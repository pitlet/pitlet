/**
 * clears all intervals on hmr
 */
export const hrmSetInterval = `window.originalSetInterval = window.originalSetInterval || setInterval
window.originalClearInterval = window.originalClearInterval || clearInterval
for (const interval of window.intervals || new Set()) {
  clearInterval(interval)
}
window.intervals = new Set()
window.setInterval = (...args) => {
  const interval = originalSetInterval(...args)
  window.intervals.add(interval)
  return interval
}
window.clearInterval = id => {
  originalClearInterval(id)
  window.intervals.delete(id)
}
`

/**
 * Clears all timeouts on hmr
 */
export const hmrSetTimeout = `window.originalSetTimeout = window.originalSetTimeout || setTimeout
window.originalClearTimeout = window.originalClearTimeout || clearTimeout
for (const timeout of window.timeouts || new Set()) {
  clearTimeout(timeout)
}
window.timeouts = new Set()
window.setTimeout = (...args) => {
  const timeout = originalSetTimeout(...args)
  window.timeouts.add(timeout)
  return timeout
}
window.clearTimeout = id => {
  originalClearTimeout(id)
  window.timeouts.delete(id)
}
`

/**
 * clears all animation frames on hmr
 */
export const hmrRequestAnimationFrame = `  window.originalRequestAnimationFrame = window.originalRequestAnimationFrame ||  requestAnimationFrame
window.originalCancelAnimationFrame = window.originalCancelAnimationFrame || cancelAnimationFrame
for(const animationFrame of window.animationFrames || new Set()){
  window.originalCancelAnimationFrame(animationFrame)
}
window.animationFrames = new Set()
window.requestAnimationFrame = (fn) => {
  const id = window.originalRequestAnimationFrame(()=>{
    fn()
    window.animationFrames.delete(id)
  })
  window.animationFrames.add(id)
  return id
}
window.cancelAnimationFrame = (id) => {
  window.originalCancelAnimationFrame(id)
  window.animationFrames.delete(id)
}
`
