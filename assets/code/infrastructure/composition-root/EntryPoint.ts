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
    private _sceneManagementService: ISceneManagementService;
    private _assets: IAssetProviderService;
    private _gameFactory: IGameFactory;

    private constructor() {
        this.initializeGame();
    }

    public static run(): EntryPoint {
        if (this.instance == null) {
            this.instance = new EntryPoint();
        }
        
        return this.instance;
    }

    private async initializeGame(): Promise<void> {
        this._sceneManagementService = new SceneManagementService();
        await this._sceneManagementService.loadAsync(AssetAddress.GameScenePath);

        this._assets = new AssetProviderService();
        this._gameFactory = new GameFactory(this._assets);

        this._gameFactory.createCharacter(new Vec3(0, 0, 0));
    }
}
