import Directive from './directive';
import {AUTOFOCUS_NAME, GRID_NAME} from '@grid/view/definition';
import {noop, isUndefined} from '@grid/core/utility';

class Autofocus extends Directive(AUTOFOCUS_NAME, {root: `${GRID_NAME}`}) {
	constructor($scope, $element, $timeout) {
		super();

		this.$scope = $scope;
		this.$element = $element;
		this.$timeout = $timeout;

		this.dataChangedOff = noop;
	}

	onInit() {
		const markupOff = this.$scope.$watch(
			() => Object.keys(this.table.markup).find(p => p.startsWith('table')),
			key => {
				if (key) {
					this.$timeout(() => {
						this.root.markup[key].focus();
					}, 100);
					markupOff();
				}
			});

		const rowsOff = this.$scope.$watch(
			() => this.table.body.rowCount(),
			count => {
				if (count) {
					const focusableIndex = this.table.data.columns().findIndex(c => c.canFocus);
					this.model.focus({
						rowIndex: 0,
						columnIndex: focusableIndex
					});

					rowsOff();
				}
			});
	}

	get model() {
		return this.root.model;
	}

	get table() {
		return this.root.table;
	}

	onDestroy() {
		this.dataChangedOff();
	}
}

Autofocus.$inject = ['$scope', '$element', '$timeout'];

export default {
	restrict: 'A',
	bindToController: true,
	controllerAs: '$autofocus',
	controller: Autofocus,
	require: Autofocus.require,
	link: Autofocus.link,
	scope: false
};