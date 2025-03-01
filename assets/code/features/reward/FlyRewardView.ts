import { _decorator, Component, Node, Vec3 } from "cc";
import { IUIFactory } from "../../services/ui/factory/IUIFactory";
import { FlyRewardItem } from "./FlyRewardItem";
const { ccclass, property } = _decorator;

@ccclass("FlyRewardView")
export class FlyRewardView extends Component {
    @property(Node)
    parentNode: Node = null!;

    @property(Node)
    targetNode: Node = null!;

    private flyRewardItems: Node[] = [];
    private onFlyRewardItemReachedTarget: Function | null = null;

    private uiFactory: IUIFactory;

    public inject(uiFactory: IUIFactory): void {
        this.uiFactory = uiFactory
    }

    public async fly(startPos: Vec3, count: number, callback?: Function) {
        this.onFlyRewardItemReachedTarget = callback || null;

        let targetWorldPosition  = this.targetNode.getWorldPosition();
        let targetLocalPosition = this.parentNode.inverseTransformPoint(new Vec3(), targetWorldPosition);

        for (let i = 0; i < count; i++) {
            let flyRewardItem = await this.uiFactory.getFlyRewardItem();
            this.parentNode.addChild(flyRewardItem);
            this.flyRewardItems.push(flyRewardItem);

            let flyItem = flyRewardItem.getComponent(FlyRewardItem);
            if (flyItem) {
                flyItem.fly(startPos, targetLocalPosition, (node: Node) => {
                    this.onRewardItemReachedTarget(node);
                });
            }
        }
    }

    private onRewardItemReachedTarget(node: Node) {
        this.uiFactory.releaseFlyRewardItem(node);
        this.flyRewardItems = this.flyRewardItems.filter((item) => item !== node);

        if (this.onFlyRewardItemReachedTarget) {
            this.onFlyRewardItemReachedTarget();
        }

        if (this.flyRewardItems.length === 0) {
            console.log("All reward items reached the target");
        }
    }
}