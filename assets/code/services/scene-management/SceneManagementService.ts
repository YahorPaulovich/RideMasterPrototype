import { director } from 'cc';
import { ISceneManagementService } from './ISceneManagementService';

export class SceneManagementService implements ISceneManagementService {
    public async loadAsync(sceneName: string, onLoaded?: () => Promise<void>): Promise<void> {
        try {
            await this.loadScene(sceneName);
    
            if (onLoaded) {
                try {
                    await onLoaded();
                } catch (error) {
                    console.error(`Error in onLoaded callback after loading ${sceneName}`, error);
                }
            }
        } catch (error) {
            console.error(`Failed to load scene ${sceneName}`, error);
            throw error;
        }
    }    

    private async loadScene(sceneName: string): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            console.log(`Loading scene: ${sceneName}`);
    
            director.loadScene(sceneName, (err?: Error) => {
                if (err) {
                    console.error(`Error loading scene: ${sceneName}`, err);
                    reject(err);
                } else {
                    console.log(`Scene ${sceneName} loaded`);
                    resolve();
                }
            });
        });
    }    
}
