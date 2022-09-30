import { readdirSync, lstatSync } from 'fs';
import path from 'path';

const orderRecentFiles = (dir: string) =>
  readdirSync(path.resolve(process.cwd(), dir))
    .filter((f) => {
      return lstatSync(path.resolve(process.cwd(), `${dir}/${f}`)).isFile();
    })
    .map((file) => {
      return {
        file,
        mtime: lstatSync(path.resolve(process.cwd(), `${dir}/${file}`)).mtime,
      };
    })
    .sort((a, b) => b.mtime.getTime() - a.mtime.getTime());

const getMostRecentFile = (dir: string) => {
  const files = orderRecentFiles(dir);
  return files.length ? files[0].file : undefined;
};

export { orderRecentFiles, getMostRecentFile };
