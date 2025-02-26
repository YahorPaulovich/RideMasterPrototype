import { AssetAddress } from '../../asset-management/AssetAddress';
import { IUIFactory } from './IUIFactory';
import IAssetProviderService from '../../asset-management/IAssetProviderService';

import { Node } from 'cc';

export class UIFactory implements IUIFactory {
    private uiRoot: Node | null = null;
    private canvas: Node | null = null;

    private assets: IAssetProviderService;

    constructor(assets: IAssetProviderService) {
        this.assets = assets;
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

    public async createBackground(): Promise<Node | null> {
        return this.createUIElement(AssetAddress.BackgroundPath);
    }

    public async createGameScreenView(): Promise<Node | null> {
        return this.createUIElement(AssetAddress.GameScreenViewPath);
    }

    public async createFailView(): Promise<Node | null> {
        return this.createUIElement(AssetAddress.GameScreenViewPath);
    }
}
