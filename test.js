window.setTimeout(() => console.log('timeout'), 1000, [])
window.setInterval(() => console.log('interval'), 1000, [])

schedulingManager.clearAll()
console.log(
	schedulingManager.timeouts.length,
	schedulingManager.intervals.length,
)
