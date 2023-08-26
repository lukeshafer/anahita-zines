export interface Zine {
	name: string;
	src: string;
	startsIn: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
	reversed?: boolean;
	pages?: {
		text?: string;
		imageDescription?: string;
	}[]
}

export const zinesObject = {
	"body-affirmations": {
		name: "Body Affirmations",
		src: "/zines/body-affirmations.jpg",
		startsIn: 5,
		reversed: true,
		pages: [
			{ text: "Being fat is cool and great! A zine by AnahitaCreates." },
			{ text: "I am very cute. And also beautiful." },
			{ text: "I float easily and my legs are super strong." },
			{ text: "Making friends can be hard, but my relationships are deep and meaningful." },
			{ text: "I know my friends want to be around me for who I am and not just to elevate their own images." },
			{ text: "I have extra padding that protects me from the cold" },
			{ text: "and from hard surfaces (but not that much)." },
			{ text: "I love my body just as it is, and I will not punish it any longer." },
		],
	},
	"being-fat-is-cool-and-great": {
		name: "Being Fat is Cool and Great",
		src: "/zines/being-fat-is-cool-and-great.jpg",
		startsIn: 2,
		pages: [
			{ text: "Being fat is cool and great! A zine by AnahitaCreates." },
			{ text: "I am very cute. And also beautiful." },
			{ text: "I float easily and my legs are super strong." },
			{ text: "Making friends can be hard, but my relationships are deep and meaningful." },
			{ text: "I know my friends want to be around me for who I am and not just to elevate their own images." },
			{ text: "I have extra padding that protects me from the cold" },
			{ text: "and from hard surfaces (but not that much)." },
			{ text: "I love my body just as it is, and I will not punish it any longer." },
		],
	},
	"best-and-worst-harry-styles": {
		name: "The Best and Worst of Harry Styles: Music and Fashion",
		src: "/zines/best-and-worst-harry-styles.jpg",
		startsIn: 2,
	},
} satisfies Record<string, Zine>;

export const zines = Object.entries(zinesObject) satisfies [string, Zine][];
