import {css} from '../services/dom';
import Sticky from './sticky';
import AppError from 'core/infrastructure/error';

export default class StickyHead extends Sticky {
	/**
	 * @param {Node} table - table node
	 * @param {Node} scrollView - view container which causes scroll
	 * @param {Node} origin - view container which causes scroll
	 * @param {boolean} withClone - defines source for sticky element
	 */
	constructor(table, scrollView, origin, withClone) {
		super(table, scrollView, origin, withClone);
		this.invalidate();
	}

	invalidate(source = 'origin') {
		if (!this.element) {
			return;
		}

		const style = window.getComputedStyle(this.scrollView);
		css(this.element, 'min-width', style.width);
		css(this.element, 'max-width', style.width);

		const tableStyle = window.getComputedStyle(this.table);
		const tableOffset = parseInt(tableStyle.paddingTop || 0, 10);
		const offset = this.origin.offsetHeight;
		super.invalidateHeight();

		css(this.scrollView, 'margin-top', `${offset + tableOffset}px`);
		css(this.element, 'margin-top', `-${offset}px`);
		css(this.table, 'margin-top', `-${offset + tableOffset}px`);

		const stickyTh = this.th(this.element);
		const originTh = this.th(this.origin);
		switch (source) {
			case 'origin': {
				stickyTh.forEach((column, index) => {
					const thStyle = window.getComputedStyle(originTh[index]);
					css(column, 'min-width', thStyle.width);
					css(column, 'max-width', thStyle.width);
					console.log('sticky: ' + thStyle.width);
				});
			}
				break;
			case 'sticky': {
				originTh.forEach((column, index) => {
					const thStyle = window.getComputedStyle(stickyTh[index]);
					css(column, 'min-width', thStyle.width);
					css(column, 'max-width', thStyle.width);
					console.log('sticky: ' + thStyle.width);
				});
				break;
			}
			default:
				throw new AppError('stick.head', `Invalid source ${source}`);
		}

		this.invalidated.emit();
	}

	th(head) {
		return Array.from(head.querySelectorAll('th'));
	}
}