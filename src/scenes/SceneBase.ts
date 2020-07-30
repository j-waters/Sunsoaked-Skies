import { StateManager } from '../states/StateManager';

export abstract class SceneBase extends Phaser.Scene {
	state: StateManager;

	protected constructor(config: string | Phaser.Types.Scenes.SettingsConfig) {
		super(config);
		this.state = StateManager.create();
	}
	public get gameWidth(): number {
		return this.scale.width as number;
	}

	public get gameHeight(): number {
		return this.scale.height as number;
	}

	protected setView(): void {
		// focus on center
		this.cameras.main.centerOn(0, 0);
	}
}
