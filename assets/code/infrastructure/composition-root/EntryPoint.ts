import { Node, Quat, RigidBody, tween, Vec3 } from 'cc';

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
import PlayerInputActions from '../../features/input/PlayerInputActions';
import { GameScreenView } from '../../services/ui/elements/GameScreenView';
import PlayerMovement from '../../features/movement/PlayerMovement';
import { PlayerFollowCamera } from '../../features/camera/PlayerFollowCamera';
import { IPersistentProgressService } from '../../services/persistent-progress/IPersistentProgressService';
import { PlayerProgress } from '../../data/PlayerProgress';
import { PersistentProgressService } from '../../services/persistent-progress/PersistentProgressService';
import Player from '../../features/Player';
import { Coin } from '../../data/collectibles/Coin';
import { PlayerEvents } from '../../data/PlayerEvents';
import { FlyRewardView } from '../../features/reward/FlyRewardView';

export class EntryPoint {

    private static instance: EntryPoint | null = null;
    private sceneManagementService: ISceneManagementService;
    private assets: IAssetProviderService;
    private input: IInputService;
    private persistentProgress: IPersistentProgressService
    private uiFactory: IUIFactory;
    private gameFactory: IGameFactory;

    private player: Node;
    private gameScreen: Node;
    private flyReward: FlyRewardView;
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
            let player = this.player.getComponent(Player);
            if (player) {
                player.eventTarget.off(PlayerEvents.PLAYER_RAN_OVER_ROAD_BLOCK);
                player.eventTarget.off(PlayerEvents.PLAYER_COLLECT_COLLECTIBLE);
            }
    
            let playerMovement = this.player.getComponent(PlayerMovement);
            if (playerMovement) {
                playerMovement.eventTarget.off(PlayerEvents.PLAYER_FALL);
            }
    
            this.player.destroy();
            this.player = null;
        }

        if (this.gameScreen) {
            this.gameScreen.destroy();
            this.gameScreen = null;
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

        // stats
        this.initPlayerProgress();

        // ui
        await this.initUI();

        // game creation
        this.gameFactory = new GameFactory(this.assets);

        // level creation
        await this.initLevel();
        
        // player creation
        let player = await this.initPlayer();
        await this.initMainCamera(player);

        player.getComponent(Player).eventTarget.on(PlayerEvents.PLAYER_RAN_OVER_ROAD_BLOCK, (roadBlockNode) => {
            this.handlePlayerRanOverRoadBlock(roadBlockNode);
        });

        player.getComponent(Player).onCollectCollectible((collectible) => {
            if (collectible instanceof Coin) {
                this.handleCoinCollection();
            }
        });

        player.getComponent(PlayerMovement).onFall(async () => {
            await this.showFailScreen();
        });
    }

    private async initUI(): Promise<void> {
        this.uiFactory = new UIFactory(this.assets);
        this.gameScreen = await this.uiFactory.createGameScreenView();
        
        let gameScreenView = this.gameScreen.getComponent(GameScreenView);
        this.leverButton = gameScreenView.leverButton;

        this.flyReward = gameScreenView.flyRewardView;
        this.flyReward.inject(this.uiFactory);
    }

    private async initLevel(): Promise<void> {
        await this.gameFactory.createRoad(new Vec3(0, 0, 0));
    }

    private async initPlayer(): Promise<Node> {
        this.player = await this.gameFactory.createPlayer(new Vec3(-45.178, 0.0015, 0));
        this.player.getComponent(PlayerInputActions).inject(this.input, this.leverButton);
        this.player.getComponent(PlayerMovement).enableInput();
        return this.player;
    }

    private async initMainCamera(player: Node): Promise<void> {
        let mainCamera = await this.gameFactory.createMainCamera(
            new Vec3(-45.178001, 11.833999, 19.999997),
            new Vec3(-28.791458, 2.29061, 0)
        );

        // player camera root
        mainCamera.getComponent(PlayerFollowCamera).setTarget(player);
    }

    private initPlayerProgress(): void { 
        let playerProgress = new PlayerProgress("game");
        this.persistentProgress = new PersistentProgressService(playerProgress);

        console.log(`Coins ${this.persistentProgress.progress.coins}`);
    }

    private handlePlayerRanOverRoadBlock(roadBlockNode: Node): void {
        let startPosition = roadBlockNode.position.clone();
        let endPosition = new Vec3(startPosition.x, startPosition.y - 150, startPosition.z);
        let endRotation = Quat.fromEuler(new Quat(), 0, 0, 90);

        let fallDelay = 0.2;
        let fallDuration = 8;

        tween(roadBlockNode)
            .delay(fallDelay)
            .to(fallDuration, { position: endPosition, rotation: endRotation }, { easing: 'sineOut' })
            .call(() => {
                roadBlockNode.destroy();
            })
            .start();
    }

    private async handleCoinCollection(): Promise<void> {
        this.setReward(1);
    }

    private setReward(count: number = 1): void {
        let playerPosition = this.player.getWorldPosition();
        let startPosition = new Vec3(playerPosition.x, playerPosition.y, -1);

        this.flyReward.fly(startPosition, count, () => {
            this.persistentProgress.progress.coins += 1;
            let coins = this.persistentProgress.progress.coins;

            let gameScreenView = this.gameScreen.getComponent(GameScreenView);
            gameScreenView.pointsView.updateUI(coins);
        });
    }

    private async showFailScreen(): Promise<void> {
        this.gameScreen.destroy();
        this.gameScreen = null;
        await this.uiFactory.createFailView();

        this.player.getComponent(RigidBody).mass = 900;
    }
}