import { _decorator, Component, Node, Quat, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('PlayerFollowCamera')
export class PlayerFollowCamera extends Component {

    @property(Node)
    private target: Node = null;

    @property
    private distance: number = 10;

    @property
    private height: number = 5;

    @property
    private smoothSpeed: number = 0.125;

    @property
    private positionOffset: Vec3 = new Vec3(-39.553, 16.918, 18.949);

    @property
    private lookAtOffset: Vec3 = new Vec3(0, 1, 0);

    @property
    private rotationOffset: Quat = new Quat(0, 0, 0, 1);

    protected start() {
        if (!this.target) {
            console.error("Target is not set for PlayerFollowCamera!");
        }
    }

    protected update(deltaTime: number) {
        if (!this.target) return;

        let targetPosition = this.target.position.clone();
        let desiredPosition = new Vec3(
            targetPosition.x,
            targetPosition.y + this.height,
            targetPosition.z + this.distance
        );

        desiredPosition = Vec3.add(new Vec3(), desiredPosition, this.positionOffset);

        let smoothedPosition = new Vec3();
        Vec3.lerp(smoothedPosition, this.node.position, desiredPosition, this.smoothSpeed);
        this.node.position = smoothedPosition;

        let lookAtPoint = Vec3.add(new Vec3(), targetPosition, this.lookAtOffset);
        this.node.lookAt(lookAtPoint);
        this.node.rotate(this.rotationOffset);
    }

    public setTarget(target: Node): void {
        this.target = target;
    }
}