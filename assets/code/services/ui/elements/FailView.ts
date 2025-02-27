import { _decorator, Button, Component, Node, sys } from 'cc';
import { BaseView } from './BaseView';
import { EntryPoint } from '../../../infrastructure/composition-root/EntryPoint';
const { ccclass, property } = _decorator;

@ccclass('FailView')
export class FailView extends BaseView {
    @property({ type: Button })
    private retryButton: Button | null = null;

    protected onLoad() {
        this.retryButton.node.on(Button.EventType.CLICK, this.onRetryButtonClicked, this);
    }

    private async onRetryButtonClicked() {
        this.showAds();
        await EntryPoint.restartGame();
    }
}