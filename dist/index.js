"use strict";
const boards = ["Backlog", "Doing", "Review", "Done"];
const doingBox = document.querySelector(".doing");
const allCards = document.querySelectorAll(".card");
allCards.forEach((card) => {
    card.addEventListener("dragstart", function (event) {
        var _a;
        const targetElement = event.target;
        console.log("THE ELEMENT BEING DRAGGED IS ", targetElement.id);
        (_a = event.dataTransfer) === null || _a === void 0 ? void 0 : _a.setData("text/plain", targetElement.id);
    });
});
doingBox.addEventListener("dragover", function (event) {
    event.preventDefault();
    console.log("ELEMENT OVER A DROPZONE");
});
doingBox.addEventListener("drop", function (event) {
    var _a;
    const cardID = (_a = event.dataTransfer) === null || _a === void 0 ? void 0 : _a.getData("text/plain");
    console.log("ELEMENT DROPPED IN THE DROPZONE OF ID", cardID);
    this.appendChild(document.getElementById(cardID));
});
