export class UI {
    constructor(section, err) {
        this.section = section;
        this.errorSection = err;
        this.lastShown = false;
    }
    showTable(data) {
        this.clearError();
        let box = ``;
        data.forEach(record => {
            box += `
                <tr class="odd:bg-gray-50 odd:dark:bg-gray-800 even:bg-gray-100 even:dark:bg-gray-700 border-b dark:border-gray-600">
                    <th scope="row" class="px-6 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                        ${record.id}
                    </th>
                    <td class="px-6 py-3">
                        <div class="cursor-pointer py-1 hover:bg-gray-300 hover:dark:bg-gray-600 duration-200 w-fit px-2 rounded-md" role="customer_name" val="${record.name}" behave="table-click">${record.name}</div>        
                    </td>
                    <td class="px-6 py-3">
                        ${record.amount}
                    </td>
                    <td class="px-6 py-3" >
                        <div class="cursor-pointer py-1 hover:bg-gray-300 hover:dark:bg-gray-600 duration-200 w-fit px-2 rounded-md" role="transaction_date" val="${record.date}" behave="table-click">${record.date}</div>
                    </td>
                </tr>
            `
        });
        $(this.section).html(box);

    }
    showError() {
        let box = `<p class="py-10 text-center text-3xl dark:text-gray-200 text-gray-900 font-medium">Something went wrong</br>Make sure you are connected and try again later</p>`;
        $(this.errorSection).html(box);
    }
    showLoader() {
        let box = `
            <div class="flex-col gap-4 w-full flex items-center justify-center mt-28">
                <div
                    class="w-28 h-28 border-8 text-blue-400 text-4xl animate-spin dark:border-gray-700 border-gray-400 flex items-center justify-center border-t-blue-700 dark:border-t-blue-500 rounded-full">
                </div>
            </div>
        `;
        $(this.errorSection).html(box);
    }
    clearError() {
        $(this.errorSection).html('');
    }
    async showGraph(data) {
        if (data) this.lastShown = data;
        else data = this.lastShown;
        if (!data) return;
        let dark = $('html').hasClass('dark');
        let colors;
        if (dark) {
            Chart.defaults.color = '#ddd';
            Chart.defaults.borderColor = '#aaa3';
            colors = data.dark;
        }
        else {
            Chart.defaults.borderColor = '#4443';
            Chart.defaults.color = '#222';
            colors = data.light;
        }
        $(this.section).html('');
        const can = document.createElement('canvas');
        $(can).attr('width', '100%');
        this.section.append(can);
        try {
            this.clearError();
            new Chart(
                can,
                {
                    type: 'bar',
                    data: {
                        labels: data.labels,
                        datasets: [
                            {
                                label: data.title,
                                data: data.data,
                                backgroundColor: colors
                            }
                        ]
                    }
                }
            );
        }
        catch(e){
            this.showError();
        }
    }
}