document.addEventListener("DOMContentLoaded", function (e) {
    initializeLogs();
});

function initializeLogs() {
    const logsElementDesktop = document.getElementById(
        "logs-container-desktop"
    );
    const logsElementMobile = document.getElementById("logs-container-mobile");
    logsElementDesktop.innerHTML =
        '<div class="text-start">Não existem registros no momento.</div>';
    logsElementMobile.innerHTML =
        '<div class="text-start">Não existem registros no momento.</div>';
}

async function setLogs(apiKey, token) {
    if (!apiKey || !token) {
        initializeLogs();
        return;
    }

    const logs = await getLogs(apiKey, token);
    if (!logs || logs.length == 0) {
        initializeLogs();
        return;
    }

    const logsDesktopElement = document.getElementById(
        "logs-container-desktop"
    );
    const logsMobileElement = document.getElementById("logs-container-mobile");
    logsDesktopElement.innerHTML = "";
    logsMobileElement.innerHTML = "";
    
    const inicio = document.createElement("div");
    inicio.innerHTML = `<div class="timeline-caption text-inicio">Início</div>`
    logsDesktopElement.appendChild(inicio)
    
    logs.forEach((log) => {
        setDesktopLogElement(log, logsDesktopElement);
        setMobileLogElement(log, logsMobileElement);
    });

    const fim = document.createElement("div");
    fim.innerHTML = `<div class="timeline-caption text-fim">Fim</div>`
    logsDesktopElement.appendChild(fim)
}

function setDesktopLogElement(log, logsDesktopElement) {
    const logElement = document.createElement("div");
    logElement.setAttribute("class", "log-item");
    logElement.innerHTML = `
        <div class="date-container inline">
            <div class="date-text">${formatDate(log.dataEvento)}</div>
            <div>${log.origem}</div>
        </div>
        <div class="circle-status circle-status-${log.situacao} inline">
        </div>
        <div class="info inline">
            <div class="gateway-name ${log.gateway ?? ""}">${
        log.gateway ?? "N / A"
    }</div>
            <div class="message">${log.mensagem}</div>
        </div>
    `;
    logsDesktopElement.appendChild(logElement);
}

function setMobileLogElement(log, logsMobileElement) {
    const logElement = document.createElement("div");
    logElement.setAttribute("class", "log-item");
    logElement.innerHTML = `
            <div class="gateway-name-container">
                <div class="circle-status circle-status-${log.situacao}"></div>
                <div class="gateway-name ${log.gateway ?? ""}">
                    ${log.gateway ?? "N / A"}
                </div>
            </div>
            <div class="message">${log.mensagem}</div>
            <div class="date-text">${formatDate(log.dataEvento)}</div>
            <div class="date-text">${log.origem}</div>
    `;
    logsMobileElement.appendChild(logElement);
}

async function getLogs(apiKey, token) {
    let result = [];
    try {
        const response = await fetch(
            `https://demoapi.flexgateway.com.br/api/Eventos?ChaveApi=${apiKey.toUpperCase()}&Token=${token.toUpperCase()}`,
            {
                method: "GET",
                headers: new Headers({
                    "Content-Type": "application/json; charset=UTF-8",
                    Accept: "application/json, text/javascript, text/plain",
                }),
            }
        );
        result = await response.json();
        result = result.map((item) => ({
            ...item,
            dataEvento: new Date(item.dataEvento),
        }));
    } catch (error) {
        console.log("Problema ao obter logs");
        console.log(error);
    }
    return result;
}

function formatDate(date) {
    const day = date.getDate().toString().padStart(2, "0"),
        month = (date.getMonth() + 1).toString().padStart(2, "0"), //+1 pois no getMonth Janeiro começa com zero.
        year = date.getFullYear(),
        hours = date.getHours().toString().padStart(2, "0"),
        minutes = date.getMinutes().toString().padStart(2, "0"),
        seconds = date.getSeconds().toString().padStart(2, "0");
    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
}
