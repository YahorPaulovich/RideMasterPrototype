import { WorldData } from './WorldData';

export class PlayerProgress {
    public worldData: WorldData;
    public coins: number;

    constructor(initialLevel: string) {
        this.worldData = new WorldData(initialLevel);
        this.coins = 0;
    }
}
