import { _decorator, Component, tween, Vec3 } from 'cc';

const { ccclass, property } = _decorator;

@ccclass('PulsatingButton')
export class PulsatingButton extends Component {
    @property
    private pulseScale: number = 1.2;

    @property
    private pulseDuration: number = 0.5;

    @property
    private pulseInterval: number = 1;

    @property
    private pulseCount: number = 3;

    private isPulsating: boolean = false;

    protected onLoad() {
        this.startPulsating();
    }

    private startPulsating() {
        if (this.isPulsating) return;

        this.isPulsating = true;

        const originalScale = this.node.scale.clone();
        let count = 0;

        const pulse = () => {
            if (!this.isPulsating || count >= this.pulseCount) {
                this.scheduleOnce(() => {
                    if (this.isPulsating) {
                        count = 0;
                        pulse();
                    }
                }, this.pulseInterval);
                return;
            }

            tween(this.node)
                .to(this.pulseDuration, { scale: new Vec3(this.pulseScale, this.pulseScale, this.pulseScale) }, { easing: 'sineOut' })
                .to(this.pulseDuration, { scale: originalScale }, { easing: 'sineIn' })
                .call(() => {
                    count++;
                    pulse();
                })
                .start();
        };

        pulse();
    }

    public stopPulsating() {
        this.isPulsating = false;
        tween(this.node).stop();
        this.node.scale = new Vec3(1, 1, 1);
    }

    public setPulseInterval(interval: number): void {
        this.pulseInterval = interval;
    }

    public setPulseScale(scale: number): void {
        this.pulseScale = scale;
    }

    public setPulseDuration(duration: number): void {
        this.pulseDuration = duration;
    }

    public setPulseCount(count: number): void {
        this.pulseCount = count;
    }
}
