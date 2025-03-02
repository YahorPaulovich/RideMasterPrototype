import { _decorator, Component, tween, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('PulsatingButton')
export class PulsatingButton extends Component {
    @property private pulseScale: number = 1.2;
    @property private pulseDuration: number = 0.5;

    protected onLoad() {
        this.startPulsating();
    }

    private startPulsating() {
        const originalScale = this.node.scale.clone();

        tween(this.node)
            .to(this.pulseDuration, { scale: new Vec3(this.pulseScale, this.pulseScale, this.pulseScale) }, { easing: 'sineOut' })
            .to(this.pulseDuration, { scale: originalScale }, { easing: 'sineIn' })
            .union()
            .repeatForever()
            .start();
    }

    public stopPulsating() {
        tween(this.node).stop();
        this.node.scale = new Vec3(1, 1, 1);
    }
}