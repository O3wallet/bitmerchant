var transactionsTemplate = null;
var balance;

$(document).ready(function() {



  setupSendForm();
  fillStatusText('status_text', '#status_text');

  fillProgressBar('status_progress', '#progress_bar');

  fillBalance();

  qrCodeAndReceiveAddress();

  // have to only call this once :(
  transactionsTemplate = $('#transactions_template').html();

  fetchReceivedTransactions('newest_received_tx', transactionsTemplate);

  transactionsTable(transactionsTemplate);

  balanceHover();
  pageTitle();

  powerStuff();

});

function powerStuff() {

  $("#power_off").click(function(event) {
    simplePost('power_off', null, false, null, true, false);
    powerToast();
    event.preventDefault();
  });

  $("#restart").click(function(event) {
    simplePost('restart', null, false, null, true, false);
    restartToast();
    event.preventDefault();
  });
}

function powerToast() {
  toastr.success('Bitmerchant is powering off...');

  setTimeout(function() {

    window.close();

  }, 2000);

}

function restartToast() {
  toastr.success('Bitmerchant is restarting...');

  setTimeout(function() {

    window.close();

  }, 3000);

}


function pageTitle() {
  getJson('merchant_info').done(function(result) {
    var mi = JSON.parse(result);
    var merchantName = mi['name'];

    console.log(merchantName);
    if (merchantName != null) {
      $('#page_title').text(merchantName + ' Wallet');
    }

    var currency = mi['native_currency_iso'];
    $('#merchant_currency_iso').text(currency);

  });
}




function qrCodeAndReceiveAddress() {

  getJson('receive_address').done(function(result) {
    var btcText = "bitcoin:" + result;
    $('#qrcode').html('');
    $('#qrcode').qrcode({
      "width": 100,
      "height": 100,
      "color": "#3a3",
      "text": btcText
    });
    $('#receive_address').html(result);

  });
}

function transactionsTable(templateHTML) {

  pageNumbers['#transactions_table'] = 1;
  setupPagedTable('get_transactions', templateHTML, '#transactions', '#transactions_table');

}


function sendStatus() {

  fillSendMoneyStatusText('send_status', '#send_status');
  fillBalance();
  transactionsTable(transactionsTemplate);
}

function setupSendForm() {

  getJson('wallet_is_encrypted').done(function(result) {
    var isEncrypted = (result == 'true');

    if (isEncrypted) {
      $('#sendBtn').attr("data-target", "#sendEncryptedModal");
    } else {
      $('#sendBtn').attr("data-target", "#sendModal");
    }


  });

  $('#sendMoneyEncryptedForm').bootstrapValidator({
      message: 'This value is not valid',
      excluded: [':disabled'],
      submitButtons: 'button[type="submit"]'
    })
    .on('success.form.bv', function(event) {
      event.preventDefault();
      standardFormPost('send_money_encrypted', "#sendMoneyEncryptedForm",
        "#sendEncryptedModal", false, sendStatus, false, true);
    });

  $('#sendMoneyForm').bootstrapValidator({
      message: 'This value is not valid',
      excluded: [':disabled'],
      submitButtons: 'button[type="submit"]'
    })
    .on('success.form.bv', function(event) {
      event.preventDefault();
      standardFormPost('send_money', "#sendMoneyForm",
        "#sendModal", false, sendStatus, false, true);
    });








  getJson('balance').done(function(result) {
    $('.othermain-col').removeClass('hide');
    var fundsNum = result.replace(/[^0-9\.]+/g, "");
    var usersFunds = parseFloat(fundsNum);

    $('[name="funds"]').text(result);
    $('[name="sendAmount"]').attr('placeholder', 'Current funds : ' + result);
    $('[name="sendAmount"]').bind('keyup', function(f) {
      var sendAmount = parseFloat($(this).val());

      var fundsLeft = usersFunds - sendAmount;
      if (!isNaN(fundsLeft)) {

        $('[name="fundsLeft"]').text('$' + fundsLeft);

        if (fundsLeft < 0) {

          $('[name="placeSendBtn"]').prop('disabled', true);
          $('[name="fundsLeft"]').addClass("text-danger");
          $('[name="fundsLeft"]').removeClass("text-success");

        } else {
          $('[name="placeSendBtn"]').prop('disabled', false);
          $('[name="fundsLeft"]').addClass("text-success");
          $('[name="fundsLeft"]').removeClass("text-danger");
        }
      }

    });
  });

  // $("#placeSendBtn").click(function(event) {
  //     standardFormPost('user_send', '#sendForm', '#sendModal', true);
  //     event.preventDefault();
  // });


}

function fetchReceivedTransactions(url, templateHTML) {
  var url = sparkService + url // the script where you handle the form input.
  var lastReceivedHash = getCookie("newestReceivedTransaction");
  var intervalID = setInterval(function() {
    $.ajax({
      type: "GET",
      url: url,
      xhrFields: {
        withCredentials: true
      },
      // data: seriesData, 
      success: function(data, status, xhr) {

        xhr.getResponseHeader('Set-Cookie');
        var tx = JSON.parse(data);

        var nextReceivedHash = tx['hash'];
        var amount = tx['amount'];

        // console.log(tx);
        // console.log('next: ' + nextReceivedHash);
        // console.log('last: ' + lastReceivedHash);

        if (nextReceivedHash != lastReceivedHash) {
          if (nextReceivedHash != 'none yet' && amount[0] != '-') {
            var message = 'You were sent ' + amount;
            toastr.success(message);
          }





          qrCodeAndReceiveAddress();
          fillBalance();


          transactionsTable(templateHTML);

          // Now set the vars to be the same
          // lastReceivedHash = nextReceivedHash;
          lastReceivedHash = getCookie("newestReceivedTransaction");
        }

      },
      error: function(request, status, error) {

        // toastr.error(request.responseText);
        clearInterval(intervalID);
      }
    });

    // console.log(getCookies());
  }, 60000); // 1000 milliseconds = 1 second.
}


function fillBalance() {
  getJson('balance').done(function(result) {
    // convert to mBTC
    var btc = parseFloat(result);
    var mBTC = btc * 1000;
    $('.balance').text(formatMoney(mBTC));
    $('.balance-btc').text(btc);
    $('[name="funds"]').text(btc);
    $('[name="sendAmount"]').attr('placeholder', 'Current funds : ' + btc);
    console.log(mBTC);
    balance = mBTC;
  });

  getJson('native_balance').done(function(result) {
    $('#converted_balance').text(result);
  });

}

function balanceHover() {
  $('.balance-cur').hover(function() {
    $('.balance').text(balance);
  }, function() {
    $('.balance').text(formatMoney(balance));
  });
}
