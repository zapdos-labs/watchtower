
export function logger(setOutput: (updater: (prev: string[]) => string[]) => void) {
    return function log(...args: any[]) {
        setOutput(prev => {
            const newLines = args.join(' ').split('\n');
            const lines = [...prev, ...newLines];
            return lines.length > 10 ? ['...', ...lines.slice(-9)] : lines;
        });
    }
}