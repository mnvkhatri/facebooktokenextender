import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const CACHE_EXTENSIONS = ['.sst', '.meta', '.log', '.ldb'];

function deleteCacheFiles(dir: string) {
  let deleted: string[] = [];
  fs.readdirSync(dir).forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      deleted = deleted.concat(deleteCacheFiles(filePath));
    } else {
      const ext = path.extname(file);
      if (CACHE_EXTENSIONS.includes(ext)) {
        fs.unlinkSync(filePath);
        deleted.push(filePath);
      }
    }
  });
  return deleted;
}

export async function POST() {
  const root = process.cwd();
  const deleted = deleteCacheFiles(root);
  return NextResponse.json({ success: true, deleted });
}
