import { _decorator } from 'cc';
import { BaseView } from './BaseView';
import { EntryPoint } from '../../../infrastructure/composition-root/EntryPoint';

const { ccclass } = _decorator;

@ccclass('FailView')
export class FailView extends BaseView {
    private async onRetryButtonClicked() {
        this.showAds();
        await EntryPoint.restartGame();
    }
}