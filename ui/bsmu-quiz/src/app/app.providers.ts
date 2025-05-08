import type { HttpInterceptorFn } from '@angular/common/http';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import type { EnvironmentProviders } from '@angular/core';
import { inject, makeEnvironmentProviders } from '@angular/core';
import type { IsActiveMatchOptions, ViewTransitionsFeatureOptions } from '@angular/router';
import { provideRouter, Router, withComponentInputBinding, withViewTransitions } from '@angular/router';
import { en_US, provideNzI18n } from 'ng-zorro-antd/i18n';

import { routes } from './app.routes';

export function provideAppRouter(): EnvironmentProviders {
	const viewTransitionConfig: ViewTransitionsFeatureOptions = {
		onViewTransitionCreated: (transitionInfo) => {
			const router = inject(Router);
			const targetUrl = router.getCurrentNavigation()?.finalUrl;

			const config: IsActiveMatchOptions = {
				paths: 'exact',
				matrixParams: 'exact',
				fragment: 'ignored',
				queryParams: 'ignored',
			};

			// Skip the transition if the only thing changing is the fragment and queryParams
			if (router.isActive(targetUrl ?? '', config)) {
				transitionInfo.transition.skipTransition();
			}
		},
	};

	return makeEnvironmentProviders([
		provideRouter(routes, withComponentInputBinding(), withViewTransitions(viewTransitionConfig)),
	]);
}

export function provideAppHttpClient(): EnvironmentProviders {
	const interceptors: HttpInterceptorFn[] = [];

	return makeEnvironmentProviders([provideHttpClient(withInterceptors(interceptors))]);
}

export function provideServices(): EnvironmentProviders {
	return makeEnvironmentProviders([]);
}

export function provideNgZorro(): EnvironmentProviders {
	return makeEnvironmentProviders([provideNzI18n(en_US)]);
}
