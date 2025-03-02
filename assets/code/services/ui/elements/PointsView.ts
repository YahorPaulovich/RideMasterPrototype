import { _decorator, Component, RichText, tween, Node, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('PointsView')
export class PointsView extends Component {
    @property(RichText) private value: RichText;

    @property(Node)
    public coinIcon: Node = null!;

    public updateUI(coins: number): void {
        this.receivePoints(coins);
    }

    private receivePoints(coins: number): void {
        this.coinIcon.setScale(new Vec3(1, 1, 1));
        tween(this.coinIcon)
            .to(0.08, { scale: new Vec3(1.1, 1.1, 1.1) })
            .to(0.08, { scale: new Vec3(1, 1, 1) })
            .call(()=>{
                this.value.string = coins.toString();
            })
            .start();
    }
}
