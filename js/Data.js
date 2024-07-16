import { Fetcher } from "./Fetcher.js";

export class Data {
    constructor() {
        this.check = false;
        this.customers = [];
        this.transactions = [];
        this.curr = [];
    }
    async init() {
        const fetcher = new Fetcher();
        const result = await fetcher.get();
        this.check = result[0];
        if (this.check) {
            this.customers = result[1].customers;
            this.transactions = result[1].transactions;
            this.transactions.forEach(x => x['name'] = this.getCustomerName(x.customer_id));
            this.curr = this.transactions.map(x => x);
        }
    }

    getCustomerName(id) {
        return this.customers.find(x => x.id == id).name;
    }

    filterByKey(key, val, fn = (x, y) => x == y) {
        return this.transactions.filter(T => fn(T[key], val));
    }
    sort(first, second, k = 1) {
        this.curr.sort((x, y) => {
            if (x[first] < y[first]) return -1 * k;
            if (x[first] > y[first]) return 1 * k;
            if (x[second] < y[second]) return -1 * k;
            return 1 * k;
        });
    }



    filterByAmount(x) {
        x = x.trim();
        let k = +x;
        if (x == '' || Number.isNaN(k)) this.curr = this.transactions;
        else this.curr = this.filterByKey('amount', k, (a, b) => Math.abs(a - b) <= 100);
    }
    filterByName(name) {
        this.curr = this.filterByKey('name', name, (s, t) => {
            s = s.toLowerCase();
            t = t.toLowerCase();
            return s.includes(t);
        });
    }
    reset() {
        this.curr = this.transactions.map(x => x);
    }


    sortByName(k = 1) {
        this.sort('name', 'date', k);
    }

    sortByDate(k = 1) {
        this.sort('date', 'name', k);
    }

    sortByAmount(k = 1) {
        this.sort('amount', 'name', k);
    }

    getDataByKey(key, val, label, light, dark) {
        let temp = this.filterByKey(key, val);
        let data = temp.map(T => T.amount);
        let labels = temp.map(T => T[label]);
        let ob = {};
        labels.forEach(x => { ob[x] = 0 });
        for(let i = 0; i < labels.length; i++)
            ob[labels[i]]+=data[i];
        labels=[];
        data=[];
        for (const [key, value] of Object.entries(ob)) {
            labels.push(key);
            data.push(value);
        }
        return { title: val, data, labels, light, dark };
    }
    getDataByDate(val) {
        let darkColors = ["#8FAFDB", "#8FCB92", "#F0C08D", "#C3A4DB", "#DB8F8F"];
        let lightColors = ["#6C8EBF", "#6FAF74", "#E0A96B", "#A48EBF", "#BF6F6F"];
        return this.getDataByKey('date', val, 'name', lightColors, darkColors);
    }
    getDataByName(val) {
        let darkColors = '#8FAFDB';
        let lightColors = '#6C8EBF';
        return this.getDataByKey('name', val, 'date', lightColors, darkColors);
    }
}
