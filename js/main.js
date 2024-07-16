import { Data } from "./Data.js";
import { UI } from "./ui.js";

const myData = new Data();
const tableDisplayer = new UI(document.getElementById('main-table'), document.getElementById('main-error'));
const graphDisplayer = new UI(document.getElementById('graph'), document.getElementById('graph-error'));

$('#toggle-dark').click(function () {
    $('html').toggleClass('dark');
    graphDisplayer.showGraph();
});

$('html').click(function (e) {
    $('#sortby-menu').fadeOut(200);
});

$('#sortby-btn').click(function (e) {
    e.stopPropagation();
    $('#sortby-menu').fadeToggle(200);
});

async function init() {
    await myData.init();
    if (myData.check) tableDisplayer.showTable(myData.curr);
    else tableDisplayer.showError();
    afterDisplay();
}
await init();

$('#nameSearch').on('input', function () {
    let s = $(this).val();
    $('#amountSearch').val('');
    if (myData.check) {
        myData.filterByName(s);
        tableDisplayer.showTable(myData.curr);
        afterDisplay();
    }
});



$('#amountSearch').on('input', function () {
    let x = $(this).val();
    $('#nameSearch').val('');
    if (myData.check) {
        myData.filterByAmount(x);
        tableDisplayer.showTable(myData.curr);
        afterDisplay();
    }
});

function clearInputs() {
    $('#nameSearch').val('');
    $('#amountSearch').val('');
}

$('#reset-btn').click(function () {
    clearInputs();
    if (myData.check) {
        myData.reset();
        tableDisplayer.showTable(myData.curr);
        afterDisplay();
    }
});

$('[role="sortBy"]').click(function () {
    if (myData.check) {
        let key = $(this).attr('key');
        if (key == 'Name') myData.sortByName();
        else {
            let order = $(this).attr('order');
            order = +order;
            if (key == 'Amount') myData.sortByAmount(order);
            else myData.sortByDate(order);
        }
        tableDisplayer.showTable(myData.curr);
        afterDisplay();
    }
});

function afterDisplay() {
    $('[role="transaction_date"]').click(function () {
        let s = $(this).attr('val');
        let data = myData.getDataByDate(s);
        graphDisplayer.showGraph(data);
    });
    $('[role="customer_name"]').click(function () {
        let s = $(this).attr('val');
        let data = myData.getDataByName(s);
        graphDisplayer.showGraph(data);
    });
    $(`[behave="table-click"]`).click(function (e) { 
        $('html,body').animate({ scrollTop: $('#graph').offset().top }, 1000);
    });
}