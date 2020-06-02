import { fromEvent, from, empty, of, Observable } from "rxjs";
import { exhaustMap, delay, tap, catchError, flatMap } from "rxjs/operators"
// Export Carousel to html
import {CarouselEvent, CarouselEventHandler, CarouselOption} from 'bootstrap';

fromEvent(document, 'DOMContentLoaded').subscribe(main);

function main() {
    const state = {
        /// All elements relevant to the object id form
        search_elements: {
            input: document.getElementById("objectIdForm"),
            button: document.getElementById("objectSearchBtn"),
            spinner: document.getElementById("objectSearchSpinner"),
            hint: document.getElementById("objectIdFormHelp"),
        },

        display_elements: {
            mmsId: document.getElementById("mmsId"),
            currentTitle: document.getElementById("currentTitle"),
            updatedHint: document.getElementById("updatedHint"),
            subTitle: document.getElementById("subTitle"),
            previousTitles: document.getElementById("previousTitles"),
        },

        alerts: {
            warning: document.getElementById("alert-warning"),
            error: document.getElementById("alert-danger"),

            fire_message: (message, type) => {
                let alert;
                switch (type) {
                    case 'warning':
                        alert = warning;
                        break;
                    case 'danger':
                        alert = error;
                        break;
                }

                alert.style.display = 'block'
            }
        },

        /// Check if id is valid for search
        isValdInput: () => {
            if (state.getInputValue().length === 17 && !isNaN(state.getInputValue())) {
                return true;
            }

            return false;
        },

        /// Return the value of the input field
        getInputValue: () => {
            return state.search_elements.input.value;
        },

        set_active: (active) => {
            if (active === 'spinner') {
                state.search_elements.spinner.style.display = 'block';
                state.search_elements.button.style.display = 'none';
            } else {
                state.search_elements.spinner.style.display = 'none';
                state.search_elements.button.style.display = 'block';
            }
        },
    }


    setupSearchFunctionality(state);
}



/// Initial setup for input logic
function setupSearchFunctionality(state) {
    // Setup search button
    fromEvent(state.search_elements.button, "click").pipe(
        exhaustMap(ev => {
            // side effect loading indication
            state.set_active('spinner');

            if (!state.isValdInput()) {
                return of(null);
            }

            const url = createUrl(state.getInputValue());
       
            const request = new XMLHttpRequest();
            request.open('GET', url);
        
            return of(request);
        }),
    ).subscribe(
        req => {
            // TODO: custom operator to avoid nested subscriptions
            fetchAndHandleRequest(req, state)
        }, 
        console.error
    );

    // Incase browser has cached value in input field
    handleUserInput("", state);

    fromEvent(state.search_elements.input, "input").subscribe(
        event => handleUserInput(event, state)
    );
}

/// Handles user input event
function handleUserInput(event, state) {
    if (state.getInputValue().length > 17) {
        state.search_elements.input.value = state.getInputValue().slice(0, -1);
    } 

    state.search_elements.hint.innerHTML = state.getInputValue().length + "/17";
}

/// Attempts to fetch xml from sru using an opened XMLHttpRequest request
/// NOTE: this will cause subscribe pyramid as XMLHttpRequest API is not well
///       suited for rxjs
function fetchAndHandleRequest(req, state) {
    if (req === null) {
        state.set_active('button');
        return;
    }

    fromEvent(req, 'load').pipe(
        catchError(err => state.set_active('button'))
    ).subscribe(e => {
            if (Math.abs(req.status - 200) < 100) {
                injectRelevantFields(req.response, state.display_elements);
            } else {
                // TODO: alert error
            }
            

            // side effect end loading indication
            state.set_active('button');
        },
        () => state.set_active('button')
    );

    req.send();
}

// TODO: only retrieve field and insert into json
// This way we can have seperate function to set display fields
// so that we can reset them on search
function injectRelevantFields(text, display_elements) {
    const parser = new DOMParser();
    console.log(text)
    const xmlDoc = parser.parseFromString(text, "text/xml");

    const findElementsByAttribute = (fields, attrib, value) => {
        let elements = [];
        for (let field of fields) {
            if (field.getAttribute(attrib) === value) {
                elements.push(field);
            }
        }

        return elements;
    }

    const findElementByAttribute = (fields, attrib, value) => {
        for (let field of fields) {
            if (field.getAttribute(attrib) === value) {
                return field;
            }
        }

        return "";
    }

    const datafields = xmlDoc.getElementsByTagName('datafield');
    
    // Retrieve mms id and insert to html
    {
        const target_institute = '47BIBSYS_NB';
        const elements = findElementsByAttribute(datafields, "tag", "852");
        for (let element of elements) {
            const sub_fields = element.getElementsByTagName('subfield');
            const institute = findElementByAttribute(sub_fields, "code", "a");

            if (institute.textContent.includes(target_institute)) {
                const mmsIdElement = findElementByAttribute(sub_fields, "code", "6");
                // TODO: emit error event if element is null
                display_elements.mmsId.value = mmsIdElement.innerHTML;
            }
        }
    }

    // Retrieve current sub- and title
    {
        const element = findElementByAttribute(datafields, "tag", "245");
        const sub_fields = element.getElementsByTagName('subfield');

        const title = findElementByAttribute(sub_fields, "code", "a");
        display_elements.currentTitle.value = title.innerHTML ? title.innerHTML : "";

        let sub_title = findElementByAttribute(sub_fields, "code", "b");
        sub_title = (sub_title.length > 0) ? sub_title + "&#13;&#10;" : "";
        display_elements.subTitle.value = sub_title.innerHTML ? sub_title.innerHTML : "";
    }

    // Previous title
    {
        // const element = findElementByAttribute(datafields, "tag", "780");
        // const sub_fields = element.getElementsByTagName('subfield');

        // const pre_title = findElementByAttribute(sub_fields, "code", "a");
        // display_elements.previousTitles.value = title.innerHTML;

        // const year = findElementByAttribute(sub_fields, "code", "g");
        // display_elements.subTitle.value = sub_title.innerHTML;
    }
}


function createUrl(id) {
    // Because Alma SRU is a creation from hell, they don't support Origin -> Acccess-Control-Allow-Origin
    // responses, and so the browser refuse to load fetched content.
    // as a **sinful** hack we send our SRU to a herokuapp that serves as our backend.
    const cors_anywhere_url = "https://cors-anywhere.herokuapp.com/";

    const target_host_name = "bibsys.alma.exlibrisgroup.com";
    const sru_url = cors_anywhere_url + "https://" + target_host_name
                  + "/view/sru/47BIBSYS_NETWORK?version=1.2&operation=searchRetrieve&recordSchema=marcxml"
                  + "&maximumRecords=1&query=alma.granular_resource_type=p AND alma.all_for_ui="
    
    return sru_url + id;
}

