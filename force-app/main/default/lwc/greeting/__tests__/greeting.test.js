import { createElement } from 'lwc';
import Greeting from 'c/greeting';

describe('c-greeting', () => {
    afterEach(() => {
        // The jsdom instance is shared across test cases in a single file so reset the DOM
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
    });

    it('displays greeting specified by change event target', () => {
        const EXPECTED = 'Test';
        // Create element
        const element = createElement('c-greeting', {
            is: Greeting
        });
        document.body.appendChild(element);

        // Verify default greeting
        let div = element.shadowRoot.querySelector('div');
        expect(div.textContent).not.toBe(`Hello, ${EXPECTED}!`);

        // Trigger new greeting
        const inputEl = element.shadowRoot.querySelector('lightning-input');
        inputEl.value = EXPECTED;
        inputEl.dispatchEvent(new CustomEvent('change'));

        // Return a promise to wait for any asynchronous DOM updates. Jest
        // will automatically wait for the Promise chain to complete before
        // ending the test and fail the test if the promise rejects.

        return Promise.resolve().then(() => {
            // Verify displayed greeting
            expect(div.textContent).toBe(`Hello, ${EXPECTED}!`);
        });
    });
});
