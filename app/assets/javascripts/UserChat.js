import LazyElement from './LazyElement.js';
import { encode, html } from './util.js';

class UserChat extends LazyElement {
    /**
     * @type {HTMLElement}
     */
    content = null;

    /**
     * @type {HTMLTextAreaElement}
     */
    textbox = null;

    /**
     * @type {User}
     */
    sender = null;

    /**
     * @override
     */
    connectedCallback() {
        super.connectedCallback();

        this.classList.add('chat');
        this.innerHTML = html`
            <span class="chat__placeholder">Загрузка...</span>
        `;
    }

    /**
     * @override
     */
    async intersectedCallback() {
        if (this.content) {
            this.content.scrollTop = this.content.scrollHeight;
            return;
        }
        this.innerHTML = this.render(await this.loadData());
        this.content = this.querySelector('.chat__content');
        this.content.scrollTop = this.content.scrollHeight;
        this.textbox = this.querySelector('.textbox');

        this.addEventListener('input', this.handleInput);
        this.addEventListener('keydown', this.handleKeyDown);
        this.addEventListener('submit', this.handleSubmit);
    }

    /**
     * @typedef {{
     *     id: number;
     *     name: string;
     *     location?: string;
     *     image: string;
     * }} User
     *
     *
     * @typedef {{
     *     userId: number;
     *     content: string;
     * }} Entry
     *
     * @typedef {{
     *     userId: number;
     *     participants: User[];
     *     entries: Entry[];
     * }} Chat
     *
     * @returns {Promise<Chat>}
     */
    async loadData() {
        try {
            const url = this.getAttribute('data-source');
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(response.statusText);
            }
            return response.json();
        } catch (error) {
            alert(error);
        }
    }

    /**
     * @param {Chat} chat
     * @returns {string}
     */
    render(chat) {
        const recipient = chat.participants.find((it) => it.id !== chat.userId);
        this.sender = chat.participants.find((it) => it.id === chat.userId);

        return html`
            <figure class="chat__header">
                <img
                    class="chat__header-image"
                    src="${encode(recipient.image)}"
                    alt=""
                />
                <figcaption class="chat__header-caption">
                    <span>${encode(recipient.name)}</span>
                    <span>${encode(recipient.location)}</span>
                </figcaption>
            </figure>

            <div class="chat__content-scroller">
                <ol class="chat__content">
                    ${chat.entries.map((entry) => {
                        const outgoing = entry.userId === this.sender.id;

                        return this.renderEntry({
                            image: outgoing ? this.sender.image : recipient.image,
                            content: entry.content,
                            modifiers: outgoing ? ['_outgoing'] : [],
                        });
                    })}
                </ol>
            </div>

            <form class="chat__footer">
                <img
                    class="chat__footer-image"
                    src="${encode(this.sender.image)}"
                    alt=""
                />
                <div class="chat__footer-controls">
                    <textarea
                        class="textbox"
                        name="message"
                        placeholder="Сообщение"
                        rows="4"
                        autofocus
                    ></textarea>
                    <button class="button">Отправить</button>
                </div>
            </form>
        `;
    }

    /**
     * @typedef {{
     *     image: string;
     *     content: string;
     *     modifiers?: string[];
     * }} EntryOptions
     *
     * @param {EntryOptions} options
     * @returns {string}
     */
    renderEntry({ image, content, modifiers = [] }) {
        return html`
            <li class="${['chat__entry', ...modifiers]}">
                <img class="chat__entry-image" src="${encode(image)}" alt="" />
                <div class="chat__entry-content">${encode(content)}</div>
            </li>
        `;
    }

    /**
     * @param {EntryOptions} options
     * @returns {void}
     */
    addEntry(options) {
        this.content.insertAdjacentHTML('beforeend', this.renderEntry(options));
        this.content.scrollTop = this.content.scrollHeight;

        const entry = this.content.lastElementChild;
        setTimeout(() => {
            entry.classList.remove('_recent');
        }, 2000);
    }

    /**
     * @returns {void}
     */
    handleInput() {
        const style = getComputedStyle(this.textbox);
        const padding = Number.parseFloat(style.paddingTop) * 2;
        const lineHeight = Number.parseFloat(style.lineHeight);
        const maxLines = 7;

        this.textbox.style.height = null;
        this.textbox.style.height = `${Math.min(
            this.textbox.scrollHeight,
            padding + lineHeight * maxLines,
        )}px`;
    }

    /**
     * @param {KeyboardEvent} event
     * @returns {void}
     */
    handleKeyDown(event) {
        if (event.key === 'Enter' && event.ctrlKey) {
            this.querySelector('form').requestSubmit();
        }
    }

    /**
     * @param {SubmitEvent} event
     * @returns {void}
     */
    handleSubmit(event) {
        event.preventDefault();

        if (!this.textbox.value.trim()) {
            return;
        }
        this.addEntry({
            image: this.sender.image,
            content: this.textbox.value,
            modifiers: ['_outgoing', '_recent'],
        });
        this.textbox.value = '';
        this.textbox.style.height = null;
    }
}

customElements.define('user-chat', UserChat);
export default UserChat;
