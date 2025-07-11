const repoMap: Record<string, string[]> = {
	typescript: [
		'https://github.com/ItsArnavSh/Typer/blob/main/data/ts1.txt',
		'https://github.com/ItsArnavSh/Typer/blob/main/data/ts2.txt',
		'https://github.com/ItsArnavSh/Typer/blob/main/data/ts3.txt',
		'https://github.com/ItsArnavSh/Typer/blob/main/data/ts4.txt',
		'https://github.com/ItsArnavSh/Typer/blob/main/data/ts5.txt'
	],
	javascript: [
		'https://github.com/ItsArnavSh/Typer/blob/main/data/js1.txt',
		'https://github.com/ItsArnavSh/Typer/blob/main/data/js2.txt',
		'https://github.com/ItsArnavSh/Typer/blob/main/data/js3.txt',
		'https://github.com/ItsArnavSh/Typer/blob/main/data/js4.txt',
		'https://github.com/ItsArnavSh/Typer/blob/main/data/js5.txt'
	],
	python: [
		'https://github.com/ItsArnavSh/Typer/blob/main/data/python1.txt',
		'https://github.com/ItsArnavSh/Typer/blob/main/data/python2.txt',
		'https://github.com/ItsArnavSh/Typer/blob/main/data/python3.txt',
		'https://github.com/ItsArnavSh/Typer/blob/main/data/python4.txt',
		'https://github.com/ItsArnavSh/Typer/blob/main/data/python6.txt'
	],
	rust: [
		'https://github.com/ItsArnavSh/Typer/blob/main/data/rs1.txt',
		'https://github.com/ItsArnavSh/Typer/blob/main/data/rs2.txt',
		'https://github.com/ItsArnavSh/Typer/blob/main/data/rs3.txt',
		'https://github.com/ItsArnavSh/Typer/blob/main/data/rs4.txt',
		'https://github.com/ItsArnavSh/Typer/blob/main/data/rs5.txt',
		'https://github.com/ItsArnavSh/Typer/blob/main/data/rust1.txt'
	],
	go: [
		'https://github.com/ItsArnavSh/Typer/blob/main/data/go1.txt',
		'https://github.com/ItsArnavSh/Typer/blob/main/data/go2.txt',
		'https://github.com/ItsArnavSh/Typer/blob/main/data/go3.txt',
		'https://github.com/ItsArnavSh/Typer/blob/main/data/go4.txt',
		'https://github.com/ItsArnavSh/Typer/blob/main/data/go5.txt'
	],
	c: [
		'https://github.com/ItsArnavSh/Typer/blob/main/data/c1.txt',
		'https://github.com/ItsArnavSh/Typer/blob/main/data/c2.txt',
		'https://github.com/ItsArnavSh/Typer/blob/main/data/c3.txt',
		'https://github.com/ItsArnavSh/Typer/blob/main/data/c4.txt',
		'https://github.com/ItsArnavSh/Typer/blob/main/data/c5.txt'
	],
	cpp: [
		'https://github.com/ItsArnavSh/Typer/blob/main/data/cpp1.txt',
		'https://github.com/ItsArnavSh/Typer/blob/main/data/cpp2.txt',
		'https://github.com/ItsArnavSh/Typer/blob/main/data/cpp3.txt',
		'https://github.com/ItsArnavSh/Typer/blob/main/data/cpp4.txt',
		'https://github.com/ItsArnavSh/Typer/blob/main/data/cpp5.txt'
	],
	java: [
		'https://github.com/ItsArnavSh/Typer/blob/main/data/java1.txt',
		'https://github.com/ItsArnavSh/Typer/blob/main/data/java2.txt',
		'https://github.com/ItsArnavSh/Typer/blob/main/data/java3.txt',
		'https://github.com/ItsArnavSh/Typer/blob/main/data/java4.txt',
		'https://github.com/ItsArnavSh/Typer/blob/main/data/java5.txt'
	]
};

export async function getGithubFileContent(language: string): Promise<string> {
	// Normalize language
	const langKey = language.toLowerCase();

	// Validate language support
	const urls = repoMap[langKey];
	if (!urls || urls.length === 0) {
		throw new Error(`Unsupported or empty language: ${language}`);
	}

	try {
		// Pick a random GitHub URL from the list
		const randomUrl = urls[Math.floor(Math.random() * urls.length)];
		const rawUrl = convertToRawUrl(randomUrl);

		const response = await fetch(rawUrl);
		if (!response.ok) {
			throw new Error(`Failed to fetch file: ${response.status} ${response.statusText}`);
		}

		const text = await response.text();
		return text;
	} catch (error) {
		console.error('Error fetching GitHub file:', error);
		throw error;
	}
}

function convertToRawUrl(githubUrl: string): string {
	// Convert GitHub blob URL to raw.githubusercontent.com
	const match = githubUrl.match(/^https:\/\/github\.com\/([^/]+)\/([^/]+)\/blob\/([^/]+)\/(.+)$/);

	if (!match) {
		throw new Error('Invalid GitHub blob URL format');
	}

	const [, user, repo, branch, path] = match;
	return `https://raw.githubusercontent.com/${user}/${repo}/${branch}/${path}`;
}
