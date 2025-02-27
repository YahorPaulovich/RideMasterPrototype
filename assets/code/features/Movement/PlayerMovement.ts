import { _decorator, Component, Vec3, RigidBody, ConstantForce } from 'cc';
import PlayerInput from '../Input/PlayerInput';

const { ccclass, property } = _decorator;

@ccclass('PlayerMovement')
export default class PlayerMovement extends Component {

    private input: PlayerInput;
    private rigidBody: RigidBody;
    private constantForce: ConstantForce;

    private speedMultiplier: number = 100000;

    @property public acceleration: number = 12;
    @property public maxSpeed: number = 15;
    @property public deceleration: number = 5;

    private isInputEnabled: boolean = false;

    private initialize(): void {
        this.input = this.node.getComponent(PlayerInput);
        this.rigidBody = this.node.getComponent(RigidBody);
        this.constantForce = this.node.getComponent(ConstantForce);
    }

    protected update(dt: number): void {
        if (!this.isInputEnabled) return;

        if (this.input.y > 0) {
            this.accelerate(dt);
        } else if (this.input.y < 0) {
            this.brake(dt);
        }
    }

    private accelerate(dt: number): void {
        let currentVelocity = new Vec3();
        this.rigidBody.getLinearVelocity(currentVelocity); 

        if (Math.abs(currentVelocity.x) < this.maxSpeed) {
            this.constantForce.force = new Vec3(this.acceleration * this.speedMultiplier * dt, 0, 0);
        }
    }

    private brake(dt: number): void {
        let currentVelocity = new Vec3();
        this.rigidBody.getLinearVelocity(currentVelocity);

        if (currentVelocity.x > 0) {
            let newForceX = Math.max(0, this.constantForce.force.x - this.deceleration * this.speedMultiplier * dt);
            this.constantForce.force = new Vec3(newForceX, 0, 0);
        } else {
            this.constantForce.force = Vec3.ZERO;
        }
    }

    public enableInput(): void {
        this.initialize();
        this.isInputEnabled = true;
    }

    public disableInput(): void {
        this.isInputEnabled = false;
    }
}