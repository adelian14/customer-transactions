export class Fetcher {
    constructor() {
        this.url = 'https://adelian14.github.io/host_api/data.json';
    }
    async get() {
        try {
            const response = await fetch(this.url);
            if (response.status == 200) {
                const data = await response.json();
                return [true, data];
            }
            else {
                const data = await response.json();
                console.log(response.statusText);
                return [false, data];
            }
        }
        catch (error) {
            console.log(error);
            return [false, error];
        }
    }
}