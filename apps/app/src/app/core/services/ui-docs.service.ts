import { waitFor } from '@analogjs/trpc';
import { Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Subject, shareReplay, switchMap } from 'rxjs';
import { injectTRPCClient } from '../../../trpc-client';
import { type NestedComponents } from '../models/ui-docs.model';

@Injectable()
export class UIDocsService {
	private readonly _trpc = injectTRPCClient();
	private readonly _uiDocs = toSignal(this._trpc.docs.list.query());

	public triggerRefresh$ = new Subject<void>();
	public uiDocs$ = this.triggerRefresh$.pipe(
		switchMap(() => this._trpc.docs.list.query()),
		shareReplay(1),
	);
	public uiDocs = toSignal(this.uiDocs$);

	constructor() {
		void waitFor(this.uiDocs$);
		this.triggerRefresh$.next();
	}

	getPrimitiveDoc(primitive: string): { brain?: NestedComponents; helm?: NestedComponents } | undefined {
		return this._uiDocs()?.[primitive] as NestedComponents | undefined;
	}
}
