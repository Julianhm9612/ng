import PluginComponent from '../plugin.component';
import Command from 'core/infrastructure/command';
import {SELECTION_BAR_NAME} from '../definition';
import TemplatePath from 'core/template/template.path';

TemplatePath
	.register(SELECTION_BAR_NAME, () => {
		return {
			model: 'selection',
			resource: 'content'
		};
	});

const Plugin = PluginComponent('selection-bar');
class SelectionBar extends Plugin {
	constructor() {
		super(...arguments);

		this.unit = 'row';
		this.units = ['row', 'column', 'cell', 'checkbox'];

		this.mode = 'single';
		this.modes = ['single', 'multiple'];

		this.toggleMode = new Command({
			execute: (mode) => {
				const selection = this.model.selection;
				selection({mode: mode});
			}
		});

		this.toggleUnit = new Command({
			execute: (unit) => {
				const selection = this.model.selection;
				selection({unit: unit});
			}
		});
	}

	onInit() {
		const selection = this.model.selection();
		this.mode = selection.mode;
		this.unit = selection.unit;

		this.model.selectionChanged.watch(e => {
			this.unit = e.state.unit;
			this.mode = e.state.mode;
		});
	}

	get count() {
		return this.model.selection().items.length;
	}

	get resource() {
		return this.model.visibility().resource;
	}
}

export default SelectionBar.component({
	controller: SelectionBar,
	controllerAs: '$selectionBar'
});