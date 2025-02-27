import { Node, Vec3 } from 'cc';

import { ISceneManagementService } from '../../services/scene-management/ISceneManagementService';
import { SceneManagementService } from '../../services/scene-management/SceneManagementService';
import { AssetAddress } from '../../services/asset-management/AssetAddress';
import IAssetProviderService from '../../services/asset-management/IAssetProviderService';
import { AssetProviderService } from '../../services/asset-management/AssetProviderService';
import { IInputService } from '../../services/input/IInputService';
import { MobileInputService } from '../../services/input/MobileInputService';
import { IUIFactory } from '../../services/ui/factory/IUIFactory';
import { UIFactory } from '../../services/ui/factory/UIFactory';
import { IGameFactory } from '../factory/IGameFactory';
import { GameFactory } from '../factory/GameFactory';
import PlayerInputActions from '../../features/Input/PlayerInputActions';
import { GameScreenView } from '../../services/ui/elements/GameScreenView';
import PlayerMovement from '../../features/Movement/PlayerMovement';

export class EntryPoint {

    private static instance: EntryPoint | null = null;
    private sceneManagementService: ISceneManagementService;
    private assets: IAssetProviderService;
    private input: IInputService;
    private uiFactory: IUIFactory;
    private gameFactory: IGameFactory;

    private player: Node;
    private leverButton: Node;

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
        // scene management
        this.sceneManagementService = new SceneManagementService();
        await this.sceneManagementService.loadAsync(AssetAddress.GameScenePath);

        // assets
        this.assets = new AssetProviderService();

        // input
        this.input = new MobileInputService();

        // ui
        await this.initUI();

        // game creation
        this.gameFactory = new GameFactory(this.assets);

        // level creation
        await this.initLevel();
        
        // player creation
        let player = await this.initPlayer();
        await this.initMainCamera(player);
    }

    private async initUI() {
        this.uiFactory = new UIFactory(this.assets);
        await this.uiFactory.createBackground();
        let gameScreenView = await this.uiFactory.createGameScreenView();
        this.leverButton = gameScreenView.getComponent(GameScreenView).leverButton;
    }

    private async initLevel() {
        await this.gameFactory.createRoad(new Vec3(0, 0, 0));
    }

    private async initPlayer() {
        this.player = await this.gameFactory.createPlayer(new Vec3(-45.178, 0.001, 0));
        this.player.getComponent(PlayerInputActions).inject(this.input, this.leverButton);
        this.player.getComponent(PlayerMovement).enableInput();
        return this.player;
    }

    private async initMainCamera(player: Node) {
        let mainCamera = await this.gameFactory.createMainCamera(new Vec3(0, 0, 0), new Vec3(-23.371, -10, 0));
        player.addChild(mainCamera);
        mainCamera.position = new Vec3(-1.383, 11.911, 14.472);
    }
}
