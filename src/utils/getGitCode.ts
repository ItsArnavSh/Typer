const repoMap: Record<string, string[]> = {
  typescript: [
    "https://github.com/microsoft/TypeScript/blob/main/src/compiler/tsc.ts",
    "https://github.com/microsoft/TypeScript/blob/main/src/compiler/checker.ts",
  ],
  javascript: [
    "https://github.com/expressjs/express/blob/master/lib/express.js",
    "https://github.com/vuejs/core/blob/main/packages/vue/src/index.js",
  ],
  python: [
    "https://github.com/python/cpython/blob/main/Lib/functools.py",
    "https://github.com/scikit-learn/scikit-learn/blob/main/sklearn/base.py",
  ],
  rust: [
    "https://github.com/rust-lang/rust/blob/master/library/core/src/option.rs",
    "https://github.com/rust-lang/rust-analyzer/blob/master/crates/hir/src/lib.rs",
  ],
  go: [
    "https://github.com/golang/go/blob/master/src/fmt/print.go",
    "https://github.com/golang/tools/blob/master/go/analysis/analysis.go",
  ],
  c: [
    "https://github.com/torvalds/linux/blob/master/kernel/sched/core.c",
    "https://github.com/torvalds/linux/blob/master/mm/page_alloc.c",
  ],
  cpp: [
    "https://github.com/opencv/opencv/blob/master/modules/core/src/matrix.cpp",
    "https://github.com/microsoft/STL/blob/main/stl/inc/vector",
  ],
  java: [
    "https://github.com/spring-projects/spring-framework/blob/main/spring-context/src/main/java/org/springframework/context/ApplicationContext.java",
    "https://github.com/apache/commons-lang/blob/master/src/main/java/org/apache/commons/lang3/StringUtils.java",
  ],
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
      throw new Error(
        `Failed to fetch file: ${response.status} ${response.statusText}`,
      );
    }

    const text = await response.text();
    return text;
  } catch (error) {
    console.error("Error fetching GitHub file:", error);
    throw error;
  }
}

function convertToRawUrl(githubUrl: string): string {
  // Convert GitHub blob URL to raw.githubusercontent.com
  const match = githubUrl.match(
    /^https:\/\/github\.com\/([^/]+)\/([^/]+)\/blob\/([^/]+)\/(.+)$/,
  );

  if (!match) {
    throw new Error("Invalid GitHub blob URL format");
  }

  const [, user, repo, branch, path] = match;
  return `https://raw.githubusercontent.com/${user}/${repo}/${branch}/${path}`;
}
