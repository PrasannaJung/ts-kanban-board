const boards = ["Backlog", "Doing", "Review", "Done"];

const doingBox = document.querySelector(".doing") as HTMLDivElement;
const allCards = document.querySelectorAll<HTMLDivElement>(".card");

allCards.forEach((card) => {
  card.addEventListener("dragstart", function (event: DragEvent) {
    const targetElement = event.target as HTMLDivElement;
    console.log("THE ELEMENT BEING DRAGGED IS ", targetElement.id);
    event.dataTransfer?.setData("text/plain", targetElement.id);
  });
});

doingBox.addEventListener("dragover", function (event: DragEvent) {
  event.preventDefault();
  console.log("ELEMENT OVER A DROPZONE");
});

doingBox.addEventListener("drop", function (event: DragEvent) {
  const cardID = event.dataTransfer?.getData("text/plain")!;
  console.log("ELEMENT DROPPED IN THE DROPZONE OF ID", cardID);
  this.appendChild(document.getElementById(cardID) as HTMLDivElement);
});
