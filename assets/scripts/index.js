import { fromEvent, from, empty, of } from "rxjs";
import { exhaustMap, delay, tap, catchError } from "rxjs/operators"

fromEvent(document, 'DOMContentLoaded').subscribe(main);

function main() {
    const state = {
        // All elements relevant to the object id form
        search_elements: {
            // TODO: helper functions : isValidInput ...
            input: document.getElementById("objectIdForm"),
            button: document.getElementById("objectSearchBtn"),
            spinner: document.getElementById("objectSearchSpinner"),
            hint: document.getElementById("objectIdFormHelp"),
        },

        // Check if id is valid for search
        isValdInput: () => {
            const inputVal = state.search_elements.input.value;
            if (inputVal.length === 17 && !isNaN(inputVal)) {
                return true;
            }

            return false;
        },


    }

    setupSearchFunctionality(state);
    
}

function setupSearchFunctionality(state) {
    let set_active = (active) => {
        if (active === 'spinner') {
            state.search_elements.spinner.style.display = 'block';
            state.search_elements.button.style.display = 'none';
        } else {
            state.search_elements.spinner.style.display = 'none';
            state.search_elements.button.style.display = 'block';
        }
    }

    // Setup search button
    fromEvent(state.search_elements.button, "click").pipe(
        exhaustMap(ev => {
            // side effect loading indication
            set_active('spinner');

            if (!state.isValdInput()) {
                return of(null);
            }

            // fetch data
            const req = fetchEntry("71518658360002201");

            return req;
        }),
    
    ).subscribe(
        res => {
            // side effect end loading indication
            set_active('button');
            console.log(res)
        }, 
        console.error
    );

    // Incase browser has cached value in input field
    handleUserInput("", state.search_elements);

    fromEvent(state.search_elements.input, "input").subscribe(
        event => handleUserInput(event, state.search_elements)
    );
}

function handleUserInput(event, search_elements) {
    if (search_elements.input.value.length > 17) {
        search_elements.input.value = search_elements.input.value.slice(0, -1);
    } 

    search_elements.hint.innerHTML = search_elements.input.value.length + "/17";
}

function fetchEntry(id) {
    const target_host_name = "bibsys.alma.exlibrisgroup.com";
    const sru_url = "https://cors-anywhere.herokuapp.com/https://" + target_host_name
                  + "/view/sru/47BIBSYS_NETWORK?version=1.2&operation=searchRetrieve&recordSchema=marcxml"
                  + "&maximumRecords=1&query=alma.granular_resource_type=p AND alma.all_for_ui="
    const fetch_url = sru_url + id;

    return from(
        fetch(fetch_url, {
            method: 'GET',  
            mode: 'cors', // no-cors, *cors, same-origin
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            credentials: 'same-origin', 
            headers: {
              //'Accept': 'text/xml;charset=UTF-8',
              'Accept-Encoding': 'gzip, deflate, br',
              'Cache-Control': 'no-cache',
              'Host': target_host_name,
              //'Origin': window.location.origin,
              'X-Requested-With': 'XMLHttpRequest'
            },
            redirect: 'follow',
            referrerPolicy: 'no-referrer' 
        }).catch(() => null) // cancel request errors
    );
        
}