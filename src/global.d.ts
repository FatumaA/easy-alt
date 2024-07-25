// Define missing types
interface ImageData {
	readonly width: number;
	readonly height: number;
	readonly data: Uint8ClampedArray;
}

interface HTMLImageElement {
	readonly width: number;
	readonly height: number;
	src: string;
	alt: string;
}

interface ImageBitmap {
	readonly width: number;
	readonly height: number;
	close(): void;
}

// If ReadableStream is not defined, uncomment the following:
interface ReadableStream<R = any> {}

// Define HTMLElement if needed
interface HTMLElement {
	// Add properties that you might use from HTMLElement
	id: string;
	className: string;
	// Add more as needed
}
