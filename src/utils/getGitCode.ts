export async function getGithubFileContent(url: string): Promise<string> {
	try {
		// Convert GitHub blob URL to raw content URL
		const rawUrl = convertToRawUrl(url);

		const response = await fetch(rawUrl);
		if (!response.ok) {
			throw new Error(`Failed to fetch file: ${response.status} ${response.statusText}`);
		}

		// Read and return the raw text content
		const text = await response.text();
		return text;
	} catch (error) {
		console.error('Error fetching GitHub file:', error);
		throw error;
	}
}

function convertToRawUrl(githubUrl: string): string {
	// Example: https://github.com/user/repo/blob/branch/path/to/file.ts
	// becomes: https://raw.githubusercontent.com/user/repo/branch/path/to/file.ts

	const match = githubUrl.match(/^https:\/\/github\.com\/([^/]+)\/([^/]+)\/blob\/([^/]+)\/(.+)$/);

	if (!match) {
		throw new Error('Invalid GitHub blob URL format');
	}

	const [, user, repo, branch, path] = match;
	return `https://raw.githubusercontent.com/${user}/${repo}/${branch}/${path}`;
}
