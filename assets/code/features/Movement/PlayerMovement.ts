import { _decorator, Component, RigidBody, Node, Vec3, ConstantForce, EventTarget, Quat } from 'cc';
import PlayerInput from '../Input/PlayerInput';

const { ccclass, property } = _decorator;

export const PlayerEvents = {
    PLAYER_FALL: 'player-fall',
};

@ccclass('PlayerMovement')
export default class PlayerMovement extends Component {
    private input: PlayerInput;
    private rigidBody: RigidBody;
    private constantForce: ConstantForce;

    private isInputEnabled: boolean = false;
    private speedMultiplier: number = 20;
    private magnitude: number = 0;

    @property public acceleration: number = 12;
    @property public maxSpeed: number = 15;
    @property public deceleration: number = 5;

    private eventTarget: EventTarget = new EventTarget();

    private initialize(): void {
        this.input = this.node.getComponent(PlayerInput);
        this.rigidBody = this.node.getComponent(RigidBody);
        this.rigidBody.angularFactor.set(new Vec3(0, 0, 0));
        this.constantForce = this.node.getComponent(ConstantForce);
    }

    protected update(dt: number): void {
        if (!this.isInputEnabled) return;

        this.handleFallDetection();

        this.magnitude = Math.abs(this.input.y);

        if (this.input.y > 0) {
            this.accelerate(dt);
        } else if (this.input.y < 0) {
            this.brake(dt);
        }

        this.fixRotation();
        this.fixPosition();
    }

    private fixRotation(): void {
        let currentRotation = this.node.rotation;
        let fixedRotation = new Quat();
        Quat.fromEuler(fixedRotation, currentRotation.x, currentRotation.y, 0);
        this.node.rotation = fixedRotation;
    }

    private fixPosition(): void {
        let currentPosition = this.node.position;
        this.node.setPosition(new Vec3(currentPosition.x, currentPosition.y, 0));
    }

    private handleFallDetection(): void {
        if (this.node.position.y < -10) {
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
        this.isInputEnabled = true;
    }

    public disableInput(): void {
        this.isInputEnabled = false;
    }

    public onFall(callback: () => void) {
        this.eventTarget.on(PlayerEvents.PLAYER_FALL, callback);
    }
}