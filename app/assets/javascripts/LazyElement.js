import CustomElement from './CustomElement.js';

class LazyElement extends CustomElement {
    static intersectionObserver = new IntersectionObserver(
        this.handleIntersections,
    );

    /**
     * @typedef {IntersectionObserverEntry & {
     *     target: LazyElement;
     * }} Entry
     *
     * @param {Entry[]} entries
     * @returns {void}
     */
    static handleIntersections(entries) {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.intersectedCallback();
            }
        });
    }

    /**
     * @returns {void}
     */
    connectedCallback() {
        /**
         * @type {typeof LazyElement}
         */
        (this.constructor).intersectionObserver.observe(this);
    }

    /**
     * @returns {void}
     */
    intersectedCallback() {
        /**
         * @type {typeof LazyElement}
         */
        (this.constructor).intersectionObserver.unobserve(this);
    }
}

customElements.define('lazy-element', LazyElement);
export default LazyElement;
