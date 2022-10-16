document.getElementById("addressSubmit").addEventListener("click", function(event) {
    event.preventDefault();
    
    let value = document.getElementById("addressInput").value;
    if (value === "")
      return;
    
    let url = "https://api.etherscan.io/api?module=account&action=balance&address=" + value + "&tag=latest&apikey=4SW85K7TP17XHTR8M2HWE6P9846H7JFIIQ"
    fetch(url)
      .then(function(response) {
        return response.json();
      }).then(function(json) {
          let data = json.result;
          let length = data.length;
                
          if (data.length > 18){
            data = data.substring(0,length-18) + "." + data.substring(length-18,length-14);
          }
          else{
            data = "0." + data.padStart(18, '0').substring(0,4);
          }
          
          let result = "Balance: " + data;
          document.getElementById("balance-text").innerHTML = result;
      });
      
    url = "https://api.etherscan.io/api?module=account&action=getminedblocks&address=" + value +"&blocktype=blocks&page=1&offset=10&apikey=4SW85K7TP17XHTR8M2HWE6P9846H7JFIIQ"
    fetch(url)
      .then(function(response) {
        return response.json();
      }).then(function(json) {
          let data = json.result.length.toString();
          let result = "Blocks Mined: " + data;
          document.getElementById("blocks-mined-text").innerHTML = result;
      });
      
    url = "https://api.etherscan.io/api?module=account&action=txlist&address=" + value + "&startblock=0&endblock=99999999&page=1&offset=20&sort=desc&apikey=4SW85K7TP17XHTR8M2HWE6P9846H7JFIIQ"
    fetch(url)
      .then(function(response) {
        return response.json();
      }).then(function(json) {
          let result = json.result;
          let html_text = "";
          if(result.length === 0){
            html_text += "<h4>No transactions made.</h4>"
          }
          else{
            for(let i = 0; i < result.length; i++){
              let c = "";
              if(result[i].from == value){
                c = "loss";
              }
              else if(result[i].to == value){
                c = "gain";
              }
              html_text += "<div class='transaction-container " + c + "'>";
              html_text += "<h4>Time: " + moment(result[i].timeStamp*1000).format('MM/DD/YYYY h:mm a') +"</h4>";
              let amount = result[i].value;
              let length = amount.length;
              if (amount.length > 18){
                amount = amount.substring(0,length-18) + "." + amount.substring(length-18,length-14);
              }
              else{
                amount = "0." + amount.padStart(18, '0').substring(0,4);
              }
              html_text += "<h4 class=" + c + ">Amount: " + amount +"</h4>";
              if(c === "loss"){
                html_text += "<h4>To: " + result[i].to +"</h4>";
              }
              else if(c == "gain"){
                html_text += "<h4>From: " + result[i].from +"</h4>";
              }
              html_text += "</div>"
            }
          }
          document.getElementById("transaction-text").innerHTML = "Recent Transactions"
          document.getElementById("transaction-history-container").innerHTML = html_text;
      });
});

function updateEtherStatus(){
    let url = "https://api.etherscan.io/api?module=stats&action=ethprice&apikey=4SW85K7TP17XHTR8M2HWE6P9846H7JFIIQ"
    fetch(url)
      .then(function(response) {
        return response.json();
      }).then(function(json) {
          let result = "Ethereum Price: $";
          result += json.result.ethusd;
          document.getElementById("price-text").innerHTML = result;
      });
    
    url = "https://api.etherscan.io/api?module=stats&action=ethsupply&apikey=4SW85K7TP17XHTR8M2HWE6P9846H7JFIIQ"
    fetch(url)
      .then(function(response) {
        return response.json();
      }).then(function(json) {
          let data = json.result;
          let length = data.length;
          
          if (data.length > 18){
            data = data.substring(0,length-18) + "." + data.substring(length-18,length-14);
          }
          else{
            data = "0." + data.padStart(18, '0').substring(0,4);
          }
          
          let result = "Ethereum Supply: " + data;
          document.getElementById("supply-text").innerHTML = result;
      });
    
    url = "https://api.etherscan.io/api?module=stats&action=nodecount&apikey=4SW85K7TP17XHTR8M2HWE6P9846H7JFIIQ"
    fetch(url)
      .then(function(response) {
        return response.json();
      }).then(function(json) {
          let result = "Number of Nodes: ";
          result += json.result.TotalNodeCount;
          document.getElementById("node-count-text").innerHTML = result;
      });
}

updateEtherStatus();
setInterval(updateEtherStatus, 5000);
