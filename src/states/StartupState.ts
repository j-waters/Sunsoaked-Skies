import State from './StateManager';
import { Background } from '../scenes/Background';
import Menu from '../scenes/Menu';

export default class StartupState extends State {
	private mainMenu: Menu;
	end(nextState: State) {
		this.scene.stop('main_menu');
	}

	getScenes() {
		this.mainMenu = this.scene.getScene('main_menu') as Menu;
	}

	initScenes() {
		this.mainMenu = this.scene.add('main_menu', Menu) as Menu;
	}

	start(previousState: State) {
		console.log('menu', this.mainMenu);
		this.scene.run('main_menu');
		this.getScenes();
	}
}
