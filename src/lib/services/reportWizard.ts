import { get, writable, type Writable } from 'svelte/store';

export type LatLng = { lng: number; lat: number } | null;

export interface TempReport {
	id: number;
	timestamp: string;
	location: LatLng;
	timeOffsetMinutes: number;
}

class ReportWizard {
	step: Writable<number>;
	report: Writable<TempReport>;
	selectedLocation: Writable<LatLng>;
	selectedTime: Writable<number>;

	constructor() {
		this.step = writable<number>(1);
		this.selectedLocation = writable<LatLng>(null);
		this.selectedTime = writable<number>(0);

		this.report = writable<TempReport>({
			id: 0,
			timestamp: new Date().toISOString(),
			location: { lat: 0, lng: 0 },
			timeOffsetMinutes: 0
		});
	}

	open() {
		this.step.set(1);
		this.selectedLocation.set(null);
		this.selectedTime.set(0);
		this.report.set({
			id: 0,
			timestamp: new Date().toISOString(),
			location: { lat: 0, lng: 0 },
			timeOffsetMinutes: 0
		});
	}

	next() {
		this.step.update((s) => Math.min(3, s + 1));
	}

	prev() {
		this.step.update((s) => Math.max(1, s - 1));
	}

	setLocation(loc: LatLng) {
		this.selectedLocation.set(loc);
		this.report.update((r) => ({ ...r, location: loc ?? { lat: 0, lng: 0 } }));
	}

	setDetectedLocation(coords: { latitude: number; longitude: number }) {
		this.setLocation({ lng: coords.longitude, lat: coords.latitude });
	}

	setTime(opt: number) {
		this.selectedTime.set(opt);
		this.report.update((r) => ({
			...r,
			timeOffsetMinutes: opt || 0	
		}));
	}

	submit(): { timeOffsetMinutes: number; location: LatLng; timestamp: string } | null {
		const s = get(this.step);
		if (s !== 3) return null;
		const payload = {
			timeOffsetMinutes: parseInt(String(get(this.selectedTime)), 10),
			location: get(this.selectedLocation),
			timestamp: new Date().toISOString()
		};
		return payload;
	}
}

const wizard = new ReportWizard();

export default wizard;
export const step = wizard.step;
export const report = wizard.report;
export const selectedLocation = wizard.selectedLocation;
export const selectedTime = wizard.selectedTime;
export const openReport = () => wizard.open();
export const nextStep = () => wizard.next();
export const prevStep = () => wizard.prev();
export const setLocation = (loc: LatLng) => wizard.setLocation(loc);
export const setDetectedLocation = (coords: { latitude: number; longitude: number }) =>
	wizard.setDetectedLocation(coords);
export const setTime = (t: number) => wizard.setTime(t);
export const submitReport = () => wizard.submit();
