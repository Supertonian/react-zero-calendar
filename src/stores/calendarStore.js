import { makeObservable, observable, action } from "mobx"

class CalendarStore {
    events = [];

    constructor(events) {
        makeObservable(this, {
            events: observable,
            addEvent: action
        })
    }

    addEvent(item) {
        this.events.push(item);
    }
}

export default CalendarStore;