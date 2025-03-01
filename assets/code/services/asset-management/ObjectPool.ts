import { Node } from 'cc';

export class ObjectPool<T extends Node> {
    private pool: T[] = [];
    private factory: () => Promise<T>;

    constructor(factory: () => Promise<T>) {
        this.factory = factory;
    }

    public async get(): Promise<T> {
        if (this.pool.length > 0) {
            return this.pool.pop()!;
        }
        return await this.factory();
    }

    public release(item: T): void {
        this.pool.push(item);
    }

    public clear(): void {
        this.pool.forEach(item => item.destroy());
        this.pool = [];
    }
}