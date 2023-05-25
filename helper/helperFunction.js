module.exports = function removeEmptyStrings(obj) {
	for (let key in obj) {
		if (typeof obj[key] === "object") {
			removeEmptyStrings(obj[key]); // Рекурсивный вызов для вложенных объектов
		} else if (obj[key] === '') {
			delete obj[key]; // Удаление свойства, если значение равно пустой строке
		}
	}
	return obj;
}
