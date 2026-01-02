import type { LatLng } from './reportWizard';

export const FRANKFURT_CENTER = {
	lat: 50.1109,
	lng: 8.6821
};

export const FRANKFURT_RADIUS_KM = 5;

export function calculateDistance(point1: LatLng, point2: LatLng): number {
	if (!point1 || !point2) return Infinity;

	const R = 6371;
	const dLat = toRad(point2.lat - point1.lat);
	const dLon = toRad(point2.lng - point1.lng);

	const a =
		Math.sin(dLat / 2) * Math.sin(dLat / 2) +
		Math.cos(toRad(point1.lat)) *
			Math.cos(toRad(point2.lat)) *
			Math.sin(dLon / 2) *
			Math.sin(dLon / 2);

	const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
	return R * c;
}

function toRad(degrees: number): number {
	return (degrees * Math.PI) / 180;
}

export function isWithinFrankfurtBoundary(location: LatLng): boolean {
	if (!location) return false;
	const distance = calculateDistance(FRANKFURT_CENTER, location);
	return distance <= FRANKFURT_RADIUS_KM;
}

export function getDistanceFromFrankfurt(location: LatLng): number {
	if (!location) return Infinity;
	return calculateDistance(FRANKFURT_CENTER, location);
}

export function getBoundaryCoordinates(): [number, number][] {
	const numPoints = 64;
	const coordinates: [number, number][] = [];

	for (let i = 0; i <= numPoints; i++) {
		const angle = (i / numPoints) * 2 * Math.PI;
		const latOffset = (FRANKFURT_RADIUS_KM / 111.32) * Math.cos(angle);
		const lngOffset =
			(FRANKFURT_RADIUS_KM / (111.32 * Math.cos(toRad(FRANKFURT_CENTER.lat)))) * Math.sin(angle);

		coordinates.push([FRANKFURT_CENTER.lng + lngOffset, FRANKFURT_CENTER.lat + latOffset]);
	}

	return coordinates;
}
