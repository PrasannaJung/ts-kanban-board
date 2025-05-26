const boards = ["Todo", "Doing", "Done"];

const allBoards = document.querySelectorAll<HTMLDivElement>(".board");
const allCards = document.querySelectorAll<HTMLDivElement>(".card");

allCards.forEach((card) => {
  //   card.addEventListener("dragstart", function (event: DragEvent) {
  //     const targetElement = event.target as HTMLDivElement;
  //     console.log("THE ELEMENT BEING DRAGGED IS ", targetElement.id);
  //     event.dataTransfer?.setData("text/plain", targetElement.id);
  //   });
});

allBoards.forEach(function (board) {
  board.addEventListener("dragstart", function (event: DragEvent) {
    const targetElement = event.target as HTMLDivElement;
    console.log("THE ELEMENT BEING DRAGGED IS ", targetElement.id);
    const dto = {
      boardId: parseInt((<HTMLDivElement>event.currentTarget).id),
      targetElementId: targetElement.id,
    };
    event.dataTransfer?.setData("application/json", JSON.stringify(dto));
  });

  board.addEventListener("dragover", function (event: DragEvent) {
    event.preventDefault();
    console.log("ELEMENT OVER A DROPZONE");
  });

  board.addEventListener("drop", function (event: DragEvent) {
    const receivedDto = JSON.parse(
      event.dataTransfer?.getData("application/json")!
    );
    console.log("ELEMENT DROPPED IN THE DROPZONE OF ID", receivedDto);
    if (parseInt(this.id) - receivedDto.boardId <= 1) {
      this.appendChild(
        document.getElementById(receivedDto.targetElementId) as HTMLDivElement
      );
    }
  });
});
