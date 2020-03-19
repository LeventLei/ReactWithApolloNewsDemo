function timeDifference(current, previous) {
	const milliSecondsPerMinute = 60 * 1000
	const milliSecondsPerHour = milliSecondsPerMinute * 60
	const milliSecondsPerDay = milliSecondsPerHour * 24
	const milliSecondsPerMonth = milliSecondsPerDay * 30
	const milliSecondsPerYear = milliSecondsPerDay * 365

	const elapsed = current - previous

	if (elapsed < milliSecondsPerMinute / 3) {
		return '刚刚'
	}

	if (elapsed < milliSecondsPerMinute) {
		return '少于一分钟前'
	} else if (elapsed < milliSecondsPerHour) {
		return Math.round(elapsed / milliSecondsPerMinute) + ' 分钟前'
	} else if (elapsed < milliSecondsPerDay) {
		return Math.round(elapsed / milliSecondsPerHour) + ' 小时前'
	} else if (elapsed < milliSecondsPerMonth) {
		return Math.round(elapsed / milliSecondsPerDay) + ' 天前'
	} else if (elapsed < milliSecondsPerYear) {
		return Math.round(elapsed / milliSecondsPerMonth) + ' 月前'
	} else {
		return Math.round(elapsed / milliSecondsPerYear) + ' 年前'
	}
}

// 返回更加友好的时间提醒
export function timeDifferenceForDate(date) {
	const now = new Date().getTime()
	const updated = new Date(date).getTime()
	return timeDifference(now, updated)
}
