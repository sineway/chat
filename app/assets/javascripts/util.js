/**
 * @param {TemplateStringsArray} strings
 * @param {...any} values
 * @returns {string}
 */
function html(strings, ...values) {
    return strings.reduce((before, after, index) => {
        const value = values[index - 1];

        if (Array.isArray(value)) {
            return before + value.join(' ') + after;
        }
        return before + value + after;
    });
}

/**
 * @param {string} text
 * @returns {string}
 */
function encode(text) {
    if (text) {
        return text.replace(/[&<>"'`]/g, (char) => `&#${char.charCodeAt(0)};`);
    }
    return '';
}

export { html, encode };
