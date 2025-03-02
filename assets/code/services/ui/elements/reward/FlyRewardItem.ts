import { _decorator, Component, Vec3, tween, CCFloat, CCInteger } from "cc";
const { ccclass, property } = _decorator;

@ccclass("FlyRewardItem")
export class FlyRewardItem extends Component {
    private targetPosition: Vec3 = new Vec3();
    private onReachTarget: Function | null = null;

    @property(CCInteger) private randOffsetMultiplier: number = 100;
    @property(CCFloat) private flyAnimationTime: number = 0.2;
    @property(CCFloat) private targetAnimationTime: number = 0.5;

    public fly(startPosition: Vec3, targetPosition: Vec3, callback: Function) {
        this.node.position = startPosition;
        this.targetPosition = targetPosition;
        this.onReachTarget = callback;

        this.moveToTarget();
    }

    private moveToTarget(): void {

        let randOffset = new Vec3(
            Math.random() * 2 * this.randOffsetMultiplier - 1 * this.randOffsetMultiplier,
            Math.random() * 2 * this.randOffsetMultiplier - 1 * this.randOffsetMultiplier,
            0
        );

        tween(this.node)
        .to(this.flyAnimationTime, { position: randOffset }, { easing: "sineOut" })
        .call(() => {
            tween(this.node)
                .to(this.targetAnimationTime, { position: this.targetPosition }, { easing: "sineIn" })
                .call(() => {
                    this.onReachTarget && this.onReachTarget(this.node);
                })
                .start();
        })
        .start();
    }
}