import { LightningElement, track, wire} from 'lwc';
import getAccountList from '@salesforce/apex/AccountController.getAccountList';
import findAccounts from '@salesforce/apex/AccountController.findAccounts';
import { CurrentPageReference} from 'lightning/navigation'
import { fireEvent } from 'c/pubsub';

/** The delay used when debouncing event handlers before invoking Apex. */
const DELAY = 300;

// TODO: Create one more drop down to show in the drop down menu
const actions = [
    { label: 'Show details', name: 'show_details' },
    { label: 'Delete', name: 'delete' }
];

// TODO: Create a new column in the data table.
const columns = [
    { label: 'Name', fieldName: 'Name', type: 'text', sortable: true},
    { label: 'Website', fieldName: 'Website', type: 'url' },
    { label: 'Phone', fieldName: 'Phone', type: 'phone' },
    {
        type: 'action',
        typeAttributes: { rowActions: actions },
    }
];

export default class AccountList extends LightningElement {
    @track searchKey = '';
    @track data = [];
    @track record = {};
    @track error;    
    @wire(getAccountList) accounts;
    @track columns = columns;
    @track tableLoadingState = true;    
    @wire(findAccounts, { searchKey: '$searchKey' })
    accounts;

    @wire(CurrentPageReference) pageRef;
    
    handleLoad() {
        getAccountList()
            .then( result => {
                this.data = result;
                // eslint-disable-next-line no-console
                console.log(this.data);
                // eslint-disable-next-line no-console
                console.log(JSON.stringify(this.data, null, '\t'));
            })
            .catch( error => {
                this.error = error;
            })
    }

    handleRowAction(event) {
        const actionName = event.detail.action.name;
        const row = event.detail.row;
        switch (actionName) {
            case 'delete':
                this.deleteRow(row);
                break;
            case 'show_details':
                this.showRowDetails(row);
                break;
            default:
        }
    }
    
    deleteRow(row) {
        const { id } = row;
        const index = this.findRowIndexById(id);
        if (index !== -1) {
            // eslint-disable-next-line no-alert
            alert('Delete this record ?');            
            this.data = this.data
                .slice(0, index)
                .concat(this.data.slice(index + 1));
        }
    }

    findRowIndexById(id) {
        let ret = -1;
        this.data.some((row, index) => {
            if (row.id === id) {
                ret = index;
                return true;
            }
            return false;
        });
        return ret;
    }
    
    showRowDetails(row) {
        // eslint-disable-next-line no-alert
        // eslint-disable-next-line no-console
        console.log('Showing record details.');
        this.record = row;
    }
    
    selectedAccount(event) {
        // eslint-disable-next-line no-console

        const selectedRows = event.detail.selectedRows;
        for (let i = 0; i < selectedRows.length; i++){
            // eslint-disable-next-line no-console
            console.log('AccountList.selectedAccount', selectedRows[i]);
            fireEvent(this.pageRef, 'showAccountOnMap', selectedRows[i]);            
        }


    }

    handleKeyChange(event) {
        // Debouncing this method: Do not update the reactive property as long as this function is
        // being called within a delay of DELAY. This is to avoid a very large number of Apex method calls.
        window.clearTimeout(this.delayTimeout);
        const searchKey = event.target.value;
        // eslint-disable-next-line @lwc/lwc/no-async-operation
        this.delayTimeout = setTimeout( () => {
            this.searchKey = searchKey;
        }, DELAY );

    }    

    handleSelect(event) {
        // 1. Prevent default behavior of anchor tag click which is to navigate to the href url
        event.preventDefault();
        // 2. Create a custom event that bubbles. Read about event best practices at 
        // http://developer.salesforce.com/docs/component-library/documentation/lwc/lwc.events_best_practices
        const selectEvent = new CustomEvent('accountselect', {
            detail: {accountId: event.currentTarget.dataset.accountId}
        });
        // 3. Fire the custom event
        this.dispatchEvent(selectEvent);
    }
}