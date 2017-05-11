import * as columnService from '@grid/core/column/column.service';

export default class Data {
	constructor(model, pin) {
		this.model = model;
		this.pin = pin;
	}

	columns() {
		const columns = this.model.view().columns;
		return columnService
			.lineView(columns)
			.map(v => v.model)
			.filter(c => c.pin === this.pin);
	}

	columnMap() {
		return columnService.map(this.columns());
	}

	rows() {
		return this.model.view().rows;
	}
}