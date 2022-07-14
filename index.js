var dateTimeHolder = document.getElementById('dateTime');
var balanceHolder = document.getElementById('balance');
var amountHolder = document.getElementById('amount');
var storeButton = document.getElementById('store');
var transactionListContainer = document.getElementById('transactions');
var transactionRowTemplate = document.querySelector('.transactions-row-template');
var toastTemplate = document.querySelector('.toast-template')
var toastContainer = document.getElementById('toast-container');

var transactions = getTransaction();
insertTransactionRow(5000, new Date());
insertTransactionRow(-2000, new Date());

transactions.forEach(function(transaction, index){
    insertTransactionRow(transaction.amount, new Date(transaction.date), index);
    console.log("test");
});


storeButton.addEventListener('click', function addAmount(){
    showToast("mentve");



    if(isTransactionValid(dateTimeHolder, amountHolder)){
        var intValue = parseInt(amountHolder.value);
        var date = new Date(dateTimeHolder.value);
        saveTransaction(amount, date);
        insertTransactionRow(intValue, date, transactions.length - 1);
    }
});

function showToast(message){
    var toast = toastTemplate.cloneNode(true);
    toast.textContent(message);
    toast.classList.add('show');
    toastContainer.appendChild(toast);
    setTimeout(function(){
        toast.remove();
    }, 3000);
}



function getTransaction(){
    var transactionsString = localStorage.getItem("transactions");
    return transactionsString ? JSON.parse(transactionsString) : [];
}

function saveTransaction(amount, date){
    transactions.push({
        "amount" : amount,
        "date" : date
    });
    //A tömböt Stringé alakítjuk
    var transactionString = JSON.stringify(transactions);
    //Elmentjük    
    localStorage.setItem("transactions", transactionString);
}


function insertTransactionRow(amount, date, index){
    var listItem = transactionRowTemplate.cloneNode(true);
    listItem.querySelector('.transactions-id').textContent = index;
    listItem.querySelector('.transactions-date').textContent = date.toDateString();
    listItem.querySelector('.transactions-amount').textContent = amount + " Ft";
    var deleteButton = listItem.querySelector('.delete-transaction');
    deleteButton.setAttribute('data-id', index);
    deleteButton.addEventListener('click', deleteTransactionRow);
    transactionListContainer.appendChild(listItem);
    amountHolder.value = '';
    dateTimeHolder.value = '';
    balanceHolder.textContent = calculateBalance();
}

function deleteTransactionRow(event){
    var id = event.target.getAttribute('data-id');
    transactions.splice(id, 1);
    var row = event.target.parentNode.parentNode;
    row.parentNode.removeChild(row);
    balanceHolder.textContent = calculateBalance();
}


function isTransactionValid(dateTimeHolder, amountHolder){
    var dateTimeValid = validateDate(dateTimeHolder);
    var amountValidbool = amountValid(amountHolder);
    return dateTimeValid && amountValidbool;
}

function validateDate(dateTimeHolder){
    var dateTimeValid = true;
    var date = new Date(dateTimeHolder.value);
    if(date.toString() === "Invalid Date"){
        dateTimeValid = false;
        dateTimeHolder.classList.add('invalid');
    }else{
        dateTimeHolder.classList.remove('invalid');
    }
    return dateTimeValid;
}

function amountValid (amountHolder){
    let valid = true;
    let num = parseInt(amountHolder);
    if(num === 'NaN'){
        let valid = false;
    }
    return valid;
}

function calculateBalance(){
    var balance = 0;
    for(var i = 0; i < transactions.length; i++){
        balance += transactions[i].amount;
    }
    return balance + " Ft";
}
