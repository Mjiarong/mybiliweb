// 将秒数转换成时分秒
export function formatSeconds(value) {
	var result = parseInt(value)
	var h =
		Math.floor(result / 3600) < 10 ?
		'0' + Math.floor(result / 3600) :
		Math.floor(result / 3600)
	var m =
		Math.floor((result / 60) % 60) < 10 ?
		'0' + Math.floor((result / 60) % 60) :
		Math.floor((result / 60) % 60)
	var s =
		Math.floor(result % 60) < 10 ?
		'0' + Math.floor(result % 60) :
		Math.floor(result % 60)
	var res = ''
	if (h !== '00') res += `${h}:`
	if (m !== '00') res += `${m}:`
	res += `${s}`
	return res
}