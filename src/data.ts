import { doc, getDoc } from 'firebase/firestore';
import { useFirestore } from 'vuefire';

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
	images: string[];
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
			},
			founded: 1989,
			langs: {
				primary: ['ca'],
				secondary: ['es'],
				optional: ['fr', 'de'],
			},
		},
		images: [
			'https://pr1.nicelocal.es/e0ifPlbN368KAUL7Abg_7Q/587x440,q85/4px-BW84_n0QJGVPszge3NRBsKw-2VcOifrJIjPYFYkOtaCZxxXQ2Sa80O38iLLXbZS4wbfY9tlQuR_SiWcYW7ty4OHlqxn5FHRvkoPNFU3ihhVb0QPURw',
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
		images: [
			'https://www.garciafaura.com/wp-content/uploads/2019/02/277-01.jpg',
			'https://www.garciafaura.com/wp-content/uploads/2019/02/277-02.jpg',
			'https://www.garciafaura.com/wp-content/uploads/2019/02/277-05.jpg',
			'https://www.garciafaura.com/wp-content/uploads/2019/02/277-09.jpg',
			'https://www.garciafaura.com/wp-content/uploads/2019/02/277-11.jpg',
		],
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
		images: [
			'https://estatics-nasia.dtibcn.cat/nasia-pro/media/1081092719-escoles%202011_2012_150_P%C3%A1gina_052_Imagen_0003.jpg',
			'https://static1.ara.cat/clip/7fdecaca-f055-4882-8b89-1252d5c3a728_facebook-aspect-ratio_default_0.jpg',
		],
	},
	{
		id: 4,
		name: 'Escola Jesuïtes del Clot',
		type: 'public-funded',
		phase: ['primary', 'secondary'],
		properties: {
			location: [41.41281544710386, 2.1904944769525185],
			address: 'C/València 680, 08027 Barcelona',
			contact: {
				phone: '933525052',
				website: 'https://www.fje.edu/ca/jesuites-clot',
			},
			founded: 1900,
		},
		images: [
			'https://www.formacioprofessional.com/sites/default/files/styles/capsalera/public/content/nodes/centre/image/4/clotl.jpg',
			'https://upload.wikimedia.org/wikipedia/commons/d/de/Escola_del_Clot.jpg',
			'https://www.fje.edu/sites/default/files/styles/large/public/2022-10/clot-eso-installacions-pati_0.jpg.webp?itok=vZYC7ddX',
		],
	},
];

export function convert(str: Phase | SchoolType, type: 'phase' | 'type') {
	if (type === 'phase') {
		// @ts-ignore
		return {
			secondary: 'secundària',
			primary: 'primària',
		}[str];
	} else {
		// @ts-ignore
		return {
			public: 'Públic',
			'public-funded': 'Concertat',
			private: 'Privat',
		}[str];
	}
}
