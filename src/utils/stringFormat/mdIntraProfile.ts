import { mdLink } from "./mdLink";

export function mdIntraProfile(login: string, codeBlock: boolean = true) {
	let display;
	if (codeBlock) {
		display = `\`\`${login}\`\``
	} else {
		display = login;
	}
	return mdLink(display, `https://intra.42.fr/users/${login}`);
}