import { _decorator, Component, RigidBody, Node, Vec3, ConstantForce, EventTarget, Quat } from 'cc';
import PlayerInput from '../input/PlayerInput';
import { PlayerEvents } from '../../data/PlayerEvents';

const { ccclass, property } = _decorator;

@ccclass('PlayerMovement')
export default class PlayerMovement extends Component {
    private input: PlayerInput;
    private rigidBody: RigidBody;
    private constantForce: ConstantForce;

    private isEnabled: boolean = false;
    private speedMultiplier: number = 20;
    private magnitude: number = 0;

    @property public acceleration: number = 12;
    @property public maxSpeed: number = 15;
    @property public deceleration: number = 5;

    public eventTarget: EventTarget;
    
    private initialize(): void {
        this.eventTarget = new EventTarget();

        this.input = this.node.getComponent(PlayerInput);

        this.rigidBody = this.node.getComponent(RigidBody);
        this.rigidBody.useCCD = true;
        this.rigidBody.angularFactor.set(new Vec3(0, 0, 0));

        this.constantForce = this.node.getComponent(ConstantForce);
    }

    protected update(dt: number): void {
        if (!this.isEnabled) return;

        this.handleFallDetection();

        this.magnitude = Math.abs(this.input.y);

        if (this.input.y > 0) {
            this.accelerate(dt);
        } else if (this.input.y < 0) {
            this.brake(dt);
        }
    }

    private handleFallDetection(): void {
        if (this.node.position.y < -1) {
            this.disableInput();
            this.eventTarget.emit(PlayerEvents.PLAYER_FALL);
            return;
        }
    }

    private accelerate(dt: number): void {
        let currentVelocity = new Vec3();
        this.rigidBody.getLinearVelocity(currentVelocity); 

        if (Math.abs(currentVelocity.x) < this.maxSpeed) {
            this.constantForce.force = new Vec3(
                this.acceleration * this.speedMultiplier * this.magnitude * dt, 0, 0)
            ;
        }
    }

    private brake(dt: number): void {
        let currentVelocity = new Vec3();
        this.rigidBody.getLinearVelocity(currentVelocity);

        if (currentVelocity.x > 0) {
            let newForceX = Math.max(0,
                this.constantForce.force.x - this.deceleration * this.speedMultiplier * this.magnitude * dt
            );
            this.constantForce.force = new Vec3(newForceX, 0, 0);
        } else {
            this.constantForce.force = Vec3.ZERO;
        }
    }

    public enableInput(): void {
        this.initialize();
        this.isEnabled = true;
    }

    public disableInput(): void {
        this.isEnabled = false;
    }

    public onFall(callback: () => void) {
        this.eventTarget.on(PlayerEvents.PLAYER_FALL, callback);
    }

    protected onDestroy(): void {
        this.eventTarget.removeAll(this);
    }
}