import { LightningElement, wire, track } from 'lwc';
import { registerListener, unregisterAllListeners } from 'c/pubsub';
import findAccounts from '@salesforce/apex/AccountController.findAccounts';
import { CurrentPageReference } from 'lightning/navigation';

export default class MapAccountLocations extends LightningElement {
    searchKey;
    @wire(CurrentPageReference) pageRef;
    @wire(findAccounts, { searchKey: '$searchKey' })
    accounts;
    @track data = [];
    @track Street;
    @track City;
    @track State;
    @track PostalCode;
    @track Country;

    zoomLevel = 5;
    markersTitle = 'Account locations in United States';
    showFooter = true;
    mapMarker = {};
    // Default map marker
    mapMarkers = [
        {
            location: {
                Street: '1600 Pennsylvania Ave NW',
                City: 'Washington',
                State: 'DC',
            },
            title: 'The White House',
            icon: 'standard:account'
        },
    ];    

    connectedCallback() {
        // subscribe to searchKeyChange event
        registerListener('showAccountOnMap', this.handleAccountSelected, this);
    }

    disconnectedCallback() {
        // unsubscribe from searchKeyChange event
        unregisterAllListeners(this);
    }

    handleAccountSelected(data) {
        // eslint-disable-next-line no-console
        console.log('MapAccountLocations.handleAccountSelected before()', data);
        this.data = data.Name;
        this.Street = data.BillingStreet;
        this.City = data.BillingCity;        
        this.State = data.BillingState;
        this.PostalCode = data.BillingPostalCode;
        this.Country = data.BillingCountry;

        this.mapMarkers = [{
                location: {
                    Street: data.BillingStreet,
                    City: data.BillingCity,
                    State: data.BillingState
                },
                title: data.Name,
                icon: 'standard:account'
        }]
        // this.mapMarkers.push(this.mapMarker);

        // eslint-disable-next-line no-console
        console.log('MapAccountLocations.handleAccountSelected mapMarkers', this.mapMarkers);
        // eslint-disable-next-line no-console        
        console.log('MapAccountLocations.handleAccountSelected after()', this.data);
    }
    


}