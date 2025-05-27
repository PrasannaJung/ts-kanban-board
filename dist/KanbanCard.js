export class KanbanCard {
    constructor(id, text) {
        this.element = document.createElement("div");
        this.element.id = id;
        this.element.className = "card";
        this.element.textContent = text;
        this.element.draggable = true;
        this.attachEvents();
    }
    attachEvents() {
        this.element.addEventListener("dragstart", (event) => {
            this.element.classList.add("dragging");
            const parentBoard = this.element.parentElement;
            if (parentBoard && event.dataTransfer) {
                const dto = {
                    boardId: parseInt(parentBoard.id),
                    targetElementId: this.element.id,
                };
                console.log("THE DTO IS ", dto);
                event.dataTransfer.setData("application/json", JSON.stringify(dto));
            }
        });
        this.element.addEventListener("dragend", () => {
            this.element.classList.remove("dragging");
        });
        this.element.addEventListener("blur", () => {
            var _a;
            this.element.contentEditable = "false";
            if (((_a = this.element.textContent) === null || _a === void 0 ? void 0 : _a.trim()) === "") {
                this.element.textContent = "Empty Task";
            }
        });
        this.element.addEventListener("keydown", (event) => {
            if (event.key === "Enter") {
                event.preventDefault();
                this.element.blur();
            }
        });
        this.element.addEventListener("dblclick", () => {
            this.element.contentEditable = "true";
            this.element.focus();
            const selection = window.getSelection();
            if (selection) {
                const range = document.createRange();
                range.selectNodeContents(this.element);
                selection.removeAllRanges();
                selection.addRange(range);
            }
        });
    }
}
