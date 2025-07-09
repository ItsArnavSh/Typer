const repoMap: Record<string, string[]> = {
	typescript: [
		'https://github.com/osdc/OSDHack-25/blob/main/src/components/Countdown.jsx',
		'https://github.com/ItsArnavSh/gitfindr/blob/main/frontend/src/search.jsx'
	],
	javascript: [
		'https://github.com/osdc/OSDHack-25/blob/main/src/components/Countdown.jsx',
		'https://github.com/ItsArnavSh/gitfindr/blob/main/frontend/src/search.jsx'
	],
	python: [
		'https://github.com/ItsArnavSh/gitfindr/blob/main/backend/src/service/indexing/util/util.py',
		'https://github.com/ItsArnavSh/gitfindr/blob/main/backend/src/service/indexing/semantic/embedding.py'
	],
	rust: [
		'https://github.com/ItsArnavSh/Tyche/blob/main/tech_signal/src/services/scheduler/ubee.rs',
		'https://github.com/ItsArnavSh/Tyche/blob/main/tech_signal/src/services/internal/cache/cache.rs'
	],
	go: [
		'https://github.com/golang/go/blob/master/src/fmt/print.go',
		'https://github.com/golang/tools/blob/master/go/analysis/analysis.go'
	],
	c: [
		'https://github.com/torvalds/linux/blob/master/kernel/sched/core.c',
		'https://github.com/torvalds/linux/blob/master/mm/page_alloc.c'
	],
	cpp: [
		'https://github.com/ItsArnavSh/shatranj/blob/main/checks.cpp',
		'https://github.com/ItsArnavSh/shatranj/blob/main/moves.cpp'
	],
	java: [
		'https://github.com/spring-projects/spring-framework/blob/main/spring-context/src/main/java/org/springframework/context/ApplicationContext.java',
		'https://github.com/apache/commons-lang/blob/master/src/main/java/org/apache/commons/lang3/StringUtils.java'
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
