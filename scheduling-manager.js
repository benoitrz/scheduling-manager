const nativeSetTimeout = setTimeout
const nativeClearTimeout = clearTimeout
const nativeSetInterval = setInterval
const nativeClearInterval = clearInterval

class SchedulingManager {
	constructor() {
		this.timeouts = []
		this.intervals = []
	}
	addTimeout(fn, delay, args) {
		const id = nativeSetTimeout.apply(window, [fn, delay, args])
		const newTimeout = {
			id,
			method: fn,
			arguments: args,
			delay,
		}
		this.timeouts = [...this.timeouts, newTimeout]
		return id
	}
	addInterval(fn, interval, args) {
		const id = nativeSetInterval.apply(window, [fn, interval, args])
		const newInterval = {
			id,
			method: fn,
			arguments: args,
			interval,
		}
		this.intervals = [...this.intervals, newInterval]
		return id
	}
	clearTimeout(id) {
		nativeClearTimeout.apply(window, [id])
		this.timeouts = this.timeouts.filter((timeout) => timeout.id !== id)
	}
	clearInterval(id) {
		nativeClearInterval.apply(window, [id])
		this.intervals = this.intervals.filter((interval) => interval.id !== id)
	}
	clearAllTimeouts() {
		this.timeouts.forEach((timeout) => this.clearTimeout(timeout.id))
	}
	clearAllIntervals() {
		this.intervals.forEach((interval) => this.clearInterval(interval.id))
	}
	clearAll() {
		this.clearAllTimeouts()
		this.clearAllIntervals()
	}
}

const monkeyPatchSchedulers = () => {
	window.setTimeout = (fn, delay, args) => {
		schedulingManager.addTimeout(
			() => {
				fn()
			},
			delay,
			args,
		)
	}

	window.clearTimeout = (id) => {
		schedulingManager.clearTimeout(id)
	}

	window.setInterval = (fn, interval, args) => {
		schedulingManager.addInterval(
			() => {
				fn()
			},
			interval,
			args,
		)
	}

	window.clearInterval = (id) => {
		schedulingManager.clearInterval(id)
	}
}

const schedulingManager = new SchedulingManager()
monkeyPatchSchedulers()
