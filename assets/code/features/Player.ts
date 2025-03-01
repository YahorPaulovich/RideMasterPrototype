import { _decorator, Collider, Component, EventTarget, ICollisionEvent } from 'cc';
import { Collectible } from '../data/collectibles/Collectible';
import { PlayerEvents } from '../data/PlayerEvents';

const { ccclass, property } = _decorator;

@ccclass('Player')
export default class Player extends Component {
    private collider: Collider;
    public eventTarget: EventTarget;

    protected onLoad(): void {
        this.initialize();
    }
    
    private initialize(): void {
        if (this.collider) {
            this.collider?.off('onCollisionEnter', this.onCollisionEnter, this);
        }

        this.collider = this.node.getComponent(Collider);
        this.collider.on('onCollisionEnter', this.onCollisionEnter, this);
        
        this.eventTarget = new EventTarget();
    }

    public onCollectCollectible(callback: (collectible: Collectible) => void) {
        this.eventTarget.on(PlayerEvents.PLAYER_COLLECT_COLLECTIBLE, callback);
    }

    protected onCollisionEnter(event: ICollisionEvent) {
        const otherNode = event.otherCollider.node;
        if (otherNode.name.includes("Road_Block")) {
            this.eventTarget.emit(PlayerEvents.PLAYER_RAN_OVER_ROAD_BLOCK, otherNode);
        }
    }

    protected onDestroy(): void {
        this.collider.off('onCollisionEnter', this.onCollisionEnter, this);
        this.eventTarget.removeAll(this);
    }
}