import { _decorator, Component, Node, Button } from 'cc';
import { BaseView } from './BaseView';
import { PointsView } from './PointsView';
import { FlyRewardView } from './reward/FlyRewardView';
import { TutorView } from './tutor/TutorView';
const { ccclass, property } = _decorator;

@ccclass('GameScreenView')
export class GameScreenView extends BaseView {
    @property({ type: TutorView })
    public tutorView: TutorView | null = null;

    @property({ type: PointsView })
    public pointsView: PointsView | null = null;

    @property({ type: FlyRewardView })
    public flyRewardView: FlyRewardView | null = null;

    @property({ type: Node })
    public leverButton: Node | null = null;

    @property({ type: Node })
    private downloadButton: Node | null = null;

    protected onLoad() {
        this.setupButtonListeners();
    }

    private setupButtonListeners() {
        if (this.downloadButton) {
            const button = this.downloadButton.getComponent(Button);
            if (button) {
                button.node.on(Button.EventType.CLICK, this.onDownloadButtonClicked, this);
            }
        }
    }

    private onDownloadButtonClicked() {
        this.showAds();
    }
}