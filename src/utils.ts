export const debounce = (func: Function, wait: number) => {
	let timeout: NodeJS.Timeout | null = null;
	return function (this: any, ...args: any[]) {
		const context = this;
		if (timeout) {
			clearTimeout(timeout);
		}
		timeout = setTimeout(() => func.apply(context, args), wait);
	};
};
