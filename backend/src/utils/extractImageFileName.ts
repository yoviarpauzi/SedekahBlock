interface ExtractOptions {
  content?: string;
  regex: RegExp;
  groupIndex?: number;
}

/**
 * Extracts substrings (e.g., filenames) from content using a regex with capture groups.
 *
 * @param options - content, regex with capture group, and the group index to extract.
 * @returns Array of extracted strings (e.g., filenames).
 * use this function to get the filename in the content created from the wysiwyg library
 */
const extractMatches = ({
  content,
  regex,
  groupIndex = 1,
}: ExtractOptions): string[] => {
  if (!content) return [];

  const matches: string[] = [];
  let match: RegExpExecArray | null;

  while ((match = regex.exec(content)) !== null) {
    const value = match[groupIndex];
    if (value) {
      matches.push(value);
    }
  }

  return matches;
};

export default extractMatches;
