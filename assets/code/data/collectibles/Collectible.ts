import { _decorator, Collider, Component, ITriggerEvent, Node } from 'cc';
import { ICollectible } from './ICollectible';
import Player from '../../features/Player';
import { PlayerEvents } from '../PlayerEvents';
const { ccclass } = _decorator;

@ccclass('Collectible')
export class Collectible extends Component implements ICollectible {
    private collider: Collider;

    protected start() {
        this.collider = this.node.getComponent(Collider);
        this.collider.on('onTriggerEnter', this.onTriggerEnter, this);
    }

    protected onTriggerEnter(event: ITriggerEvent) {
        if (event.otherCollider.node.name === 'Player') {
            let player = event.otherCollider.node.getComponent(Player);
            if (player) {
                player.eventTarget.emit(PlayerEvents.PLAYER_COLLECT_COLLECTIBLE, this);
            }

            this.node.destroy();
        }
    }

    protected onDestroy(): void {
        this.collider.off('onTriggerEnter', this.onTriggerEnter, this);
    }
}
