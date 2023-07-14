function loadFlexgatewayParams() {
	const formCheckout = document.forms["formSettingsFull"];
	const apiKey = formCheckout.elements["apiKey"].value;
	const additionalInfo = JSON.stringify({
	  amount: parseFloat(
		formCheckout.elements["amount"].value?.replace(",", ".") || ""
	  ),
	  description: formCheckout.elements["description"].value,
	  transactionCode: formCheckout.elements["transactionCode"].value,
	  customerCode: formCheckout.elements["customerCode"].value,
	  action: formCheckout.elements["action"].value,
	});
  
	const pcaMgElement = document.getElementById("pca-flexgateway-app");
	pcaMgElement.setAttribute("data-api-key", apiKey);
	pcaMgElement.setAttribute("data-additional-info", additionalInfo);
	pcaMgElement.setAttribute("data-onsuccess", "flexgatewaySuccess");
	pcaMgElement.setAttribute("data-onerror", "flexgatewayError");
  }
  
  function flexgatewaySuccess(data) {
	console.log("SUCESSO!");
	console.log(data);
	setCurrentToken(data.creditCardToken);
  }
  
  function flexgatewayError(data) {
	console.log("ERRO!");
	console.log(data);
  }