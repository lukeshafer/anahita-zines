import { createMemo, createSignal, createContext, useContext, JSX, createEffect, onMount } from "solid-js";
import { startViewTransition } from "../lib";
import type { Zine } from "../config";
import { RATIO, WIDTH, POSITIONS, LAST_PAGE } from "../constants"

export default function ZineCover(props: { zine: Zine, title: string }) {
	const startsIn = (() => props.zine.reversed
		? POSITIONS.length - props.zine.startsIn + 1
		: props.zine.startsIn);

	const positions = (() => props.zine.reversed
		? POSITIONS.slice().reverse()
		: POSITIONS);

	const [currentPage, setCurrentPage] = createSignal(0);
	const posIndex = (() =>
		(2 * currentPage() + startsIn() - 1) % positions().length);

	const rightPage = (() => currentPage() === LAST_PAGE ? -1 : posIndex())
	const viewTransitionName = () => `${props.title}1`

	return (
		<div
			class="relative outline outline-2 outline-black/10 group flex flex-col items-center justify-center bg-center bg-no-repeat w-80"
			style={{
				'view-transition-name': viewTransitionName(),
				"background-image": `url(${props.zine.src})`,
				"max-width": `${WIDTH}px`,
				"aspect-ratio": `${RATIO}`,
				"background-size": "400%",
				"background-position": positions()[Math.abs(rightPage())],
				transform: rightPage() >= positions().length / 2 ? "rotate(0.5turn)" : "rotate(0turn)",
				opacity: rightPage() === -1 ? 0 : 1,
			}}
		>
			<img alt={props.zine.name} class="sr-only" />
		</div>
	);
}
