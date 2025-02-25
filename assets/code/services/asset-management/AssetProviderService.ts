import { Asset, Node, Vec3, Quat, resources, instantiate, Prefab, director, JsonAsset, SpriteFrame, assetManager, ImageAsset, Texture2D } from 'cc';
import IAssetProviderService from './IAssetProviderService';

export class AssetProviderService implements IAssetProviderService {
  private completedCache: Map<string, Asset> = new Map();
  
  public async instantiate(path: string): Promise<Node>;
  public async instantiate(path: string, position: Vec3): Promise<Node>;
  public async instantiate(path: string, position: Vec3, rotation: Quat, parent: Node): Promise<Node>;
  public async instantiate<T extends Asset>(address: string): Promise<T>;
  public async instantiate<T extends Asset>(address: string, position: Vec3): Promise<T>;
  public async instantiate<T extends Asset>(address: string, position: Vec3, rotation: Quat, parent: Node): Promise<T>;

  public async instantiate<T extends Asset>(
    address: string,
    position?: Vec3,
    rotation?: Quat,
    parent?: Node
  ): Promise<Node | T> {
    let asset = await this.loadAsset(address);

    if (asset instanceof Prefab) {
      let node = instantiate(asset);

      if (position) {
        node.setPosition(position);
      }

      if (rotation) {
        node.setRotation(rotation);
      }

      if (parent) {
        parent.addChild(node);
      } else {
        let currentScene = director.getScene();
        if (currentScene) {
          currentScene.addChild(node);
        } else {
          console.error('No active scene found. Cannot add prefab to scene.');
        }
      }

      return node;
    }

    return asset as T;
  }

  public async load<T extends Asset>(address: string): Promise<T> {
    if (this.completedCache.has(address)) {
      return this.completedCache.get(address) as T;
    }

    let asset = await this.loadAsset(address);
    this.completedCache.set(address, asset);
    return asset as T;
  }

  public loadSpriteFrame(path: string): Promise<SpriteFrame> {
      return new Promise((resolve, reject) => {
          resources.load(path, ImageAsset, (err, imageAsset) => {
              if (err) {
                  reject(err);
              } else {
                  try {
                    let spriteFrame = new SpriteFrame();
                    let texture = new Texture2D();
                    texture.image = imageAsset;
                    spriteFrame.texture = texture;
                    resolve(spriteFrame);
                } catch (error) {
                    reject(error);
                }
              }
          });
      });
  }

  private async loadAsset(address: string): Promise<Asset> {
    return new Promise<Asset>((resolve, reject) => {
      resources.load(address, (err, asset) => {
        if (err) {
          reject(err);
        } else {
          resolve(asset);
        }
      });
    });
  }
}
