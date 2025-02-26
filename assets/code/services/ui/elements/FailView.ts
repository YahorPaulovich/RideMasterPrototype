import { _decorator, Button, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('FailView')
export class FailView extends Component {
    @property({ type: Button })
    private retryButton: Button | null = null;

    onLoad() {
        if (this.retryButton != null) {
            if (this.retryButton) {
                this.retryButton.node.on(Button.EventType.CLICK, this.onRetryButtonClicked, this);
            }
        }
    }

    private onRetryButtonClicked() {
        console.log('RetryButton clicked');
    }

    public showFailView() {
        if (this.node) {
            this.node.active = true;
        }
    }

    public hideFailView() {
        if (this.node) {
            this.node.active = false;
        }
    }
}