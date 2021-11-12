const { inspect } = require('util');
const fs = require('fs');
const { EventEmitter } = require('events');
class Vocation {
    constructor(memberID, dateID) {
        this.memberID = memberID;
        this.dateID = dateID;
    }
    vocationditials() {

        let json1 = fs.readFileSync('members.json');
        let json2 = fs.readFileSync('dates.json');
        let obj1 = JSON.parse(json1);
        let obj2 = JSON.parse(json2);
        console.log(`Member:${inspect(obj1.find(item => item.id === this.memberID))} Date: ${inspect(obj2.find(item => item.id === this.dateID))}`);
        return ` Member: ${inspect(obj1.find(item => item.id === this.memberID))} Date: ${inspect(obj2.find(item => item.id === this.dateID))}`;
    }
}

class Vocations extends EventEmitter {
    constructor() {
        super();
        this.vocations = new Map();
    }
    newvocation(memberID, dateID) {
        if (this.vocations.has(memberID) == false) {
            let json1 = fs.readFileSync('members.json');
            let json2 = fs.readFileSync('dates.json');
            let obj1 = JSON.parse(json1);
            let obj2 = JSON.parse(json2);

            if (obj2.find(item => item.id === dateID) === undefined || obj1.find(item => item.id === memberID) === undefined) {
                console.log("the member or the date does not exits");
                return -1;
            }
            let v = new Vocation(memberID, dateID);
            this.vocations.set(memberID, v);
            console.log("Booked successfully");
            this.emit('NEW_VOCATION', memberID, dateID);
            return 1;
        }
        else {
            console.log("this person Already have a vocations if you want a new vocation please update the Date");
            return 2;

        }

    }
    getallvocations() {
        return this.vocations;
    }
    getnumberOfvocations() {
        return this.vocations.size;
    }
    deletevocation(userid) {
        if (this.vocations.has(userid) == true) {

            this.vocations.delete(userid);
            console.log("Booking canceled");
            this.emit('CANCELING_VOCATION', userid);
            return 1
        }
        else {
            console.log("this person does not have a vocation");
            return -1;
        }
    }
    updatevocation(memberID, dateID) {
        if (this.vocations.has(memberID) == true) {
            this.deletevocation(memberID);
        }
        return this.newvocation(memberID, dateID);
    }
    viewvocation(userid) {
        if (this.vocations.has(userid) == true) {

            return this.vocations.get(userid).vocationditials();
        }
        else {
            console.log("this person does not Exist or have a vocation");
            this.emit('ERRORVIEW_VOCATION', userid);
            return '-1';
        }
    }
    emptyarray() {
        this.vocations.clear();
    }
}

module.exports = () => {
    const vocationss = new Vocations();
    return vocationss;

};