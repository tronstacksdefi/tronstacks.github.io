const waitTron = () => {
	return new Promise((resovle, reject) => {
		let attempt = 0,
			maxAttempt = 100;
		const checkTron = () => {
			if (window.tronWeb) {
				resovle(true);
				return;
			}
			attempt++;
			if (attempt >= maxAttempt) {
				reject(false);
				return;
			}
			setTimeout(checkTron, 100);
		};
		checkTron();
	});
}

const initContract = async() => {
	let tronExist = await waitTron();
	if (!tronExist) {
		swal("Unlock Your TronLink wallet", {
			button: false,
			icon: "warning"
		});
		return null;
	}

	let contract = await window.tronWeb.contract().at(address);
	return contract;
}


var modal = document.getElementById("myModal");

$('#unlock').click(async function () {
	if (window.tronWeb) {
		if (window.tronWeb.defaultAddress.base58) {
			if (window.tronWeb.fullNode.host == node) {
				if (document.getElementById("unlock").innerHTML == "Unlock Wallet") {
					document.getElementById("unlock").innerHTML = "<small>Wallet Statistics</small>";
				} else {
					document.getElementById("address").value = textEllipsis(window.tronWeb.defaultAddress.base58);
					document.getElementById("wallet_add1").value = textEllipsis(window.tronWeb.defaultAddress.base58);
					document.getElementById("unlock").innerHTML = "<small>Wallet Statistics</small>";
					var span = document.getElementsByClassName("close-logout")[0];
					modal.style.display = "block";
					span.onclick = function () {
						modal.style.display = "none";
					}
					window.onclick = function (event) {
						if (event.target == modal) {
							modal.style.display = "none";
						}
					}
				}
			} else {
				document.getElementById("unlock").innerHTML = "Unlock Wallet";
				swal("Please select mainnet", {
					button: false,
					icon: "warning"
				});
			}
		} else {

			//sessionStorage.removeItem('selectedaddress');
			swal("Unlock Your wallet", {
				button: false,
				icon: "warning"
			});
		}
	} else {
		document.getElementById("unlock").innerHTML = "Unlock Wallet";
		//sessionStorage.removeItem('selectedaddress');
		swal("Please install TronLink wallet", {
			button: false,
			icon: "warning"
		});
	}
});

$('#address').click(function () {
	var url = wallet_address_link + window.tronWeb.defaultAddress.base58;
	window.open(url, '_blank');
});

function textEllipsis(str, maxLength, {
	side = "end",
	ellipsis = "..."
} = {}) {
	if (str.length > maxLength) {
		switch (side) {
			case "start":
				return ellipsis + str.slice(-(maxLength - ellipsis.length));
			case "end":
			default:
				return str.slice(0, maxLength - ellipsis.length) + ellipsis;
		}
	}
	return str;
}
initContract().then(async function (a) {
	if (window.tronWeb.fullNode.host != node || window.tronWeb.defaultAddress.base58 == null)
		document.getElementById("unlock").innerHTML = "Unlock Wallet";
	else
		document.getElementById("unlock").innerHTML = "Wallet Statistics";
});

function getFormattedDate(date) {
    let hour = ('0' + date.getUTCHours()).slice(-2);
    let minute = ('0' + date.getUTCMinutes()).slice(-2);
    let seconds = ('0'+date.getUTCSeconds()).slice(-2);
    let day = ('0' + date.getUTCDate()).slice(-2);
    let month = ('0' + (date.getUTCMonth() + 1)).slice(-2);
    let year = date.getUTCFullYear();
    return hour + ':' + minute + ':' + seconds + day + '.' + month + '.' + year
}
 
function getFormattedNumber(num) {
    var num = num + '';
    var value = Number(num);
    var res = num.split('.');
    if (res[0].length <= 2) {
        return value.toFixed(6)
    } else if (res[0].length == 3) {
        return value.toFixed(5)
    } else if (res[0].length == 4) {
        return value.toFixed(4)
    } else if (res[0].length == 5) {
        return value.toFixed(3)
    } else if (res[0].length == 6) {
        return value.toFixed(2)
    } else if (res[0].length == 7) {
        return value.toFixed(1)
    } else if (res[0].length >= 8) {
        return value.toFixed(0)
    }
}

let addr =textEllipsis(window.tronWeb.defaultAddress.base58);
document.getElementById('link-s').value = ('http://techyroots.com/tronstacks/?ref=' + addr);



async function totalcontractdeposit(){
    let contract =  await window.tronWeb.contract().at(address);
    let launch = await contract.totalContractDeposit().call();
    let Withdrawed = tronWeb.toDecimal(launch);
    let userWithdrawn = Withdrawed / 1000000;
    document.getElementById("balance").innerHTML =userWithdrawn;
}
async function getcontractbalance(){
    let contract =  await window.tronWeb.contract().at(address);
    let launch = await contract.getContractBalance().call();
    
    let userWithdrawn = launch / 1000000;
    let user = parseFloat(getFormattedNumber(userWithdrawn))
    document.getElementById("contract_bal").innerHTML = user;
    var contractbonus = 0.01
    document.getElementById("contract_bonus").innerHTML = contractbonus;
}
async function totalplayers(){
    let contract =  await window.tronWeb.contract().at(address);
    let launch = await contract.totalPlayers().call();
    document.getElementById("tot_players").innerHTML = launch;
}
async function PlayerWithdraw(){
	let contract = await window.tronWeb.contract().at(address);
	let res = await contract.totalContractWithdraw().call();
    let userWithdrawn = res / 1000000;
	let userWithdrawnTrx = parseFloat(getFormattedNumber(userWithdrawn));
    document.getElementById("tot_withdraw").innerHTML = userWithdrawnTrx;
}

async function PlayerDeposited(){
	let contract = await window.tronWeb.contract().at(address);
	let playeraddress =textEllipsis(window.tronWeb.defaultAddress.base58);
	let res = await contract.getPlayerTotalDeposits(playeraddress).call();
	let Deposit = tronWeb.toDecimal(res);
	let DepositsFormatted = Deposit / 1000000;
	let DepositsFormatted1 = parseFloat(getFormattedNumber(DepositsFormatted));
	document.getElementById("tot_deposit").innerHTML = DepositsFormatted1;
}

async function maketable()
{
   var table = document.getElementById('ides');

   let contract = await window.tronWeb.contract().at(address);
   let playeraddress = textEllipsis(window.tronWeb.defaultAddress.base58);
   let row = await contract.getPlayerNumberOfDeposits(playeraddress).call();
   for(var i=0;i<row;i++)
   {
     
               var tr = document.createElement('tr');
               let data = await contract.getPlayerDepositInfo(playeraddress,i).call();
               let dailyprofit = await contract.getPlayerPercentRate(playeraddress,i).call();
               let daily = dailyprofit/10;
               let holdbonus = await contract.HOLDBONUS().call();
               let hold = holdbonus/100;
                
           
               var amt = data[0]/1000000;
               if(data[3]==0){
                   var col5 = document.createElement('td');
                   col5.classList.add("text-secondary");
                   col5.classList.add("font-weight-bold");
                   var value ="Silver Stack"
                   col5.textContent= value;
               }
               else if(data[3]==1){
                    var col5 = document.createElement('td');
                    col5.classList.add("text-warning");
                    col5.classList.add("font-weight-bold");
                    col5.textContent= "Gold Stack";
               }
               else if(data[3]==2){
                    var col5 = document.createElement('td');
                    col5.textContent= "Platinum Stack";
                    col5.classList.add("text-primary");
                    col5.classList.add("font-weight-bold");
               }
               else if(data[3]==3){
                    var col5 = document.createElement('td');
                    col5.textContent= "Ruby Stack";
                    col5.classList.add("text-danger");
                    col5.classList.add("font-weight-bold");
               }
               var col1 = document.createElement('td');
               col1.textContent= i;
               var col2 = document.createElement('td');
               col2.textContent= amt + "TRX";
               var col3 = document.createElement('td');
               col3.textContent= hold + "%";
               var col4 = document.createElement('td');
               col4.textContent= daily +"%";
               tr.appendChild(col1);
               tr.appendChild(col2);
               tr.appendChild(col3);
               tr.appendChild(col4);
               tr.appendChild(col5);
               try
               {
                   let data1 = await contract.getPlayerDepositGain(playeraddress,i).call();
                   let value = data1[3]/100;
                   let convert = tronWeb.fromSun(value);
                   let userWithdrawnTrx = parseFloat(getFormattedNumber(convert));
                   var col6 = document.createElement('td');
                   col6.textContent= userWithdrawnTrx +"TRX";
                   var col7 = document.createElement('td');
                   var chkIdInput = document.createElement("input");
                   chkIdInput.setAttribute("type","button");
                   chkIdInput.setAttribute("value","Withdraw Funds");
                   chkIdInput.setAttribute("class","btn btn-primary btn-sm");
                   chkIdInput.setAttribute("onclick","withdraw(this)");
                   col7.appendChild(chkIdInput);
                   tr.appendChild(col6);
                   table.appendChild(tr);
                   tr.appendChild(col7);
                }
               catch(err){
                    var col6 = document.createElement('td');
                    col6.textContent= 0 + "TRX";
                    var col7 = document.createElement('td');
                    col7.textContent= 'Withdraw Complete';
                    col7.classList.add("font-weight-bold");
                    tr.appendChild(col6);
                    tr.appendChild(col7);
                    table.appendChild(tr);
               }
               table.appendChild(tr);
    }
}
async function withdraw(element){
        var noof = element.closest('tr').rowIndex;
        var noofdeposit = noof - 1;
        let contract =  await window.tronWeb.contract().at(address);
        let res = await contract.methods.withdraw(noofdeposit).send();
        let data = res;
        let launch = await window.tronWeb.trx.getTransactionInfo(data);
        console.log(launch.receipt.result);
        if(launch.receipt.result == 'SUCCESS'){
            alert('Successfully Withdrawal');
        }
        else if(launch.receipt.result == 'REVERT'){
            alert('Withdrawal Failed');
        }
}
maketable();

function ref_function(){
    var table = document.getElementById('ides');
    table.innerHTML = '';
    maketable();totalcontractdeposit(); getcontractbalance(); totalplayers(); PlayerWithdraw(); PlayerDeposited(); DepositsCount;
}
async function getprelaunchduration(){
    
    let contract =  await window.tronWeb.contract().at(address);
    let launch = await contract.getPreLaunchDuration().call();
    var d = new Date();
     var x = setInterval(function() {
     var distance = launch--;
     // Time calculations for days, hours, minutes and seconds
     var days = Math.floor(distance / (60 * 60 * 24));
     var hours = Math.floor((distance % (60 * 60 * 24)) / (60 * 60));
     var minutes = Math.floor((distance % (60 * 60)) / ( 60));
     var seconds = Math.floor((distance % (60)));
    document.getElementById("demo2").innerHTML = days + "d" + ":" + hours + "h" + ":" + minutes + "m" + ":" + seconds + "s";
    if (distance < 0) {
              clearInterval(x);
              document.getElementById("demo2").innerHTML = "EXPIRED";
              var fw = document.getElementById("wallet_add1");
                 document.getElementById("wallet_add1").readOnly = false;
               
             }
             else
             {
                  var f = document.getElementById("wallet_add1");
                    f.value = "TT1MVukgCmkAmfXiZ1JC5BD6R3asY8cpJu";
                    document.getElementById("wallet_add1").readOnly = true;
             }
            }, 1000);
            
}
getprelaunchduration();

var slider = document.getElementById("customRange2");
var output = document.getElementById("minValue");
setInterval(function(){var rangeValue = slider.value;
if (rangeValue == 1000) {
        document.getElementById("minValue").innerHTML = "100";
} 
if (rangeValue == 2000) {
            document.getElementById("minValue").innerHTML = "5000";}
if (rangeValue == 3000) {
            document.getElementById("minValue").innerHTML = "20000";}
if (rangeValue == 4000) {
            document.getElementById("minValue").innerHTML = "50000"; } }, 10);
            slider.oninput =  function() {
            output.innerHTML = this.value;
} 

async function deposit(){
    let contract =  await window.tronWeb.contract().at(address);
    let addr = document.getElementById("wallet_add1").value;
    let amount = document.getElementById("amt").value;
    let res = document.getElementById("customRange2").value;
    if(res==1000){
        if(!amount || amount<100)
        {
            alert('Invalid Amount');
        }
        else
        {
            amount = Math.floor(amount * 1000000);
            let silver = 0;
            let instance = await contract.deposit(addr, silver).send({callValue: amount});
        }
    }                
    else if (res == 2000){
        if(!amount || amount<5000)
        {
            alert('Invalid Amount');
        }
        else
        {
            amount = Math.floor(amount * 1000000);
            let silver = 1;
            let instance = await contract.deposit(addr, silver).send({callValue: amount});
        }
    }
    else if (res == 3000)
    {
        if(!amount || amount<20000)
        {
            alert('Invalid Amount');
        }
        else
        {
            amount = Math.floor(amount * 1000000);
            let silver = 2;
            let instance = await contract.deposit(addr, silver).send({callValue: amount});
        }
    }
    else if (res == 4000)
    {
        if(!amount || amount<50000)
        {
            alert('Invalid Amount');
        }
        else
        {
            amount = Math.floor(amount * 1000000);
            let silver = 3;
            let instance = await contract.deposit(addr, silver).send({callValue: amount});
        }
    }
}
