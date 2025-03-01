import { AssetAddress } from '../../asset-management/AssetAddress';
import { IUIFactory } from './IUIFactory';
import IAssetProviderService from '../../asset-management/IAssetProviderService';

import { Node } from 'cc';
import { ObjectPool } from '../../asset-management/ObjectPool';

export class UIFactory implements IUIFactory {
    private assets: IAssetProviderService;

    private uiRoot: Node | null = null;
    private canvas: Node | null = null;
    private flyRewardItemPool: ObjectPool<Node>;
    
    constructor(assets: IAssetProviderService) {
        this.assets = assets;
        this.flyRewardItemPool = new ObjectPool<Node>(() => this.createFlyRewardItem());
    }

    public async createUIRoot(): Promise<Node | null> {
        this.uiRoot = await this.assets.instantiate(AssetAddress.UIRootPath) as Node;
        this.canvas = await this.assets.instantiate(AssetAddress.CanvasPath) as Node;
        this.uiRoot.addChild(this.canvas);
        this.createEventSystem();

        return this.uiRoot;
    }

    public async createUIElement(path: string): Promise<Node | null> {
        if (this.canvas == null) {
            await this.createUIRoot();
        }

        let prefabInstance = await this.assets.instantiate(path);
        this.canvas.addChild(prefabInstance);

        await console.log(prefabInstance.name + ' has been created.');
        return prefabInstance;
    }

    private async createEventSystem(): Promise<Node | null> {
        return this.createUIElement(AssetAddress.EventSystemPath);
    }

    public async createGameScreenView(): Promise<Node | null> {
        return this.createUIElement(AssetAddress.GameScreenViewPath);
    }

    public async createFailView(): Promise<Node | null> {
        return this.createUIElement(AssetAddress.FailViewPath);
    }

    public async createFlyRewardView(): Promise<Node | null> {
        return this.createUIElement(AssetAddress.FlyRewardViewPath);
    }

    public async createFlyRewardItem(): Promise<Node> {
        return await this.assets.instantiate(AssetAddress.FlyRewardItemPath);
    }

    public async getFlyRewardItem(): Promise<Node> {
        return await this.flyRewardItemPool.get();
    }

    public releaseFlyRewardItem(coin: Node): void {
        this.flyRewardItemPool.release(coin);
    }
}
