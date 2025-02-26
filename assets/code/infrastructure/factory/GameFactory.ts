import { Node, Quat, Vec3 } from 'cc';
import IAssetProviderService from '../../services/asset-management/IAssetProviderService';
import { IGameFactory } from './IGameFactory';
import { AssetAddress } from '../../services/asset-management/AssetAddress';

export class GameFactory implements IGameFactory {
    private assets: IAssetProviderService;

    constructor(assets: IAssetProviderService) {
        this.assets = assets;
    }

    public async createPrefab(
        assetAddress: string,
        at: Vec3,
        rotation: Quat | Vec3 = Quat.IDENTITY
    ): Promise<Node> {
        let prefab = null;
        try {
            let finalRotation: Quat;
            if (rotation instanceof Vec3) {
                finalRotation = new Quat();
                Quat.fromEuler(finalRotation, rotation.x, rotation.y, rotation.z);
            } else {
                finalRotation = rotation;
            }

            prefab = await this.assets.instantiate(assetAddress, at, finalRotation);
            console.log(`Prefab "${prefab.name}" was successfully created at position: ${at}, rotation: ${finalRotation}`);
        } catch (error) {
            console.error(`Error creating prefab at ${assetAddress}:`, error);
            throw error;
        }
    
        return prefab;
    }

    public async createMainCamera(at: Vec3, rotation: Vec3): Promise<Node> {
        return await this.createPrefab(AssetAddress.MainCameraPath, at, rotation);
    }

    public async createPlayer(at: Vec3): Promise<Node> {

        return await this.createPrefab(AssetAddress.PlayerPath, at);
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
