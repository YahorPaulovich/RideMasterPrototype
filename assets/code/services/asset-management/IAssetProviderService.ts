import { IService } from '../IService';
import { Asset, Node, Vec3, Quat } from 'cc';

export default interface IAssetProviderService extends IService {
  instantiate(path: string): Promise<Node>;
  instantiate(path: string, position: Vec3): Promise<Node>;
  instantiate(path: string, position: Vec3, rotation: Quat): Promise<Node>;
  instantiate<T extends Asset>(address: string): Promise<T>;
  instantiate<T extends Asset>(address: string, position: Vec3): Promise<T>;
  instantiate<T extends Asset>(address: string, position: Vec3, rotation: Quat, parent: Node): Promise<T>;
  load<T extends Asset>(address: string): Promise<T>;
}
