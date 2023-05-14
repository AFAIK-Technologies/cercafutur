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
		component: TabsPage,
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
];

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes,
});

router.beforeEach(async (to) => {
	// routes with `meta: { requiresAuth: true }` will check for the users, others won't
	if (to.meta.requiresAuth) {
		const currentUser = await useCurrentUser();
		// if the user is not logged in, redirect to the login page
		if (!currentUser) {
			return {
				path: '/profile',
				query: {
					// we keep the current path in the query so we can redirect to it after log in
					// with `router.push(route.query.redirect || '/')`
					redirect: to.fullPath,
				},
			};
		}
	}
});

export default router;
