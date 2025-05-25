import path from "path";
import fs from "fs/promises";

interface MoveImageOptions {
  content: string;
  urlRegex: RegExp;
  tempDir: string;
  storageDir: string;
  baseUrl: string;
}

export const moveImageFromTemp = async ({
  content,
  urlRegex,
  tempDir,
  storageDir,
  baseUrl,
}: MoveImageOptions): Promise<string> => {
  const filenamesToMove = new Set<string>();
  let match: RegExpExecArray | null;

  while ((match = urlRegex.exec(content)) !== null) {
    filenamesToMove.add(match[1]);
  }

  await fs.mkdir(storageDir, { recursive: true });

  for (const filename of filenamesToMove) {
    const tempPath = path.join(tempDir, filename);
    const storagePath = path.join(storageDir, filename);

    try {
      await fs.rename(tempPath, storagePath);
      const newUrl = `${baseUrl}/${filename}`;
      const escaped = filename.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

      content = content.replace(
        new RegExp(`(https?:\\/\\/[^\\s"]*${escaped})`, "g"),
        newUrl
      );
    } catch (err) {
      throw err;
    }
  }

  return content;
};

export default moveImageFromTemp;
