export interface Review {
	author: {
		email?: string;
		name: string;
	};
	stars: number;
	text: string;
}

export type SchoolType = 'public' | 'public-funded' | 'private';
export type SchoolPhase = 'primary' | 'secondary' | 'postsecondary';

export interface School {
	id: number;
	name: string;
	type: SchoolType;
	phase: SchoolPhase[];
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
}

export interface SchoolFull extends School {
	rates?: {
		count: number;
		total: number;
		list?: Review[];
	};
	distance: number;
}

export const schoolData: Array<School> = [
	{
		id: 1,
		name: 'Institut Ernest Lluch',
		type: 'public',
		phase: ['secondary', 'postsecondary'],
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
				link: 'insernestlluch.cat',
			},
		],
	},
	{
		id: 2,
		name: 'Institut Viladomat',
		type: 'public',
		phase: ['secondary', 'postsecondary'],
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
		phase: ['primary', 'secondary', 'postsecondary'],
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
		phase: ['secondary', 'postsecondary'],
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
		phase: ['secondary', 'postsecondary'],
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
	{
		id: 9,
		name: 'Escola Auró',
		type: 'public',
		phase: ['primary'],
		properties: {
			location: [41.386, 2.1523],
			address: 'C/Mallorca 106, 08029 Barcelona',
			contact: {
				phone: '934530741',
				website: 'agora.xtec.cat/ceipauro/',
			},
			founded: 1994,
		},
		images: null,
	},
	{
		id: 10,
		name: 'Institut Montserrat',
		type: 'public',
		phase: ['secondary', 'postsecondary'],
		properties: {
			location: [41.4019, 2.1435],
			address: 'C/Copèrnic 84, 08006 Barcelona',
			contact: {
				phone: '932004913',
				website: 'www.institutmontserrat.cat',
			},
			founded: 1941,
		},
		images: null,
	},
	{
		id: 11,
		name: 'Escola Francesc Macià',
		type: 'public',
		phase: ['primary'],
		properties: {
			location: [41.3749, 2.1479],
			address: 'Pl. Espanya 2, 08014 Barcelona',
			contact: {
				phone: '934235085',
				website: 'agora.xtec.cat/escola-francescmacia/',
				email: 'a8002009@xtec.cat',
			},
			founded: 1930,
		},
		images: [
			{
				src: 'https://agora.xtec.cat/escola-francescmacia/wp-content/uploads/usu1684/2018/02/Imatge-escola.jpg',
				credits: 'agora.xtec.cat/escola-francescmacia',
				link: 'agora.xtec.cat/escola-francescmacia',
			},
		],
	},
	{
		id: 12,
		name: 'Institució Montserrat',
		type: 'public-funded',
		phase: ['primary', 'secondary'],
		properties: {
			location: [41.3748, 2.1378],
			address: 'C/Cros 6-8, 08014 Barcelona',
			contact: {
				phone: '934210150',
				website: 'institucio-montserrat.cat',
				email: 'im@institucio-montserrat.cat',
			},
			founded: 1928,
		},
		images: [
			{
				src: 'http://www.institucio-montserrat.cat/wp-content/uploads/2019/05/escola-general.jpg',
				credits: 'institucio-montserrat.cat',
				link: 'institucio-montserrat.cat',
			},
		],
	},
	{
		id: 13,
		name: 'Escola Pau Vila',
		type: 'public',
		phase: ['primary'],
		properties: {
			location: [41.3671, 2.1425],
			address: 'C/Font Florida 95-131, 08004 Barcelona',
			contact: {
				phone: '934229840',
				website: 'agora.xtec.cat/esc-pauvilabcn/',
				email: 'a8041969@xtec.cat',
			},
			founded: 1980,
		},
		images: null,
	},
	{
		id: 14,
		name: 'Escola Fort Pienc',
		type: 'public',
		phase: ['primary'],
		properties: {
			location: [41.3951, 2.1826],
			address: 'C/Alí Bei 75, 08013 Barcelona',
			contact: {
				phone: '932462999',
				website: 'www.escolafortpienc.cat/',
				email: 'a8052657@xtec.cat',
			},
			founded: 2003,
		},
		images: null,
	},
	{
		id: 15,
		name: 'Institut Fort Pius',
		type: 'public',
		phase: ['secondary', 'postsecondary'],
		properties: {
			location: [41.3943, 2.1798],
			address: 'C/Ausiàs Marc 78, 08013 Barcelona',
			contact: {
				phone: '932316013',
				website: 'www.insfortpius.cat/',
			},
			founded: 1984,
		},
		images: null,
	},
];

export function convert(
	str: SchoolPhase[] | SchoolType,
	type: 'phase' | 'type'
) {
	if (type === 'phase') {
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
		}[str as SchoolType];
	}
}
