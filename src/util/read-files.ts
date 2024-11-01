import fs from 'fs';
import path from 'path';

export const readFilesRecursively = async (dir: string) => {
    const foundFiles = [];

    const files = fs.readdirSync(dir);

    for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            readFilesRecursively(fullPath);
        } else if (file.endsWith('.js') || file.endsWith('.ts')) {
            const command = await import(fullPath);

            if (typeof command.default == 'undefined') {
                continue;
            }

            if ('data' in command.default && 'run' in command.default) {
                foundFiles.push(command.default);
            } else {
                console.error(`Command file at ${file} is missing required properties.`);
            }
        }
    }

    return foundFiles;
};
