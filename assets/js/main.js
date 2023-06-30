var mgConnector;
var currentToken = null;
document.addEventListener("DOMContentLoaded", function (e) {
    setTimeout(() => {
        mgConnector = new FlexGatewayConnector();
        mgConnector.init(getApiKey()).then(() => {
            initializeFlags();
        });
    }, 2000);
});

function initializeFlags() {
    const cardsConfiguration = mgConnector.config.cardsConfiguration;
    const flagsContainerElem = document.getElementById("flags-container");
    flagsContainerElem.innerHTML = "";
    cardsConfiguration.forEach((cardConfig) => {
        const flagElem = document.createElement("img");
        flagElem.setAttribute("src", cardConfig.image);
        flagElem.setAttribute("class", "flag-icon");
        flagElem.setAttribute("data-brand", cardConfig.brand);
        flagElem.onclick = () => {
            for (let i = 0; i < flagsContainerElem.children.length; i++) {
                flagsContainerElem.children
                    .item(i)
                    .removeAttribute("data-selected");
            }
            flagElem.setAttribute("data-selected", "true");
            const brand = flagElem.getAttribute("data-brand");
            const formCheckoutElements =
                document.forms["formCheckout"].elements;
            formCheckoutElements["cardFlag"].value = brand;
            updateCreditCardMask(brand, document.forms["formCheckout"].elements["cardNumber"].value);
        };
        flagsContainerElem.appendChild(flagElem);
    });
}

async function checkout() {
    showLoading();
    const resp = await tokenizeAndCaptureIfEnabled();
    hideLoading();
    return resp;
}

function showLoading() {
    document.getElementById("backdrop-loading").hidden = false;
}

function hideLoading() {
    document.getElementById("backdrop-loading").hidden = true;
}

async function tokenizeAndCaptureIfEnabled() {
    let result;

    if (!mgConnector) {
        alert("Não foi possível carregar o FlexGatewayConnector");
        return { success: false };
    }
    const checkoutData = getCheckoutDataFromForm();

    console.log("Configurações carregadas");
    const tokenizeResult = await mgConnector.tokenize(
        getTokenizeDataFromCheckoutData(checkoutData)
    );
    result = tokenizeResult;
    if (!tokenizeResult.success) {
        result.message = tokenizeResult.message ?? 'Não foi possível gerar o token de cobrança'
        console.error("Problema tokenização: ");
        console.log(tokenizeResult);
        return result;
    }

    console.log("Tokenizado com sucesso:");
    console.log(tokenizeResult);
    currentToken = tokenizeResult.token;

    if (checkoutData.action === "Capture") {
        const captureResult = await mgConnector.capture(
            getCaptureDataFromCheckoutData(checkoutData, tokenizeResult.token)
        );
        result = captureResult;
        if (!captureResult.success || !captureResult.data?.captureInfo?.captured) {
            result.success = false;
            result.message = captureResult.data?.captureInfo?.message;
            console.error("Problema cobrança: ");
            console.log(captureResult);
            return result;
        }
        console.log("Cobrança realizada com sucess: ");
        console.log(captureResult);
    }

    console.log("Operação realizada com sucesso!");
    setLogs(getApiKey(), tokenizeResult.token);
    return result;
}

function getApiKey() {
    const formSettingsElements = document.forms["formSettings"].elements;
    return formSettingsElements["apiKey"].value;
}

function getCurrentToken() {
    return currentToken;
}

function setCurrentToken(token) {
    currentToken = token;
}

function copyTextToClipboard(idName) {
    var input = document.getElementById(idName);
    input.select()
    input.setSelectionRange(0, 99999);

    navigator.clipboard.writeText(input.value)
}

function selectOptionCartao(formName) {
    const formSettings = document.forms[formName];
    const formCheckout = document.forms["formCheckout"];
	const valueSelect = formSettings.elements["cartaoOptions"].value;
    formCheckout.elements["cardNumber"].value = valueSelect;
    const cardNumberElement = document.getElementsByName("cardNumber").item(0);
    var inputCardNumberMask = IMask(cardNumberElement, {
        mask: "0000 0000 0000 0000 000",
        lazy: true,
    });
    inputCardNumberMask.updateValue(0)
}

function getCheckoutDataFromForm() {
    const formCheckoutElements = document.forms["formCheckout"].elements;
    const formSettingsElements = document.forms["formSettings"].elements;

    return {
        action: formSettingsElements["action"].value,
        creditCard: {
            cardNumber: formCheckoutElements["cardNumber"].value,
            expiryMonth: formCheckoutElements["monthYear"].value.substring(
                0,
                2
            ),
            expiryYear: '20' + formCheckoutElements["monthYear"].value.substring(5, 7),
            cvv: formCheckoutElements["cvv"].value,
            cardFlag: formCheckoutElements["cardFlag"].value,
        },
        customer: {
            holderName: formCheckoutElements["holderName"].value,
            holderDocument: formCheckoutElements["holderDocument"].value,
            code: formSettingsElements["customerCode"].value,
        },
        transaction: {
            amount: formatAmount(formSettingsElements["amount"].value),
            code: formSettingsElements["transactionCode"].value,
        },
    };
}

function getCaptureDataFromCheckoutData(data, token) {
    return {
        transaction: {
            code: data.transaction.code,
            amount: data.transaction.amount,
        },
        customer: {
            name: data.customer.holderName,
            document: data.customer.holderDocument,
            code: data.customer.code ?? data.customer.holderDocument,
        },
        token,
    };
}

function getTokenizeDataFromCheckoutData(data) {
    return {
        cardNumber: data.creditCard.cardNumber,
        expiryMonth: data.creditCard.expiryMonth,
        expiryYear: data.creditCard.expiryYear,
        cardFlag: data.creditCard.cardFlag,
        cvv: data.creditCard.cvv,
        holderName: data.customer.holderName,
        customerName: data.customer.holderName,
        holderDocument: data.customer.holderDocument,
        customerCode: data.customer.code ?? data.customer.holderDocument,
        amount: data.transaction.amount,
        transactionCode: data.transaction.code,
        action: data.action,
    };
}

function formatAmount(value) {
    return parseFloat(value).toFixed(2).replace(/[^\d]/g, "");
}
