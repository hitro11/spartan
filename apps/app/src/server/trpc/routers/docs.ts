import docsData from '../../../public/assets/ui-api.json';
import { publicProcedure, router } from '../trpc';

export const docsRouter = router({
	list: publicProcedure.query(async () => {
		return docsData;
	}),
});
