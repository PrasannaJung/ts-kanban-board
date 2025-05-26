"use strict";
const boards = ["Todo", "Doing", "Done"];
const allBoards = document.querySelectorAll(".board");
const allCards = document.querySelectorAll(".card");
allCards.forEach((card) => {
    //   card.addEventListener("dragstart", function (event: DragEvent) {
    //     const targetElement = event.target as HTMLDivElement;
    //     console.log("THE ELEMENT BEING DRAGGED IS ", targetElement.id);
    //     event.dataTransfer?.setData("text/plain", targetElement.id);
    //   });
});
allBoards.forEach(function (board) {
    board.addEventListener("dragstart", function (event) {
        var _a;
        const targetElement = event.target;
        console.log("THE ELEMENT BEING DRAGGED IS ", targetElement.id);
        const dto = {
            boardId: parseInt(event.currentTarget.id),
            targetElementId: targetElement.id,
        };
        (_a = event.dataTransfer) === null || _a === void 0 ? void 0 : _a.setData("application/json", JSON.stringify(dto));
    });
    board.addEventListener("dragover", function (event) {
        event.preventDefault();
        console.log("ELEMENT OVER A DROPZONE");
    });
    board.addEventListener("drop", function (event) {
        var _a;
        const receivedDto = JSON.parse((_a = event.dataTransfer) === null || _a === void 0 ? void 0 : _a.getData("application/json"));
        console.log("ELEMENT DROPPED IN THE DROPZONE OF ID", receivedDto);
        if (parseInt(this.id) - receivedDto.boardId <= 1) {
            this.appendChild(document.getElementById(receivedDto.targetElementId));
        }
    });
});
