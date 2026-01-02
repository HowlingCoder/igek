export function getDeviceId(): string {
	const key = 'igek_device_id';
	let deviceId = localStorage.getItem(key);

	if (!deviceId) {
		deviceId = generateDeviceId();
		localStorage.setItem(key, deviceId);
	}

	return deviceId;
}

function generateDeviceId(): string {
	const timestamp = Date.now().toString(36);
	const randomPart = Math.random().toString(36).substring(2, 15);
	return `${timestamp}-${randomPart}`;
}
