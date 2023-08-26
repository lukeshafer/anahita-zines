import { createMemo, createSignal, createContext, useContext, JSX, createEffect, onMount, Show, Switch, Match } from "solid-js";
import { startViewTransition } from "../lib";
import type { Zine } from "../config";
import { RATIO, WIDTH, POSITIONS, LAST_PAGE } from "../constants"

const ZineContext = createContext({
	positions: POSITIONS as readonly string[],
	title: "",
	transitionState: ""
});

export default function Zine(props: { zine: Zine, title: string }) {
	const startsIn = (() => props.zine.reversed
		? POSITIONS.length - props.zine.startsIn + 1
		: props.zine.startsIn);

	const positions = (() => props.zine.reversed
		? POSITIONS.slice().reverse()
		: POSITIONS);

	const [transitionState, setTransitionState] = createSignal("");

	const [currentPage, setCurrentPage] = createSignal(0);
	const posIndex = ((offset = 0) =>
		(2 * (currentPage() + offset) + startsIn() - 1) % positions().length);

	const rightPage = ((offset = 0) => currentPage() + offset === LAST_PAGE ? -1 : posIndex(offset))
	const leftPage = ((offset = 0) => currentPage() + offset === 0 ? -1 : (posIndex(offset) - 1 + positions().length) % positions().length)

	onMount(() => {
		window.addEventListener('keydown', (e) => {
			if (e.key === "ArrowLeft") prev()
			else if (e.key === "ArrowRight") next()

		})
	})

	let timeout: number;
	function next() {
		if (currentPage() === LAST_PAGE || transitionState()) return
		const update = () => {
			setTransitionState("")
			setCurrentPage((page) => page === LAST_PAGE ? page : page + 1)
		}

		if (transitionState()) {
			clearTimeout(timeout)
			update()
		}

		setTransitionState("turning-right")
		timeout = setTimeout(update, 500)
	}

	function prev() {
		if (currentPage() === 0 || transitionState()) return
		const update = () => {
			setTransitionState("")
			setCurrentPage((page) => page === 0 ? page : page - 1)
		}

		if (transitionState()) {
			clearTimeout(timeout)
			update()
		}

		setTransitionState("turning-left")
		timeout = setTimeout(update, 500)
	}

	return (
		<ZineContext.Provider value={{
			get positions() { return positions() },
			get title() { return props.title },
			get transitionState() { return transitionState() }
		}}>
			<div class="flex pb-3 relative">
				<ZinePage
					src={props.zine.src}
					position={leftPage()}
					page={2 * currentPage()}
					side="left"
					reversed={props.zine.reversed ?? false}>
					{currentPage() !== 0 ? <Button onClick={prev} side="left" title="Previous">{'<'}</Button> : null}
				</ZinePage>
				<ZinePage
					src={props.zine.src}
					position={rightPage()}
					page={2 * currentPage() + 1}
					side="right"
					reversed={props.zine.reversed ?? false}>
					{currentPage() !== LAST_PAGE ? <Button onClick={next} side="right" title="Next">{'>'}</Button> : null}
				</ZinePage>
				<Switch>
					<Match when={transitionState() === "turning-left"}>
						<div class="absolute inset-0 ">
							<ZinePage
								src={props.zine.src}
								position={leftPage(-1)}
								side="left"
								transitionIn
								reversed={props.zine.reversed ?? false}>
							</ZinePage>
							<ZinePage
								src={props.zine.src}
								position={rightPage(-1)}
								side="right"
								transitionIn
								reversed={props.zine.reversed ?? false}>
							</ZinePage>
						</div>
					</Match>
					<Match when={transitionState() === "turning-right"}>
						<div class="absolute inset-0 ">
							<ZinePage
								src={props.zine.src}
								position={leftPage(1)}
								page={2 * currentPage()}
								side="left"
								transitionIn
								reversed={props.zine.reversed ?? false}>
							</ZinePage>
							<ZinePage
								src={props.zine.src}
								position={rightPage(1)}
								page={2 * currentPage() + 1}
								side="right"
								transitionIn
								reversed={props.zine.reversed ?? false}>
							</ZinePage>
						</div>
					</Match>
				</Switch>
			</div>
		</ZineContext.Provider>
	);
}

export function ZinePage(props: {
	src: string;
	position: number;
	page?: number;
	reversed: boolean;
	side: "left" | "right";
	transitionIn?: boolean;
	children: JSX.Element;
}) {
	const context = useContext(ZineContext);

	const viewTransitionName = () => `${context.title}${props.page}`

	const isRotated = (() =>
		props.position >= context.positions.length / 2
	);
	return (
		<div
			class="zine-page outline outline-2 outline-black/10 group top-0"
			style={{
				'view-transition-name': viewTransitionName(),
				position: props.transitionIn ? "absolute" : "relative"
			}}
			classList={{
				"page-right-old": props.side === "right" && context.transitionState === "turning-right" && !props.transitionIn,
				"page-left-old": props.side === "left" && context.transitionState === "turning-left" && !props.transitionIn,
				"page-right-new": props.side === "right" && context.transitionState === "turning-left" && props.transitionIn,
				"page-left-new": props.side === "left" && context.transitionState === "turning-right" && props.transitionIn,
				"left-0": props.side === "left",
				"right-0": props.side === "right",
			}}>
			<div
				class="flex flex-col items-center justify-center bg-center bg-no-repeat w-[47vw]"
				style={{
					"background-image": `url(${props.src})`,
					"max-width": `${WIDTH}px`,
					"aspect-ratio": `${RATIO}`,
					"background-size": "400%",
					"background-position": context.positions[Math.abs(props.position)],
					transform: isRotated() ? "rotate(0.5turn)" : "rotate(0turn)",
					opacity: props.position === -1 ? 0 : 1,
				}}
			>
			</div>
			{props.children}
			{
				props.page && props.page > 0 && props.page <= LAST_PAGE * 2 ?
					<p class="text-center w-full absolute">{props.page}</p>
					: null
			}
		</div>
	)
}

function Button(props: {
	onClick: () => void;
	children: string;
	side: "left" | "right"
	title: string;
}) {
	return (
		<button
			class="absolute opacity-0 group-hover:opacity-30 group-hover:hover:opacity-100 bg-indigo-500/50 transition-all text-white h-full font-bold py-2 px-4 items-center top-0 group self-center"
			style={{ [props.side]: "0", "justify-content": props.side === "left" ? "flex-start" : "flex-end" }}
			onClick={() => props.onClick()}>
			<span class="text-white px-2 rounded text-2xl font-bold" aria-hidden="true">
				{props.children}
			</span>
			<span class="sr-only">{props.title}</span>
		</button>
	);
}
