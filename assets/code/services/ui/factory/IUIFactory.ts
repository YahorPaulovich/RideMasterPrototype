import { Node } from 'cc';

export interface IUIFactory {
    createUIRoot(): Promise<Node | null>;
    createUIElement(path: string): Promise<Node | null>;
    createBackground(): Promise<Node | null>;
    createGameScreenView(): Promise<Node | null>;
    createFailView(): Promise<Node | null>;
}
