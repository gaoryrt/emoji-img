export default str => {
  const c = document.createElement('canvas')
  c.width = 1
  c.height = 1
  const ctx = c.getContext('2d')
  ctx.font = '1px serif'
  ctx.fillText(str, 0, 1)
  return [...ctx.getImageData(0, 0, 1, 1).data]
}
