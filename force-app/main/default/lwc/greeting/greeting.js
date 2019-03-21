import { LightningElement, track } from 'lwc';
// This is the greeting LWC component
export default class Greeting extends LightningElement {
    @track greeting = 'World';
    changeHandler(event) {
        this.greeting = event.target.value;
    }
}
