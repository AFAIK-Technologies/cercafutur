import { defineStore } from 'pinia';

import { Geolocation } from '@capacitor/geolocation';

export interface GPSPosition {
	latitude?: number;
	longitude?: number;
}

export const useGeoStore = defineStore('geo', {
	state: () => {
		return {
			data: {} as GPSPosition,
			customGeo: false,
			lastCustom: { latitude: 41.3783, longitude: 2.1503 },
			lastError: null as null | GeolocationPositionError,
			justChangedCustom: false,
			customAddress:
				'C. de Vilamar\u00ed, 66, 08015 Barcelona, Espanya' as string,
			geocoding: import.meta.env.VITE_MAPS_API_KEY as boolean,
		};
	},
	getters: {
		geoAsArray: (state): [number, number] | null =>
			state.data.latitude && state.data.longitude
				? [state.data.latitude, state.data.longitude]
				: null,
	},
	actions: {
		async updateGeo(): Promise<
			GPSPosition | GeolocationPositionError | undefined
		> {
			try {
				if (!this.customGeo) {
					const gpsData = await Geolocation.getCurrentPosition();
					this.data.latitude = Math.round(gpsData.coords.latitude * 1e4) / 1e4;
					this.data.longitude =
						Math.round(gpsData.coords.longitude * 1e4) / 1e4;
				}
			} catch (e) {
				this.lastError = e as GeolocationPositionError;
				return;
			}
			this.lastError = null;

			return this.data;
		},
	},
});
