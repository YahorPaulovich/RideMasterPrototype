import { _decorator, Component, Node } from 'cc';
const { ccclass } = _decorator;

@ccclass('LeverButton')
export class LeverButton extends Component {
    protected onDestroy(): void {
        this.node.targetOff(this);
    }
}
