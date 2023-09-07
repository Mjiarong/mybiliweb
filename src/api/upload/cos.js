/* 新建一个 cos.js，导出 cos 实例 */
import COS from 'cos-js-sdk-v5'; // 通过 npm 安装的 SDK
var Bucket = 'mybili-1312334998'; /* 存储桶，必须字段 */
var Region = 'ap-guangzhou'; /* 存储桶所在地域，必须字段 */


var cos = new COS({
	// getAuthorization 必选参数
	getAuthorization: function(options, callback) {
		// 异步获取临时密钥
		// 服务端 JS 和 PHP 例子：https://github.com/tencentyun/cos-js-sdk-v5/blob/master/server/
		// 服务端其他语言参考 COS STS SDK ：https://github.com/tencentyun/qcloud-cos-sts-sdk
		// STS 详细文档指引看：https://cloud.tencent.com/document/product/436/14048
		//var url = 'http://localhost:3000/api/v1/upload/credentials'; // url 替换成您自己的后端服务
		var url = '/api/v1/upload/credentials'; // url 替换成您自己的后端服务
		var xhr = new XMLHttpRequest();
		xhr.open('GET', url, true);
		xhr.onload = function(e) {
			try {
				var res = JSON.parse(e.target.responseText);
				var data = res.data;
				var credentials = data.Credentials;
				//console.log(credentials)
			} catch (e) {}
			if (!data || !credentials) {
				return console.error('credentials invalid:\n' + JSON.stringify(data, null, 2))
			};
			callback({
				TmpSecretId: credentials.TmpSecretId,
				TmpSecretKey: credentials.TmpSecretKey,
				SecurityToken: credentials.Token,
				// 建议返回服务器时间作为签名的开始时间，避免用户浏览器本地时间偏差过大导致签名错误
				StartTime: data.StartTime, // 时间戳，单位秒，如：1580000000
				ExpiredTime: data.ExpiredTime, // 时间戳，单位秒，如：1580000000
			});
		};
		xhr.send();
	}
});


export default cos;