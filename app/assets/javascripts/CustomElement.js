class CustomElement extends HTMLElement {
    /**
     * @returns {Promise<void>}
     */
    async show() {
        this.removeAttribute('hidden');
        await this.animationFinished();
    }

    /**
     * @returns {Promise<void>}
     */
    async hide() {
        if (this.isHidden()) {
            return;
        }
        this.setAttribute('hidden', '');
        await this.animationFinished();
        this.setAttribute('hidden', 'hidden');
    }

    /**
     * @returns {boolean}
     */
    isHidden() {
        return !this.getClientRects().length;
    }

    /**
     * @returns {Promise<void>}
     */
    async animationFinished() {
        try {
            await Promise.all(
                this.getAnimations?.().map((it) => it.finished) ?? [],
            );
        } catch {
            // AbortError
        }
    }
}

customElements.define('custom-element', CustomElement);
export default CustomElement;
