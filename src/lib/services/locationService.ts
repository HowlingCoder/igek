import { writable, type Writable } from 'svelte/store';
import type { LatLng } from './reportWizard';

export type PermissionStatus = 'checking' | 'granted' | 'denied' | 'error';

export const permissionStatus: Writable<PermissionStatus> = writable('checking');
export const detectedLocation: Writable<LatLng> = writable(null);

let _requested = false;

export function ensureLocationPermission(force = false) {
	if (_requested && !force) return;
	_requested = true;
	permissionStatus.set('checking');

	if (!navigator.geolocation) {
		permissionStatus.set('error');
		return;
	}

	navigator.geolocation.getCurrentPosition(
		(pos) => {
			detectedLocation.set({ lng: pos.coords.longitude, lat: pos.coords.latitude });
			permissionStatus.set('granted');
		},
		(err) => {
			if (err.code === err.PERMISSION_DENIED) {
				permissionStatus.set('denied');
			} else {
				permissionStatus.set('error');
			}
		},
		{ enableHighAccuracy: false, timeout: 15000, maximumAge: 600000 }
	);
}

export function resetLocationRequestForTests() {
	// helper to reset internal flag during tests if needed
	_requested = false;
	permissionStatus.set('checking');
	detectedLocation.set(null);
}
