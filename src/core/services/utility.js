import isObject from 'lodash/isObject';
import isFunction from 'lodash/isFunction';
import clone from 'lodash/clone';
import cloneDeep from 'lodash/cloneDeep';
import isUndefined from 'lodash/isUndefined';
import debounce from 'lodash/debounce';
import merge from 'lodash/merge';
import flatten from 'lodash/flatten';
import orderBy from 'lodash/orderBy';

const noop = () => {};
const yes = () => true;
const no = () => false;
const identity = arg => arg;

const toCamelCase = (...names) => {
	const length = names.length;
	if (length > 0) {
		return names[0] +
			names.slice(1)
				.map(name =>
				name[0].toUpperCase() +
				name.substring(1, name.length));
	}

	return '';
};

export {
	isObject,
	isFunction,
	isUndefined,
	clone,
	cloneDeep,
	debounce,
	merge,
	flatten,
	identity,
	yes,
	no,
	toCamelCase,
	noop,
	orderBy
};