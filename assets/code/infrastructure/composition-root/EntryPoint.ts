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
import { PlayerFollowCamera } from '../../features/Camera/PlayerFollowCamera';

export class EntryPoint {

    private static instance: EntryPoint | null = null;
    private sceneManagementService: ISceneManagementService;
    private assets: IAssetProviderService;
    private input: IInputService;
    private uiFactory: IUIFactory;
    private gameFactory: IGameFactory;

    private player: Node;
    private gameScreenView: Node;
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

    public static async restartGame(): Promise<void> {
        if (this.instance) {
            this.instance.cleanup();
            await this.instance.initialize();
        }
    }

    private cleanup(): void {
        if (this.player) {
            this.player.destroy();
            this.player = null;
        }

        if (this.gameScreenView) {
            this.gameScreenView.destroy();
            this.gameScreenView = null;
        }

        if (this.leverButton) {
            this.leverButton.destroy();
            this.leverButton = null;
        }
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

        player.getComponent(PlayerMovement).onFall(async () => {
            await this.showFailScreen();
        });
    }

    private async initUI() {
        this.uiFactory = new UIFactory(this.assets);
        //await this.uiFactory.createBackground();
        this.gameScreenView = await this.uiFactory.createGameScreenView();
        this.leverButton = this.gameScreenView.getComponent(GameScreenView).leverButton;
    }

    private async showFailScreen() {
        this.gameScreenView.destroy();
        this.gameScreenView = null;

        await this.uiFactory.createFailView();
    }

    private async initLevel() {
        await this.gameFactory.createRoad(new Vec3(0, 0, 0));
    }

    private async initPlayer() {
        this.player = await this.gameFactory.createPlayer(new Vec3(-45.178, 0.0015, 0));
        this.player.getComponent(PlayerInputActions).inject(this.input, this.leverButton);
        this.player.getComponent(PlayerMovement).enableInput();
        return this.player;
    }

    private async initMainCamera(player: Node) {
        let mainCamera = await this.gameFactory.createMainCamera(
            new Vec3(-45.178001, 11.833999, 19.999997),
            new Vec3(-28.791458, 2.29061, 0)
        );

        // player camera root
        mainCamera.getComponent(PlayerFollowCamera).setTarget(player);
    }
}
