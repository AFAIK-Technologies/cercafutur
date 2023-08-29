import { defineStore, storeToRefs } from 'pinia';
import {
	Review,
	School,
	schoolData,
	SchoolFull,
	SchoolPhase,
	SchoolType,
	Score,
} from '@/data';

import { useGeoStore } from '@/stores/geo';
import { distancekm } from '@/utils';
import {
	query,
	collection,
	where,
	getDocs,
	doc,
	getDoc,
} from 'firebase/firestore';
import { useFirestore } from 'vuefire';
import { Network } from '@capacitor/network';

export interface SchoolFilters {
	phase: SchoolPhase[] | null;
	type: SchoolType[] | null;
}
/*
TS no funciona bé amb for...in, especificar filtres amb la següent array que encaixin amb els
keys de SchoolFilters i de SchoolFull.
 */
const filters = ['phase', 'type'] as const;

const geo = useGeoStore();

export const useSchoolsStore = defineStore('schools', {
	state: () => ({
		schoolList: schoolData.slice() as SchoolFull[],
		filters: { phase: null, type: null } as SchoolFilters,
		recommendedSlice: 4,
		network: null as boolean | null,
		fetched: [] as string[],
	}),
	getters: {
		searchSchools: (state) => {
			return (query: string) =>
				state.schoolList.filter((school) => {
					return school.name.includes(query);
				});
		},
	},
	actions: {
		async updateAll() {
			if (!geo.data.longitude) await geo.updateGeo();
			if (!this.fetched.includes('distance')) this.updateDistance();
			if (!this.fetched.includes('scores')) await this.updateScores();
		},
		updateDistance(force = false) {
			if (!this.fetched.includes('distance') || force) {
				this.schoolList.map((item) => {
					item.distance = distancekm(
						geo.data.latitude,
						geo.data.longitude,
						item.properties.location[0],
						item.properties.location[1],
						'K'
					);
				});
			}
			this.fetched.push('distance');
		},
		/**
		 * Actualitza la puntuació de tot el centre.
		 *
		 * @param force - Forçar l'actualització encara que ja s'hagi fet anteriorment.
		 * @param id - Actualitzar la puntuació d'un centre concret.
		 */
		async updateScores(force = false, id?: number) {
			const firestore = useFirestore();
			if (id) {
				const schoolRef = doc(firestore, 'reviews/' + id);
				const snapshot = await getDoc(schoolRef);
				this.schoolList.find((school) => school.id === id).rates = {
					list: [] as Review[],
					...(snapshot.data() as Score),
				};
			} else if (!this.fetched.includes('scores') || force) {
				const q = query(
					collection(firestore, 'reviews'),
					where(
						'__name__',
						'in',
						this.schoolList.map((item) => item.id.toString())
					)
				);
				const snapshot = await getDocs(q);
				snapshot.docs.forEach((item) => {
					const index = this.schoolList.findIndex(
						(o) => o.id === parseInt(item.id)
					);
					if (index !== -1) {
						this.schoolList[index].rates = {
							list: [] as Review[],
							...(item.data() as Score),
						};
					}
				});
			}
			if (!this.fetched.includes('scores')) this.fetched.push('scores');
		},
		async getFiltered() {
			// Iterar sobre centres
			return this.schoolList
				.filter((school) => {
					let pass = true;
					// Iterar sobre filtres
					for (const filter of filters) {
						if (
							this.filters[filter] !== null &&
							this.filters[filter]?.length !== 0
						) {
							if (filter === 'phase') {
								// Les fases del centre tenen intersecció amb els filtres?
								let didInclude = false;
								// Iterar sobre les fases del centre
								for (const phase of school.phase) {
									didInclude = this.filters[filter]?.includes(phase) ?? true;
									if (didInclude) break;
								}
								if (!didInclude) pass = false;
							} else if (
								filter === 'type' &&
								!this.filters[filter]?.includes(school.type)
							) {
								pass = false;
							}
						}
						if (!pass) break;
					}
					return pass;
				})
				.sort((a, b) =>
					geo.data
						? a.distance - b.distance
						: a.rates?.total / a.rates?.count - b.rates?.total / b.rates?.count
				);
		},
		async checkConnection() {
			const status = await Network.getStatus();
			this.network = status.connected;
		},
		convertSchoolPhases(phases: SchoolPhase[] | string[]) {
			const phasesMap: Record<SchoolPhase, string> = {
				primary: 'primària',
				secondary: 'secundària',
				postsecondary: 'batxillerat',
			};
			return phases
				.map((value, index, array) => {
					value = phasesMap[value as SchoolPhase];
					// TODO
					if (index === 0) {
						value = value
							.split('')
							.map((letter, index) =>
								index === 0 ? letter.toLocaleUpperCase() : letter
							)
							.join('');
					}
					if (array.length - index > 2) {
						value += ',';
					}
					if (array.length - index === 2) {
						value += ' i';
					}
					return value;
				})
				.join(' ');
		},
	},
});
