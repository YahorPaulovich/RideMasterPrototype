import { Vec3 } from 'cc';
import IAssetProviderService from '../../services/asset-management/IAssetProviderService';
import { IGameFactory } from './IGameFactory';
import { AssetAddress } from '../../services/asset-management/AssetAddress';

export class GameFactory implements IGameFactory {
    private _assets: IAssetProviderService;

    constructor(assets: IAssetProviderService) {
        this._assets = assets;
    }

    public async createPrefab(assetAddress: string, at: Vec3): Promise<Node> {
        let prefab = null;
        try {
            prefab = await this._assets.instantiate(assetAddress, at);
        } catch (error) {
            console.error(`Error creating prefab at ${assetAddress}:`, error);
            throw error;
        }

        return prefab;
    }

    public async createCharacter(at: Vec3): Promise<Node> {
       return await this.createPrefab(AssetAddress.PlayerCharacterPath, at);
    }

    public async createCoin(at: Vec3): Promise<Node> {
        return await this.createPrefab(AssetAddress.CoinPath, at);
    }

    public async createMachine(at: Vec3): Promise<Node> {
        return await this.createPrefab(AssetAddress.MachinePath, at);
    }
    
    public async createRoad(at: Vec3): Promise<Node> {
        return await this.createPrefab(AssetAddress.RoadPath, at);
    }
}
