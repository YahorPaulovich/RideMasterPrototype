import { AssetAddress } from '../../services/asset-management/AssetAddress';
import { ISceneManagementService } from '../../services/scene-management/ISceneManagementService';
import { SceneManagementService } from '../../services/scene-management/SceneManagementService';
import { AssetProviderService } from '../../services/asset-management/AssetProviderService';
import IAssetProviderService from '../../services/asset-management/IAssetProviderService';
import { GameFactory } from '../factory/GameFactory';
import { IGameFactory } from '../factory/IGameFactory';
import { Vec3 } from 'cc';

export class EntryPoint {

    private static instance: EntryPoint | null = null;
    private sceneManagementService: ISceneManagementService;
    private assets: IAssetProviderService;
    private gameFactory: IGameFactory;

    private constructor() {
        this.initialize();
    }

    public static run(): EntryPoint {
        if (this.instance == null) {
            this.instance = new EntryPoint();
        }
        
        return this.instance;
    }

    private async initialize(): Promise<void> {
        this.sceneManagementService = new SceneManagementService();
        await this.sceneManagementService.loadAsync(AssetAddress.GameScenePath);

        this.assets = new AssetProviderService();
        this.gameFactory = new GameFactory(this.assets);

        this.gameFactory.createCharacter(new Vec3(0, 0, 0));
    }
}
