import Table from './table';
import angular from 'angular'; //necessary to test CellDom model property

const myWindow = window.open("", "MsgWindow", "width=100,height=50");
function htmlToElement(html) {
	const template = myWindow.document.createElement('template');
	template.innerHTML = html;
	return template.content.firstChild;
}

describe('Table', () => {
	const table = '<table tabindex=\"0\"><thead><tr><th><label aria-label=\"Last Name\">' +
		'Last Name</label></div></th><th><label aria-label=\"First Name\">First Name</label></div></th></tr></thead><tbody><tr>' +
		'<td class=\"q-grid-rowIndicator q-grid-row-indicator\">Laserna</td><td class=\"q-grid-rowIndicator q-grid-row-indicator\">' +
		'Lue</td></tr><tr><td class=\"q-grid-rowIndicator q-grid-row-indicator\">Grebel</td><td class=\"q-grid-rowIndicator q-grid-row-indicator\">' +
		'Jasper</td></tr><tr><td class=\"q-grid-rowIndicator q-grid-row-indicator\">Beichner</td>' +
		'<td class=\"q-grid-rowIndicator q-grid-row-indicator\">Kandra</td></tr><tr><td class=\"q-grid-rowIndicator q-grid-row-indicator\">' +
		'Schmith</td><td class=\"q-grid-rowIndicator q-grid-row-indicator\">Jeff</td></tr></tbody></table>';
	const body = '<tbody><tr><td class=\"q-grid-rowIndicator q-grid-row-indicator\">Laserna</td>' +
		'<td class=\"q-grid-rowIndicator q-grid-row-indicator\">Lue</td></tr><tr><td class=\"q-grid-rowIndicator q-grid-row-indicator\">' +
		'Grebel</td><td class=\"q-grid-rowIndicator q-grid-row-indicator\">Jasper</td></tr><tr>' +
		'<td class=\"q-grid-rowIndicator q-grid-row-indicator\">Beichner</td><td class=\"q-grid-rowIndicator q-grid-row-indicator\">' +
		'Kandra</td></tr><tr><td class=\"q-grid-rowIndicator q-grid-row-indicator\">Schmith</td>' +
		'<td class=\"q-grid-rowIndicator q-grid-row-indicator\">Jeff</td></tr></tbody>';
	const head = '<thead><tr><th><label aria-label=\"Last Name\">Last Name</label></div></th><th><label aria-label=\"First Name\">' +
		'First Name</label></div></th></tr></thead>';

	const markup = {
		table: htmlToElement(table),
		body: htmlToElement(body),
		head: htmlToElement(head)
	};

	const markupEmpty = {};
	const tableArr = [new Table(markup), new Table(markupEmpty)];
	const tableProps = ['body', 'head', 'foot'];

	describe('table should have properties and they should be objects', () => {
		describe('markup', () => {
			for (let table of tableArr) {
				tableProps.forEach((prop) => {
					expect(table).to.have.property(prop);
					expect(table[prop]).to.be.an.instanceOf(Object)
				});
			}
		});
	});
	describe('empty markup call to properties check', () => {
		const table = tableArr[1];
		it('column', () => {
			const column = table.body.column();
			const cells = column.cells();
			expect(column).to.be.an.instanceOf(Object).and.to.have.property('cells');
			expect(cells).to.an.instanceOf(Array).with.lengthOf(0);
		});
		it('row', () => {
			const row = table.body.row();
			const cells = row.cells();
			expect(row).to.be.an.instanceOf(Object).and.to.have.property('cells');
			expect(cells).to.be.an.instanceOf(Array).with.lengthOf(0);
		});
		it('cell', () => {
			tableProps.forEach((prop) => {
				expect(table[prop].cell(0, 0)).to.be.null;
			});
		});
	});
	describe('normal markup call to properties check', () => {
		const table = tableArr[0];
		it('column', () => {
			const body = table.body;
			const column = body.column(0);
			const cells = column.cells();
			expect(column).to.be.an.instanceOf(Object).and.to.have.property('cells');
			expect(cells).to.be.an.instanceOf(Array).with.lengthOf(4);
		});
		it('row', () => {
			const row = table.body.row(0);
			const cells = row.cells();
			expect(row).to.be.an.instanceOf(Object).and.to.have.property('cells');
			expect(cells).to.be.an.instanceOf(Array).with.lengthOf(2);
		});
		it('cell', () => {
			tableProps.forEach((prop) => {
				const cell = table[prop].cell(0, 0);
				prop==='foot' ?
					expect(cell).to.be.null :
					expect(cell).to.be.an.instanceOf(Object).and.to.have.property('model');
			});
		});
	});
});