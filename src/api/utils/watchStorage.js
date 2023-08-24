export function mySetItem(key, newVal) {
	// 创建一个StorageEvent事件
	var newStorageEvent = document.createEvent('StorageEvent');
	const storage = {
		setItem: function(k, val) {
			sessionStorage.setItem(k, val);

			// 初始化创建的事件
			newStorageEvent.initStorageEvent('setItem', false, false, k, null, val, null, null);

			// 派发对象
			window.dispatchEvent(newStorageEvent)
		}
	}
	return storage.setItem(key, newVal);
}

export function myRemoveItem(key) {
	// 创建一个StorageEvent事件
	var newStorageEvent = document.createEvent('StorageEvent');
	const storage = {
		removeItem: function(k) {
			sessionStorage.removeItem(k);

			// 初始化创建的事件
			newStorageEvent.initStorageEvent('removeItem', false, false, k, null, null, null, null);

			// 派发对象
			window.dispatchEvent(newStorageEvent)
		}
	}
	return storage.removeItem(key);
}