//import { fromEvent } from "rxjs";

//fromEvent(document, 'DOMContentLoaded').subscribe(() => console.log('coolio'));

document.addEventListener("DOMContentLoaded", main);

function main() {
    // 
    const searchButton =  document.getElementById("objectSearchBtn");
    searchButton.addEventListener("click", () => console.log('jippi'));
}