import { _decorator, Component, sys } from 'cc';
const { ccclass } = _decorator;

@ccclass('BaseScreenView')
export class BaseView extends Component {
    public showAds() {
        let iosLink = "https://apps.apple.com/us/app/ride-master-car-builder-game/id6449224139";
        let androidLink = "https://play.google.com/store/apps/details?id=com.LuB.DeliveryConstruct&hl=en";
            
        if (sys.isNative) {
        } else {
            let url = sys.os === sys.OS.IOS ? iosLink : androidLink;
            window.open(url, "_blank");
        }
    }
}
