import CustomElement from './CustomElement.js';
import { html } from './util.js';

class ModalWindow extends CustomElement {
    /**
     * @returns {void}
     */
    connectedCallback() {
        this.setAttribute('role', 'dialog');
        this.setAttribute('tabindex', '0');
        this.classList.add('overlay');
        requestAnimationFrame(() => this.wrapContent());

        if (this.matchesHash()) {
            this.show();
        }

        addEventListener('hashchange', this.handleHashChange);
        this.addEventListener('focusout', this.handleFocusOut);
        this.addEventListener('keydown', this.handleKeyDown);
        this.addEventListener('click', this.handleClick);
    }

    /**
     * @returns {void}
     */
    wrapContent() {
        if (this.querySelector('.overlay__content')) {
            return;
        }
        this.innerHTML = html`
            <div class="overlay__content">
                <button class="overlay__hide" title="Закрыть"></button>
                ${this.innerHTML}
            </div>
        `;
    }

    /**
     * @returns {boolean}
     */
    matchesHash() {
        return this.getAttribute('id') === location.hash.slice(1);
    }

    /**
     * @override
     */
    async show() {
        await super.show();
        /**
         * @type {HTMLElement | null}
         */
        const focusable = this.querySelector('[autofocus]');
        (focusable ?? this).focus();
    }

    /**
     * @returns {void}
     */
    handleHashChange = () => {
        if (this.matchesHash()) {
            this.show();
        } else {
            this.hide();
        }
    };

    /**
     * @param {KeyboardEvent} event
     * @returns {void}
     */
    handleKeyDown(event) {
        if (event.key === 'Escape') {
            history.pushState(null, '', '#');
            this.handleHashChange();
        }
    }

    /**
     * @param {PointerEvent & { target: HTMLElement }} event
     * @returns {void}
     */
    handleClick(event) {
        if (event.target.closest('.overlay__hide')) {
            history.pushState(null, '', '#');
            this.handleHashChange();
        }
    }

    /**
     * @param {FocusEvent & { relatedTarget: HTMLElement | null }} event
     * @returns {void}
     */
    handleFocusOut(event) {
        if (!this.contains(event.relatedTarget)) {
            this.focus();
        }
    }
}

customElements.define('modal-window', ModalWindow);
export default ModalWindow;
