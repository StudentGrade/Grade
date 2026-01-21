export const refreshIndicatorState = $state({
	lastRefresh: undefined as number | undefined,
	canRefresh: true,
	isRefreshing: false,
	onRefresh: undefined as (() => void) | undefined
});
