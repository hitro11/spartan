import { JsonPipe } from '@angular/common';
import { Component, computed, inject, input } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import {
	HlmCaptionComponent,
	HlmTableComponent,
	HlmTdComponent,
	HlmThComponent,
	HlmTrowComponent,
} from '@spartan-ng/ui-table-helm';
import { hlmH4 } from '@spartan-ng/ui-typography-helm';
import { map } from 'rxjs';
import { UIDocsService } from '../../../core/services/ui-docs.service';

@Component({
	selector: 'spartan-ui-api-docs',
	standalone: true,
	imports: [HlmTableComponent, HlmTrowComponent, HlmThComponent, HlmTdComponent, HlmCaptionComponent, JsonPipe],
	template: `
		@if (uiDocs() && uiPrimitiveEntries() && uiPrimitiveEntries().length > 0) {
			@for (entry of uiPrimitiveEntries(); track entry) {
				<h4 class="${hlmH4} mb-2 mt-6">{{ entry }}</h4>
				<p>Selector: {{ uiPrimitiveItems()[entry].selector }}</p>
				@if (uiPrimitiveItems()[entry].exportAs) {
					<p>{{ uiPrimitiveItems()[entry].exportAs }}</p>
				}
				@if (uiPrimitiveItems()[entry].inputs && forceIterator(uiPrimitiveItems()[entry].inputs).length > 0) {
					<h4 class="${hlmH4} mb-2 mt-6">Inputs</h4>
					<hlm-table class="min-w-[400px]">
						<hlm-trow>
							<hlm-th class="flex-1">Prop</hlm-th>
							<hlm-th class="flex-1">Type</hlm-th>
							<hlm-th class="flex-1 whitespace-nowrap">Default</hlm-th>
						</hlm-trow>

						@for (primitiveInput of forceIterator(uiPrimitiveItems()[entry].inputs); track primitiveInput.file) {
							<hlm-trow>
								<hlm-td truncate class="flex-1 font-medium">{{ primitiveInput?.name }}</hlm-td>
								<hlm-td class="flex-1">{{ primitiveInput?.type }}</hlm-td>
								<hlm-td class="flex-1 whitespace-nowrap">
									@if (primitiveInput?.description) {
										{{ primitiveInput?.description }}
									} @else {
										<span class="sr-hidden">-</span>
									}
								</hlm-td>
							</hlm-trow>
						}
					</hlm-table>
				}

				@if (uiPrimitiveItems()[entry].outputs && forceIterator(uiPrimitiveItems()[entry].outputs).length > 0) {
					<h4 class="${hlmH4} mb-2 mt-6">Outputs</h4>
					<hlm-table class="min-w-[400px]">
						<hlm-trow>
							<hlm-th class="flex-1">Prop</hlm-th>
							<hlm-th class="flex-1">Type</hlm-th>
							<hlm-th class="flex-1 whitespace-nowrap">Default</hlm-th>
						</hlm-trow>

						@for (primitiveOutputs of forceIterator(uiPrimitiveItems()[entry].outputs); track primitiveOutputs.file) {
							<hlm-trow>
								<hlm-td truncate class="flex-1 font-medium">{{ primitiveOutputs?.name }}</hlm-td>
								<hlm-td class="flex-1">{{ primitiveOutputs?.type }}</hlm-td>
								<hlm-td class="flex-1 whitespace-nowrap">
									@if (primitiveOutputs?.description) {
										{{ primitiveOutputs?.description }}
									} @else {
										<span class="sr-hidden">-</span>
									}
								</hlm-td>
							</hlm-trow>
						}
					</hlm-table>
				}
			}
		}
	`,
})
export class UIApiDocsComponent {
	private readonly _uiDocsService = inject(UIDocsService);
	private readonly _route = inject(ActivatedRoute);
	protected primitive = toSignal(this._route.data.pipe(map((data) => data?.['api'])));

	public docType = input<'brain' | 'helm'>('brain');

	protected uiDocs = computed(() => this._uiDocsService.getPrimitiveDoc(this.primitive()) ?? null);
	protected uiPrimitiveItems = computed(() => this.uiDocs()?.[this.docType()] ?? {});
	protected uiPrimitiveEntries = computed(() => Object.keys(this.uiPrimitiveItems() ?? []));

	// FIXME: Typing was getting weird
	forceIterator(item: any): any[] {
		return item && Array.isArray(item) ? item : [];
	}
}
