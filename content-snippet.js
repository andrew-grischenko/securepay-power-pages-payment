<script language="JavaScript">
  var mySecurePayUI = new window.securePayUI.init({
      containerId: 'securepay-ui-container',
      scriptId: 'securepay-ui-js',
      clientId: "{{ settings["SecurePay/ClientID"] }}",
      merchantCode: "{{ settings["SecurePay/MerchantCode"] }}",
      card: { // card specific config and callbacks
        allowedCardTypes: ['visa', 'mastercard'],
        showCardIcons: false, 
        onTokeniseSuccess: async function(tokenisedCard) {
          console.log("Tokenised: "+JSON.stringify(tokenisedCard))
          const url = "{{ settings["SecurePay/FlowURL"] }}";

          const payload = {
            eventData: JSON.stringify({
              amount: (document.getElementById("amount").value)*100,
              token: tokenisedCard.token
            })
          };
          var result;

          await shell
            .ajaxSafePost({
              type: "POST",
              contentType: "application/json",
              url: url,
              data: JSON.stringify(payload),
              processData: false,
              global: false,
            })
            .done(function (response) {
              console.log("Received response: "+response);
              result = JSON.parse(response);

              if (result.status == "paid") {
                resultMessage('Your payment has been successfull processed!');
              } else {
                resultMessage(`Transaction failed: ${result.error_message} (code: ${result.error_code})`);
              }
            })
            .fail(function (error) {
              console.error(error);
              resultMessage(`Could not process SecurePay payment...<br><br>${error}`);
            });

          return result.status;
        },
        style: {
          backgroundColor: 'rgba(135, 207, 250, 0.1)',
          label: {
            font: {
                family: 'Arial, Helvetica, sans-serif',
                size: '1.1rem',
                color: 'darkblue'
            }
          },
          input: {
           font: {
               family: 'Arial, Helvetica, sans-serif',
               size: '1.1rem',
               color: 'darkblue'
           }
         }  
        },
  
      },
      onLoadComplete: function() {
          // the SecurePay UI Component has successfully loaded and is ready to be interacted with
          console.log("card is ready to use");
          console.log(JSON.stringify(mySecurePayUI));
      }
    });

    function resultMessage(message) {
      const container = document.querySelector("#result-message");
      container.innerHTML = message;
    }
</script>