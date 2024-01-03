import { Component, isDevMode } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AngularQueryDevtools } from '@tanstack/angular-query-devtools-experimental';
import { FooterComponent } from './shared/footer/footer.component';
import { HeaderComponent } from './shared/header/header.component';

@Component({
	selector: 'spartan-root',
	standalone: true,
	imports: [RouterOutlet, HeaderComponent, FooterComponent, AngularQueryDevtools],
	host: {
		class: 'text-foreground block antialiased',
	},
	template: `
		<spartan-header />
		<div class="mx-auto max-w-screen-2xl">
			<router-outlet />
		</div>
		<spartan-footer />
		@defer (when isDevMode()) {
			<angular-query-devtools [initialIsOpen]="true" />
		}
	`,
})
export class AppComponent {
	protected readonly isDevMode = isDevMode;
}
