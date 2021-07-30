
var web3;
var accounts;
var contract;
var contract_token;
var truffleDevRpc = 'http://127.0.0.1:7545/';
var truffleDevContractAddress = '';


window.App = {
  start: function() {
    contract = web3.eth.contract(Coindb_artifacts.abi)
      .at(truffleDevContractAddress);


      function initialize() {
        setAccount();
        setTokenBalance();
        checkFaucet();
        getTestTokens();
      }

    // Set the initial accounts
    function setAccount() {
      web3.version.getNetwork(function(err, netId) {
        if (!err && netId == networkID) { 
          
          account = web3.eth.accounts[0];
          $("#address").text(account);
          web3.eth.getBalance(account, function(err, res) {
            if(!err) {
              balanceETH = Number(web3.fromWei(res, 'Coindb'));
              $('#balanceCoindb').text(balanceETH + " coindb");
              $('#balanceCoindb').show();
            }
          });
        } 
      });
    }

    function setTokenBalance() {
      contract_token.balanceOf(web3.eth.accounts[0], function(err, result) {
        if(!err) {
          $('#balanceToken').text(web3.fromWei(balanceToken, 'Coindb') + " Tokens");
          if(Number(result) != balanceToken) {
            balanceToken = Number(result);
            $('#balanceToken').text(web3.fromWei(balanceToken, 'Coindb') + " Tokens");
          }
        }
      });
    }

    function checkFaucet() {
      var tokenAmount = 0;
      contract.tokenAmount(function(err, result) {
        if(!err) {
          tokenAmount = result;
          $("#senddb").text("Request " + web3.fromWei(result, 'Coindb') + " Test Tokens");
        }
      });
      contract_token.balanceOf(faucet_address, function(errCall, result) {
        if(!errCall) {
          if(result < tokenAmount) {
            $("#warning").html("Sorry - the faucet is out of tokens! But don't worry, we're on it!")
          } else {
            contract.allowedToWithdraw(web3.eth.accounts[0], function(err, result) {     
            });
          }
        }
      });
    }
  
    function getTestTokens() {
      $("#senddb").attr('diabled', true);
      web3.eth.getTransactionCount(account, function(errNonce, nonce) {
        if(!errNonce) {
          contract_faucet.requestTokens({value: 0, gas: 200000, gasPrice: minGasPrice, from: account, nonce: nonce}, function(errCall, result) {
            if(!errCall) {
              testTokensRequested = true;
              $('#getTokens').hide();
            } else {
              testTokensRequested = true;
              $('#getTokens').hide();
            }
          });
        }
      });
    }

  
  

	$("#network_id").text(networkID);

	if (typeof web3 !== 'undefined') {
		web3Provider = web3.currentProvider;
	}

	web3 = new Web3(web3Provider);

	$.getJSON('json/ERC20Interface.json', function(data) {
		contract_token = web3.eth.contract(data).at(token_address);
	});
	$.getJSON('json/Coindb.json', function(data) {
		contract = web3.eth.contract(data).at(faucet_address);
	});

	
	let tokenButton = document.querySelector('#senddb');
	tokenButton.addEventListener('click', function() {
		getTestTokens();
	});


  window.addEventListener('load', function() {
    let providerURI = truffleDevRpc;
    let web3Provider = new Web3.providers.HttpProvider(providerURI);
    web3 = new Web3(web3Provider);

    App.start();
  }
}):
