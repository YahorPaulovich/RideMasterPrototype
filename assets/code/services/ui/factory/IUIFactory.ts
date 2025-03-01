import { Node } from 'cc';

export interface IUIFactory {
    createUIRoot(): Promise<Node | null>;
    createUIElement(path: string): Promise<Node | null>;
    createGameScreenView(): Promise<Node | null>;
    createFailView(): Promise<Node | null>;
    createFlyRewardView(): Promise<Node | null>;
    createFlyRewardItem(): Promise<Node>;
    getFlyRewardItem(): Promise<Node>;
    releaseFlyRewardItem(coin: Node): void;
}
