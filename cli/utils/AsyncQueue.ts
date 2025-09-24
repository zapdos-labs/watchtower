export class AsyncQueue<T> {
    private queue: T[] = [];
    private resolvers: ((value: IteratorResult<T>) => void)[] = [];
    private ended = false;

    push(item: T) {
        if (this.ended) return;
        if (this.resolvers.length > 0) {
            const resolve = this.resolvers.shift()!;
            resolve({ value: item, done: false });
        } else {
            this.queue.push(item);
        }
    }

    end() {
        this.ended = true;
        while (this.resolvers.length > 0) {
            const resolve = this.resolvers.shift()!;
            resolve({ value: undefined as any, done: true });
        }
    }

    async next(): Promise<IteratorResult<T>> {
        if (this.queue.length > 0) {
            return { value: this.queue.shift()!, done: false };
        }
        if (this.ended) {
            return { value: undefined as any, done: true };
        }

        return new Promise<IteratorResult<T>>((resolve) => {
            this.resolvers.push(resolve);
        });
    }

    reset() {
        this.queue = [];
        this.resolvers = [];
        this.ended = false;
    }

    // Makes the queue itself an async iterator
    [Symbol.asyncIterator]() {
        return this;
    }
}