import { _decorator, Component, Node, Vec3, Quat, CCBoolean } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('FreezePositionAndRotation')
export class FreezePositionAndRotation extends Component {

    @property(CCBoolean) public freezePosition: boolean = true;
    @property(CCBoolean) public freezeRotation: boolean = true;

    protected update(dt: number): void {
        this.fixPosition();
        this.fixRotation();
    }

    private fixPosition(): void {
        if (this.freezePosition == true) {
            let currentPosition = this.node.position;
            this.node.setPosition(new Vec3(currentPosition.x, currentPosition.y, 0));
        }
    }

    private fixRotation(): void {
        if (this.freezeRotation == true) {
            let currentRotation = this.node.rotation;
            let fixedRotation = new Quat();
            Quat.fromEuler(fixedRotation, currentRotation.x, currentRotation.y, 0);
            this.node.rotation = fixedRotation;
        }
    }
}