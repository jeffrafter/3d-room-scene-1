const withinLimits = ({ x, y, z }) => {
  return (
    x >= 0 && x <= 560 &&
    y >= 0 && y <= 560 &&
    z > 0
  )
}

exports.Averager = class Averager {
  constructor() {
    this.points = []
    this.averageOver = 4
  }

  averageWithPoint({ x, y, z }) {
    if (!withinLimits({ x, y, z })) {
      return null
    }

    this.points.push({ x, y, z })

    if (this.points.length > this.averageOver) {
      this.points.shift()
    }

    return this.getCurrentAverage()
  }

  getCurrentAverage() {
    const totals = { x: 0, y: 0, z: 0 }

    this.points.forEach((point) => {
      totals.x += point.x
      totals.y += point.y
      totals.z += point.z
    })

    return {
      x: totals.x / this.points.length,
      y: totals.y / this.points.length,
      z: totals.z / this.points.length,
    }
  }
}
