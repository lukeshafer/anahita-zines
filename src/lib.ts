export function startViewTransition(cb: () => any) {
	if (document.startViewTransition) {
		document.startViewTransition(cb);
		return
	}

	cb();
}
