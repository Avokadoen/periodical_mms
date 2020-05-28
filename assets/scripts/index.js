import { fromEvent, from } from "rxjs";
import { exhaustMap, delay } from "rxjs/operators"

fromEvent(document, 'DOMContentLoaded').subscribe(main);

function main() {
    let state = {
        // All elements relevant to the object id form
        search_elements: {
            input: document.getElementById("objectIdForm"),
            button: document.getElementById("objectSearchBtn"),
            spinner: document.getElementById("objectSearchSpinner"),
            helper: document.getElementById("objectIdFormHelp"),
        }
    }

    fromEvent(state.search_elements.button, "click").pipe(
        delay(400),
        exhaustMap(ev => fetchEntry("71518658360002201"))        
    ).subscribe(console.log);

}

function fetchEntry(id) {
    const sru_url = "https://bibsys.alma.exlibrisgroup.com/view/sru/47BIBSYS_NETWORK"
                  + "?version=1.2&operation=searchRetrieve&recordSchema=marcxml&maximumRecords=1"
                  + "&query=alma.granular_resource_type=p AND alma.all_for_ui="
    const fetch_url = sru_url + id;

    return from(
        fetch(fetch_url, { 
            method: 'GET',  
            mode: 'cors',
            Origin: 'https://avokadoen.github.io/periodical_mms',
            Accept: 'application/xhtml+xml,application/xml',
        }).then(response => response)
    );
    
}