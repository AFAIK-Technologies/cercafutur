import { doc, getDoc } from 'firebase/firestore';
import { useFirestore } from 'vuefire';
import * as cluster from 'cluster';
import { phoneLandscape } from 'ionicons/icons';

const db = useFirestore();

export interface Review {
	author: {
		email?: string;
		name: string;
	};
	stars: number;
	text: string;
}

type SchoolType = 'public' | 'public-funded' | 'private';
type Phase = 'primary' | 'secondary';

export interface School {
	id: number;
	name: string;
	type: SchoolType;
	phase: Phase[];
	properties: {
		location: [latitude: number, longitude: number];
		address: string;
		contact: {
			phone: string;
			email?: string;
			website?: string;
		};
		founded: number;
		langs?: {
			primary: string[];
			secondary: string[];
			optional: string[];
		};
	};
	images:
		| {
				src: string;
				credits: string;
				link?: string;
		  }[]
		| null;
	rates?: {
		count: number;
		total: number;
		list?: Review[];
	};
	distance?: number;
}

export const schoolData: Array<School> = [
	{
		id: 1,
		name: 'Institut Ernest Lluch',
		type: 'public',
		phase: ['secondary'],
		properties: {
			location: [41.3783, 2.1503],
			address: 'C/Diputació 11-15, 08015 Barcelona',
			contact: {
				phone: '934260676',
				email: 'a8043462@xtec.cat',
				website: 'insernestlluch.cat',
			},
			founded: 1989,
			langs: {
				primary: ['ca'],
				secondary: ['es'],
				optional: ['fr', 'de'],
			},
		},
		images: [
			{
				src: 'https://insernestlluch.cat/wp-content/uploads/2016/08/ernest-1.jpg',
				credits: 'insernestlluch.cat',
			},
		],
	},
	{
		id: 2,
		name: 'Institut Viladomat',
		type: 'public',
		phase: ['secondary'],
		properties: {
			location: [41.3824, 2.1544],
			address: 'C/Consell de Cent 148-150, 08015 Barcelona',
			contact: {
				phone: '938846029',
				email: 'gestio@institutviladomat.cat',
			},
			founded: 2015,
			langs: {
				primary: ['ca'],
				secondary: ['es'],
				optional: ['de'],
			},
		},
		images: null,
	},
	{
		id: 3,
		name: 'Escola Ferran Sunyer',
		type: 'public',
		phase: ['primary'],
		properties: {
			location: [41.3755, 2.1629],
			address: 'C/Viladomat 2, 08015 Barcelona',
			contact: {
				phone: '933248442',
			},
			founded: 2001,
		},
		images: null,
	},
	{
		id: 4,
		name: 'Escola Jesuïtes el Clot',
		type: 'public-funded',
		phase: ['primary', 'secondary'],
		properties: {
			location: [41.4128, 2.1904],
			address: 'C/València 680, 08027 Barcelona',
			contact: {
				phone: '933525052',
				website: 'www.fje.edu/ca/jesuites-clot',
			},
			founded: 1900,
		},
		images: null,
	},
	{
		id: 5,
		name: 'Institut Poeta Maragall',
		type: 'public',
		phase: ['secondary'],
		properties: {
			location: [41.3913, 2.1567],
			address: 'C/Provença 187, 08036 Barcelona',
			contact: {
				phone: '934534782',
				website: 'agora.xtec.cat/iesmaragall/',
			},
			founded: 1929,
		},
		images: null,
	},
	{
		id: 6,
		name: 'Institut Milà i Fontanals',
		type: 'public',
		phase: ['secondary'],
		properties: {
			location: [41.3761, 2.1668],
			address: 'Plaça de Josep M. Folch i Torres, 08001 Barcelona',
			contact: {
				phone: '934417958',
				website: 'agora.xtec.cat/ins-mila-bcn/',
			},
			founded: 1933,
		},
		images: [
			{
				src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/Institut_Mil%C3%A0_i_Fontanals.jpg/800px-Institut_Mil%C3%A0_i_Fontanals.jpg?20221127100931',
				credits: 'Quelet, Institut Milà i Fontanals, CC BY-SA 3.0',
				link: 'commons.wikimedia.org/wiki/File:Institut_Milà_i_Fontanals.jpg',
			},
		],
	},
	{
		id: 7,
		name: 'Escola Diputació',
		type: 'public',
		phase: ['primary'],
		properties: {
			location: [41.3817, 2.1556],
			address: 'C/Diputació 112-116, 08015 Barcelona',
			contact: {
				phone: '934546868',
				website: 'agora.xtec.cat/ceip-diputacio/',
			},
			founded: 1995,
		},
		images: null,
	},
	{
		id: 8,
		name: 'Escola Joan Miró',
		type: 'public',
		phase: ['primary'],
		properties: {
			location: [41.3785, 2.151],
			address: 'C/Diputació 21, 08015 Barcelona',
			contact: {
				phone: '933254249',
				website: 'www.escolajoanmiro.cat/',
			},
			founded: 1986,
		},
		images: null,
	},
];

export function convert(str: Phase[] | SchoolType, type: 'phase' | 'type') {
	if (type === 'phase') {
		// @ts-ignore
		if (str.length === 2) {
			return 'Primària i secundària';
		} else if (str[0] === 'secondary') {
			return 'Secundària';
		} else {
			return 'Primària';
		}
	} else {
		return {
			public: 'Públic',
			'public-funded': 'Concertat',
			private: 'Privat',
			// @ts-ignore
		}[str];
	}
}
