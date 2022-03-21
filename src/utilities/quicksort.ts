export function quickSort(
	array: Array<number>,
	left: number = 0,
	right: number = array.length
) {
	if (left < right) {
		const index = partition(array, left, right);
		quickSort(array, left, index - 1);
		quickSort(array, index, right);
	}

	return array;
}

function partition(array: Array<number>, left: number, right: number) {
	let pivotIndex: number = left;
	let pivotValue: number = array[left];
	for (let i = left + 1; i < right; i++) {
		if (array[i] < pivotValue) {
			pivotIndex++;
			swap(array, i, pivotIndex);
		}
	}
	swap(array, pivotIndex, right);
	return pivotIndex;
}

function swap(array: Array<number>, a: number, b: number) {
	const temp = array[a];
	array[a] = array[b];
	array[b] = temp;
}
