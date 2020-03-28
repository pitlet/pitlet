const PERFORMANCE_MAP = Object.create(null)

exports.measureStart = name => {
  const start = process.hrtime()
  PERFORMANCE_MAP[name] = start
}

exports.measureEnd = name => {
  const start = PERFORMANCE_MAP[name]
  const end = process.hrtime(start)
  console.info(`"${name}" took: %dms`, (end[0] * 1000000000 + end[1]) / 1000000)
}
