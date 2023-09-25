"use strict";
const slideValue = document.querySelector(".sliderValue span");
const inputSlider = document.querySelector(".field input");
const createPassBtn = document.querySelector("#createPass");
const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const lowercase = "abcdefghijklmnopqrstuvwxyz";
const numbers = "0123456789";
const symbols = "!@#$%^&*()_-+=?";
const history = [];

const checkBoxInputs = document.querySelectorAll('input[type="checkbox"]');

// Assign default values to checkboxes
checkBoxInputs.forEach((checkbox, index) => {
    checkbox.checked = index !== 3;
});

// Handle input range to let span with the same value move with it
inputSlider.addEventListener("input", () => {
    const value = inputSlider.value;
    slideValue.textContent = value;
    slideValue.style.left = `${(value - 5) * 10}%`;
});

createPassBtn.addEventListener("click", () => {
    if (areCheckBoxesEmpty()) {
        displayError('Please select at least one character set.');
    } else {
        const inputRange = document.querySelector("#inputRange");
        const inputText = document.querySelector("#inputText");
        const lengthOfPass = Number(inputRange.value);
        inputText.value = createPass(lengthOfPass);
        history.unshift(inputText.value);
        displayHistory(history);
        const reloadIcon = document.querySelector(".reload-icon");
        reloadIcon.classList.add("spin");
        setTimeout(() => {
            reloadIcon.classList.remove("spin");
        }, 501);
    }
});

document.querySelector("#clearBtn").addEventListener("click", () => {
    history.length = 0;
    displayHistory(history);
});

document.querySelector("#copyBtn").addEventListener("click", function (e) {
    const inputTextValue = document.querySelector("#inputText").value;
    if (inputTextValue === "") {
        displayError('No password to copy.');
        e.preventDefault();
    } else {
        copyToClipboard(inputTextValue);
    }
});

function areCheckBoxesEmpty() {
    return ![...checkBoxInputs].some((checkbox) => checkbox.checked);
}

function createPass(number) {
    const characterSets = {
        uppercase,
        lowercase,
        numbers,
        symbols,
    };

    const checkedSets = [...checkBoxInputs]
        .filter((checkbox) => checkbox.checked)
        .map((checkbox) => checkbox.getAttribute("name"));

    let password = "";

    for (let i = 0; i < number; i++) {
        const selectedSetName = checkedSets[i % checkedSets.length];
        const selectedSet = characterSets[selectedSetName];
        const randomChar = selectedSet[Math.floor(Math.random() * selectedSet.length)];
        password += randomChar;
    }

    return password;
}

const historyContainer = document.querySelector("#insideHistory");

function displayHistory(arr) {
    historyContainer.innerHTML = "";

    const historyFragment = document.createDocumentFragment();
    const constLengthArr = arr.slice(0, 5);

    for (const item of constLengthArr) {
        const historyItem = createHistoryItem(item);
        historyFragment.appendChild(historyItem);
    }

    historyContainer.appendChild(historyFragment);
}

function createHistoryItem(item) {
    const historyItem = document.createElement("div");
    historyItem.classList.add("p-2", "my-3", "w-100", "d-flex", "justify-content-between");

    const historyText = document.createElement("p");
    historyText.classList.add("fs-6");
    historyText.textContent = item;

    const copiedSpan = document.createElement("span");
    copiedSpan.classList.add("fs-6", "gray-clor");
    copiedSpan.style.opacity = "0";
    copiedSpan.textContent = "Copied";

    const copyIcon = document.createElement("i");
    copyIcon.classList.add("fa-solid", "fa-copy", "fa-xl", "pt-3");
    copyIcon.style.color = "#fafafa";
    copyIcon.onclick = function () {
        toggleCopied(this);
    };

    historyItem.appendChild(historyText);
    historyItem.appendChild(copiedSpan);
    historyItem.appendChild(copyIcon);

    return historyItem;
}

function toggleCopied(iconElement) {
    const spanElement = iconElement.previousElementSibling;
    const pElemnt = spanElement.previousElementSibling;
    navigator.clipboard.writeText(pElemnt.textContent).then(() => {
        if (spanElement.style.opacity === "0") {
            spanElement.style.opacity = "1";
            setTimeout(() => {
                spanElement.style.opacity = "0";
            }, 500);
        } else {
            spanElement.style.opacity = "0";
        }
    });
}

function displayError(message) {
    const errorMessage = document.querySelector("#warning");
    errorMessage.textContent = message;
    errorMessage.style.opacity = "100%";
    setTimeout(() => {
        errorMessage.style.opacity = "0%";
    }, 2000);
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        const copyButtonSpan = document.querySelector("#copyBtn span");
        copyButtonSpan.textContent = "Copied";
        setTimeout(function () {
            copyButtonSpan.textContent = "COPY PASSWORD_";
        }, 1000);
    });
}





