import { KanbanBoard } from "./KanbanBoard.js";
document.addEventListener("DOMContentLoaded", () => {
    const boardNames = ["Todo", "Doing", "Done"];
    const boards = boardNames.map((name, index) => new KanbanBoard(index, name));
    const addCardBtn = document.getElementById("addCardBtn");
    if (addCardBtn) {
        addCardBtn.addEventListener("click", () => {
            boards[0].addCard();
        });
    }
});
