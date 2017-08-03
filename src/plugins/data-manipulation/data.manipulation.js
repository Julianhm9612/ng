import PluginComponent from '../plugin.component';
import {DATA_MANIPULATION_NAME} from '../definition';
import {Command} from '@grid/core/command';
import {TemplatePath} from '@grid/core/template';
import {Action} from '@grid/core/action';

TemplatePath
	.register(DATA_MANIPULATION_NAME, () => {
		return {
			model: 'data',
			resource: 'data-manipulation'
		};
	});

const Plugin = PluginComponent('data-manipulation');
class DataManipulation extends Plugin {
	constructor() {
		super(...arguments);

		this.changes = {
			deleted: new Set(),
			added: new Set(),
			edited: new Set()
		};

		this.commitCommand = new Command({
			execute: e => {
				const rowId = this.id(e.row);
				this.changes.edited.add(rowId);
				this.changes.edited.add(`${rowId}x${e.column.key}`);
			}
		});

		this.actions = [
			new Action(
				new Command({
					execute: () => {
						const newRow = {};
						const rowId = this.id(newRow);

						this.changes.added.add(rowId);
						this.rows = [newRow].concat(this.rows);
					},
					shortcut: 'F7'
				}),
				'Add New Row',
				'add'
			)];

		this.rowOptions = {
			trigger: 'click',
			actions: [
				new Action(
					new Command({
						canExecute: e => {
							const rowId = this.id(e.row);
							return !this.changes.deleted.has(rowId);
						},
						execute: e => {
							const rowId = this.id(e.row);
							if (this.changes.added.has(rowId)) {
								this.changes.added.delete(rowId);
								this.rows = this.rows.filter(row => this.id(row) !== rowId);
							}
							else {
								this.changes.deleted.add(rowId);
							}
						}
					}),
					'Delete Row',
					'delete'
				),
				new Action(
					new Command({
						execute: e => {
							const rowId = this.id(e.row);
							this.changes.deleted.delete(rowId);
						},
						canExecute: e => {
							const rowId = this.id(e.row);
							this.changes.deleted.has(rowId);
						}
					}),
					'Restore',
					'restore'
				),
				new Action(
					new Command({
						execute: () => {
							// TODO make edit form service
						}
					}),
					'Edit Form',
					'edit'
				)
			]
		};
	}

	onInit() {
		const model = this.model;
		model
			.edit({
				mode: 'cell',
				commit: this.commitCommand
			})
			.style({
				row: this.styleRow.bind(this),
				cell: this.styleCell.bind(this)
			})
			.action({
				items: this.actions
			});
	}

	id(row) {
		return row;
	}

	styleRow(row, context) {
		const rowId = this.id(row);
		if (this.changes.deleted.has(rowId)) {
			context.class('deleted', {opacity: 0.3});
		}
	}

	styleCell(row, column, context) {
		const rowId = this.id(row);
		if (column.type === 'row-indicator') {
			if (this.changes.deleted.has(rowId)) {
				context.class('delete-indicator', {background: '#EF5350'});
			}
			else if (this.changes.added.has(rowId)) {
				context.class('add-indicator', {background: '#C8E6C9'});
			}
			else if (this.changes.edited.has(rowId)) {
				context.class('edit-indicator', {background: '#E3F2FD'});
			}

			return;
		}

		if (this.changes.edited.has(`${rowId}x${column.key}`)) {
			context.class('edited', {background: '#E3F2FD'});
		}
	}

	get resource() {
		return this.model.data().resource;
	}
}

export default DataManipulation.component({
	controller: DataManipulation,
	controllerAs: '$data',
	bindings: {}
});