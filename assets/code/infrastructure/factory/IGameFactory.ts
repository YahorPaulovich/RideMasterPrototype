import { Vec3 } from "cc";

export interface IGameFactory {
    createPrefab(assetAddress: string, at: Vec3): Promise<Node>;
    createCharacter(at: Vec3): Promise<Node>;
    createCoin(at: Vec3): Promise<Node>;
    createMachine(at: Vec3): Promise<Node>;
    createRoad(at: Vec3): Promise<Node>;
}
