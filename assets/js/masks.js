document.addEventListener("DOMContentLoaded", function (e) {
    setCardNumberMask();
    setCvvMask();
    setMonthYearMask();
    setCpfMask();
    setTimeout(() => {
        setEventsCardNumber();
    }, 5000);
});

const cardNumberElement = document.getElementsByName("cardNumber").item(0);
var inputCardNumberMask = IMask(cardNumberElement, {
    mask: "0000 0000 0000 0000 000",
    lazy: true,
});

function setCardNumberMask(mask, textLength) {
    function hasMatchPattern(textLength, patternLength) {
        return textLength === patternLength;
    }
    function getZeros(qtyOfZeros) {
        const zeros = [];
        for (i = 0; i < qtyOfZeros; i++) {
            zeros.push("0");
        }
        return zeros.join("");
    }

    if (!mask) {
        return;
    }

    let maskPattern = "";
    mask.forEach((pattern) => {
        const patternLength = pattern.reduce(
            (prev, current) => prev + current,
            0
        );
        if (hasMatchPattern(textLength, patternLength)) {
            maskPattern = (pattern.map((p) => getZeros(p))?.join(' ')?.trim()) || '';
            while (maskPattern.replace(/\D/g, '').length < 24) {
                maskPattern = maskPattern + '0';
            }
        }
    });

    if (maskPattern) {
        inputCardNumberMask.updateOptions({
            mask: maskPattern,
            lazy: true
        })
    }
}

function setCvvMask() {
    const cvvElement = document.getElementsByName("cvv").item(0);
    IMask(cvvElement, {
        mask: "00000",
        lazy: true,
    });
}

function setMonthYearMask() {
    const monthYearElement = document.getElementsByName("monthYear").item(0);
    IMask(monthYearElement, {
        mask: "00 / 00",
        lazy: true,
    });
}

function setCpfMask() {
    const holderDocumentElement = document
        .getElementsByName("holderDocument")
        .item(0);
    IMask(holderDocumentElement, {
        mask: "000.000.000-00",
        lazy: true,
    });
}

function setEventsCardNumber() {
    const cardNumberElement = document.getElementsByName("cardNumber").item(0);
    cardNumberElement.onkeyup = (e) => {
        const inputValue = e.target.value;
        const flag = getFlagByCreditCardNumber(inputValue);
        setInputFlagValue(flag);
        updateCreditCardMask(flag, inputValue);
    };
}

function getFlagByCreditCardNumber(cardNumber) {
    const creditCardOnlyNumbers = cardNumber.replace(/[\D]/g, "");
    const matches = [];

    const creditCardFlags = mgConnector.config.cardsConfiguration.map(
        (item) => ({
            brand: item.brand,
            name: item.name,
            regex: new RegExp(item.numberFormat),
            image: item.image,
            mask: item.cardNumberMask,
        })
    );

    for (const flag of creditCardFlags) {
        if (flag.regex.test(creditCardOnlyNumbers)) {
            matches.push(flag.brand);
        }
    }

    if (matches.length !== 1) {
        return "";
    }
    return matches[0];
}

function setInputFlagValue(flag) {
    const cardFlagElement = document.getElementsByName("cardFlag").item(0);
    cardFlagElement.value = flag;
    document
        .querySelector(`img[data-selected=true]`)
        ?.setAttribute("data-selected", "false");
    if (flag) {
        document
            .querySelector(`img[data-brand=${flag}]`)
            ?.setAttribute("data-selected", "true");
    }
}

function updateCreditCardMask(flag, cardNumber) {
    const creditCardFlags = mgConnector.config.cardsConfiguration.map(
        (item) => ({
            brand: item.brand,
            name: item.name,
            regex: new RegExp(item.numberFormat),
            image: item.image,
            mask: item.cardNumberMask,
        })
    );

    if (flag) {
        const fieldMask = creditCardFlags?.find(
            (x) => x.brand == flag
        )?.mask;
        if (fieldMask) {
            setCardNumberMask(
                fieldMask,
                cardNumber?.replace(/\D/g, "")?.length || 0
            );
        }
    }
}