import { _decorator, Component, Node, Button } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('GameScreenView')
export class GameScreenView extends Component {
    @property({ type: Node })
    public pointsView: Node | null = null;

    @property({ type: Node })
    public leverButton: Node | null = null;

    @property({ type: Node })
    private downloadButton: Node | null = null;

    onLoad() {
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
        console.log('DownloadButton clicked');
    }
}