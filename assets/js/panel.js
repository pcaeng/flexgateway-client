function goToSecondStepCustomizable() {
    const firstStepElement = document.getElementById("panel-step-2-customizable");
    firstStepElement.hidden = false;

    const secondStepElement = document.getElementById("panel-step-1");
    secondStepElement.hidden = true;

    const lastStepElement = document.getElementById("panel-step-3");
    lastStepElement.hidden = true;
}

function goToSecondStepFull() {
    const firstStepElement = document.getElementById("panel-step-2-full");
    firstStepElement.hidden = false;

    const secondStepElement = document.getElementById("panel-step-1");
    secondStepElement.hidden = true;

    const lastStepElement = document.getElementById("panel-step-3");
    lastStepElement.hidden = true;
}

function goToFirstStep() {
    const firstStepElement = document.getElementById("panel-step-1");
    firstStepElement.hidden = false;

    const secondStepFullElement = document.getElementById("panel-step-2-full");
    secondStepFullElement.hidden = true;

    const secondStepElement = document.getElementById("panel-step-2-customizable");
    secondStepElement.hidden = true;

    const lastStepElement = document.getElementById("panel-step-3");
    lastStepElement.hidden = true;
}

async function checkoutAngGoToLastStep() {
    const resp = await checkout();
    if (!resp.success) {
        alert(`Ocorreu um problema: ${resp.message}`);
        return;
    }

    goToLastStep();
}

function goToLastStep() {
    const lastStepElement = document.getElementById("panel-step-3");
    lastStepElement.hidden = false;

    const firstStepElement = document.getElementById("panel-step-1");
    firstStepElement.hidden = true;

    const secondStepElement = document.getElementById("panel-step-2-customizable");
    secondStepElement.hidden = true;

    const secondStepFullElement = document.getElementById("panel-step-2-full");
    secondStepFullElement.hidden = true;
}

function showSettings() {
    const firstStepElement = document.getElementById("panel-settings");
    firstStepElement.hidden = false;
}

function hideSettings() {
    const firstStepElement = document.getElementById("panel-settings");
    firstStepElement.hidden = true;
}

function showLogs() {
    const firstStepElement = document.getElementById("panel-logs");
    firstStepElement.hidden = false;
    setLogs(getApiKey(), getCurrentToken());
}

function hideLogs() {
    const firstStepElement = document.getElementById("panel-logs");
    firstStepElement.hidden = true;
}

function showCheckout() {
    loadFlexgatewayParams()
    const firstStepElement = document.getElementById("panel-checkout");
    firstStepElement.hidden = false;
}

function hideCheckout() {
    const firstStepElement = document.getElementById("panel-checkout");
    firstStepElement.hidden = true;
}

function openCardOptions() {
    const modal = document.getElementById('panel-credit-cards');
    modal.hidden = false;
}

function hideCardOptions() {
    const modal = document.getElementById('panel-credit-cards');
    modal.hidden = true;
}

function confirmSettings() {
    document.getElementById("order-description").innerHTML =
        document.forms["formSettings"].elements["description"].value;
    document.getElementById("order-amount").innerHTML = parseFloat(
        document.forms["formSettings"].elements["amount"].value.replace(
            ",",
            "."
        )
    )
        .toFixed(2)
        .replace(".", ",");
    hideSettings();
}
