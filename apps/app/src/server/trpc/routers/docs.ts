import { publicProcedure, router } from '../trpc';
import docsData from "../../../public/assets/ui-api.json";

export const docsRouter = router({
	list: publicProcedure.query(async () => {
    return docsData
	}),
});
