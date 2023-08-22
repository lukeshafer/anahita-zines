export interface Zine {
	name: string;
	src: string;
	startsIn: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
	reversed?: boolean;
}

export const zines = [
	{
		name: "Body Affirmations",
		src: "/zines/body-affirmations.jpg",
		startsIn: 5,
		reversed: true,
	},
	{
		name: "Being Fat is Cool and Great",
		src: "/zines/being-fat-is-cool-and-great.jpg",
		startsIn: 2,
	},
	{
		name: "The Best and Worst of Harry Styles: Music and Fashion",
		src: "/zines/best-and-worst-harry-styles.jpg",
		startsIn: 2,
	},
] satisfies Zine[];
