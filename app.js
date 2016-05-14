var el = frzr.el
var mount = frzr.mount

var tickers = 0 // setTimeout loops running
var initCounter = 0

function initRealtimeChart (canvas, opts) {
  console.log('initCounter: %s', ++initCounter)

  console.log(canvas)

  // default opts
  var defaults = {
    interval: 5000,
    offset: 500,
    size: 'auto',
    line_width: 8
  }

  opts = Object.assign(defaults, opts || {})

  var ctrl = realtimechart(canvas, opts)

  // insert fake data
  var ticks = 0
  function tick () {
    ticks++

    var time = Date.now() - 100 * Math.random()
    var n = Math.random() * 10

    ctrl.addData(n, time)

    setTimeout(tick, 25)
  }
  console.log("TICKERS RUNNING: " + ++tickers)
  setTimeout(tick, 25)

  var _lastInnerWidth = window.innerWidth
  window.addEventListener('resize', function () {
    if (_lastInnerWidth !== window.innerWidth) {
      _lastInnerWidth = window.innerWidth
        console.log('canvas resized!')
        ctrl.addData = ctrl.resize().addData
    }
  })
} // initRealtimeChart

var mount_counter = 0

function Chart (opts) {
  console.log('Chart')
  var self = this

  //this.el = el('div',
    this.el = el('canvas')
  //)

  // frzr lifecycle hook
  //this.mounted = function () {
  this.init = function () {
    console.log('Chart mounted [%s]', ++mount_counter)
    // wrapping in 'immediate' setTimeout fixes the the issues
    //setTimeout(function () {
      initRealtimeChart(self.el, opts)
    //}, 0)
  }
}

function Dashboard (opts) {
  console.log('Dashboard')

  this.charts = [
    new Chart({ interval: 2500, line_width: 3 }),
    new Chart({ interval: 5000, line_width: 8 }),
    new Chart({ interval: 60000, line_width: 2 }),
    new Chart({ interval: 20000, line_width: 1 })
  ]

  this.el = el('div',
    this.charts
  )

  // frzr lifecycle hook
  this.mounted = function () {
    console.log('dashboard mouted called')
    // wrapping in 'immediate' setTimeout fixes the the issues
    //setTimeout(function () {
    this.charts.forEach(function (chart) {
      console.log('chart offsetWidth: %s', chart.el.offsetWidth)
      chart.init()
    })
    //}, 0)
  }

} // Dashboard


var dashboard = new Dashboard()

mount(document.getElementById('app'), dashboard)
