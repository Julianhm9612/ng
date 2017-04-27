import Component from '../component';
import Table from 'ng/services/dom/table';
import BodyView from 'core/body/body.view';
import HeadView from 'core/head/head.view';
import FootView from 'core/foot/foot.view';
import LayoutView from 'core/layout/layout.view';
import GroupView from 'core/group/group.view';
import PivotView from 'core/pivot/pivot.view';
import NavigationView from 'core/navigation/navigation.view';
import HighlightView from 'core/highlight/highlight.view';
import SortView from 'core/sort/sort.view';
import FilterView from 'core/filter/filter.view';
import EditView from 'core/edit/edit.view';
import SelectionView from 'core/selection/selection.view';
import PaginationView from 'core/pagination/pagination.view';
import TableView from 'core/table/table.view';
import StyleView from 'core/style/style.view';
import ColumnView from 'core/column/column.view';
import ScrollView from 'core/scroll/scroll.view';
import {GRID_NAME, TH_CORE_NAME} from 'ng/definition';
import {isUndefined} from 'core/services/utility';
import TemplateLink from '../template/template.link';
import PipeUnit from 'core/pipe/units/pipe.unit'

class ViewCore extends Component {
	constructor($scope, $element, $timeout, $compile, $templateCache, grid, vscroll) {
		super();

		this.$scope = $scope;
		this.element = $element[0];
		this.$timeout = $timeout;
		this.$postLink = this.onLink;
		this.serviceFactory = grid.service.bind(grid);
		this.template = new TemplateLink($compile, $templateCache);
		this.vscroll = vscroll;
	}

	onLink() {
		const model = this.model;
		const table = new Table(model, this.root.markup, this.template);

		const service = this.serviceFactory(model);
		const apply = (f, timeout) => {
			if (isUndefined(timeout)) {
				this.$scope.$applyAsync(f);
			}

			return this.$timeout(f, timeout);
		};

		this.style = new StyleView(model, table);
		this.table = new TableView(model);
		this.head = new HeadView(model, table, TH_CORE_NAME);
		this.body = new BodyView(model, table);
		this.foot = new FootView(model);
		this.columns = new ColumnView(model);
		this.layout = new LayoutView(model, table, service);
		this.selection = new SelectionView(model, table, apply);
		this.group = new GroupView(model);
		this.pivot = new PivotView(model);
		this.highlight = new HighlightView(model, table, apply);
		this.sort = new SortView(model);
		this.filter = new FilterView(model);
		this.edit = new EditView(model, table, apply);
		this.nav = new NavigationView(model, table, apply);
		this.pagination = new PaginationView(model);
		this.scroll = new ScrollView(model, table, this.vscroll, service, apply);

		// TODO: how we can avoid that?
		this.$scope.$watch(this.style.invalidate.bind(this.style));

		model.selectionChanged.watch(e => {
			if (e.hasChanges('entries')) {
				this.onSelectionChanged({
					$event: {
						state: model.selection(),
						changes: e.changes
					}
				});
			}

			if (e.hasChanges('unit') || e.hasChanges('mode')) {
				service.invalidate('selection', e.changes, PipeUnit.column);
			}
		});

		const triggers = model.data().triggers;

		// TODO: think about invalidation queue
		let needInvalidate = true;
		Object.keys(triggers)
			.forEach(name =>
				model[name + 'Changed']
					.watch(e => {
						const changes = Object.keys(e.changes);
						if (e.tag.behavior !== 'core' && triggers[name].find(key => changes.indexOf(key) >= 0)) {
							needInvalidate = false;
							service.invalidate(name, e.changes);
						}
					}));

		if (needInvalidate) {
			service.invalidate('grid');
		}
	}

	onDestroy() {
		this.layout.destroy();
		this.nav.destroy();
		this.selection.destroy();
	}

	templateUrl(key) {
		return `qgrid.${key}.tpl.html`;
	}

	get model() {
		return this.root.model;
	}

	get visibility() {
		return this.model.visibility();
	}

	get rows() {
		return this.model.data().rows;
	}
}

ViewCore.$inject = [
	'$scope',
	'$element',
	'$timeout',
	'$compile',
	'$templateCache',
	'qgrid',
	'vscroll'
];

export default {
	controller: ViewCore,
	controllerAs: '$view',
	templateUrl: 'qgrid.view.tpl.html',
	require: {
		'root': `^^${GRID_NAME}`
	}
}