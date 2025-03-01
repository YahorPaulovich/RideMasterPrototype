import { _decorator } from 'cc';
import { Collectible } from './Collectible';
const { ccclass } = _decorator;

@ccclass('Coin')
export class Coin extends Collectible {
}
