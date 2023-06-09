import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import TabsPage from '../views/TabsPage.vue';
import { redirects } from '@/router/redirects';
import { useCurrentUser } from 'vuefire';

export const tabs: Array<{ name: string; path: string; icon: string }> = [
	{ name: 'Inici', path: 'home', icon: 'home' },
	{ name: 'Mapa', path: 'map', icon: 'map' },
	{ name: 'Cerca', path: 'search', icon: 'search' },
	{ name: 'Perfil', path: 'profile', icon: 'person' },
];

const routes: Array<RouteRecordRaw> = [
	...redirects,
	{
		path: '/tabs/',
		component: () => import('@/views/TabsPage.vue'),
		children: [
			{
				path: '',
				redirect: `/tabs/${tabs[0].path}`,
			},
			...tabs.map((item) => ({
				path: item.path,
				name: item.name,
				component: () => import(`../views/${item.path}.vue`),
			})),
		],
	},
	{
		path: '/school/:id',
		component: () => import('@/views/school.vue'),
	},
	{
		path: '/school/:id/rate',
		component: () => import('@/views/rate.vue'),
	},
	{
		path: '/location',
		component: () => import('@/views/location.vue'),
	},
];

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes,
});
/*
router.beforeEach((to) => {
	// routes with `meta: { requiresAuth: true }` will check for the users, others won't
	if (to.meta.requiresAuth) {
		const currentUser = useCurrentUser();
		// if the user is not logged in, redirect to the login page
		if (!currentUser) {
			return {
				path: '/profile',
			};
		}
	}
});

 */

export default router;
