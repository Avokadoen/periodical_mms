import { fromEvent, of, merge } from "rxjs";
import { exhaustMap, catchError, filter, delay, flatMap } from "rxjs/operators"

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
            object_number:          document.getElementById("objectNumber"),
            mms_id:                 document.getElementById("mmsId"),
            mms_clip:               document.getElementById("mmsClip"),
            current_title:          document.getElementById("currentTitle"),
            previous_title:         document.getElementById("previousTitle"),
            previous_title_hint:    document.getElementById("previousTitleHint"),
            next_title:             document.getElementById("nextTitle"),
            next_title_hint:        document.getElementById("nextTitleHint"),
        },

        alerts: {
            warning: document.getElementById("alert-warning"),
            error: document.getElementById("alert-danger"),
            placeholder: document.getElementById("alert-placeholder"),

            fireMessage: (message, type, duration) => {
                let alert;
                switch (type) {
                    case 'warning':
                        alert = state.alerts.warning;
                        break;
                    case 'danger':
                        alert = state.alerts.error;
                        break;
                    default:
                        console.error(`Type was of unexpected type ${type}`);
                        return;
                }
                
                // This might cause memory leaks ... TO BAD
                // TODO: This is wonky if you fire a new event before animation is done, consider locking alerts 
                of(null).pipe(
                    exhaustMap(() => {
                        alert.innerHTML = message;
                        state.alerts.placeholder.style.display = 'none';
                        alert.style.display = 'block';
                        alert.classList.remove('alert-anim');
                        return of(null);
                    }),
                    delay(duration),
                    flatMap(() => {
                        alert.classList.add('alert-anim');
                        return of(null);
                    }),
                    // delay until animation is done which is hardcoded 2000ms
                    delay(2000), 
                ).subscribe(
                    () => {
                        alert.innerHTML = "";
                        state.alerts.placeholder.style.display = 'block';
                        alert.style.display = 'none';
                    }
                );
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

        setActive: (active) => {
            if (active === 'spinner') {
                state.search_elements.spinner.style.display = 'block';
                state.search_elements.button.style.display = 'none';
            } else {
                state.search_elements.spinner.style.display = 'none';
                state.search_elements.button.style.display = 'block';
            }
        },

        resetDisplayFields: () => {
            state.display_elements.object_number.value = "";
            state.display_elements.mms_id.value = "";
            state.display_elements.current_title.value = "";
            state.display_elements.previous_title.value = "";
            state.display_elements.previous_title_hint.innerHTML = "";
            state.display_elements.next_title.value = "";
            state.display_elements.next_title_hint.innerHTML = "";
        },

        importDisplayFields: (source) => {
            // move object number inside display
            state.display_elements.object_number.value = state.search_elements.input.value;
            state.search_elements.input.value = "";
            state.handleUserInput();

            state.display_elements.mms_id.value = source.mms_id;
            const title_content = (source.sub_title) ? source.title + "\n" + source.sub_title : source.title;
            state.display_elements.current_title.value = title_content;
            state.display_elements.previous_title.value = source.previous_title;
            state.display_elements.previous_title_hint.innerHTML = source.previous_title_hint;
            state.display_elements.next_title.value = source.next_title;
            state.display_elements.next_title_hint.innerHTML = source.next_title_hint;
        },

        handleUserInput: () => {
            if (state.getInputValue().length > 17) {
                state.search_elements.input.value = state.getInputValue().slice(0, -1);
            } 
        
            state.search_elements.hint.innerHTML = state.getInputValue().length + "/17";
        }
    }

    fromEvent(state.display_elements.mms_clip, 'click').subscribe(
        n => copyToClipboard(n, state)
    );

    setupSearchFunctionality(state);
}

// Source: https://www.w3schools.com/howto/howto_js_copy_clipboard.asp
function copyToClipboard(button, state) {
    // Store selection if found
    const selected = document.getSelection().rangeCount > 0 ? document.getSelection().getRangeAt(0) : false;
    let element
    switch (button.srcElement.id) {
        case "mmsClip":
            console.log(state.display_elements.mms_id);
            element = state.display_elements.mms_id;
            break;
        default: 
            console.error('unknown button id');
            return;
    }
    if (element.value < 0) {
        state.alerts.fireMessage(`Kan ikke kopiere tomt felt`, "warning", 600);
        return; 
    }

    element.select();
    document.execCommand('copy');

    state.alerts.fireMessage(`${element.value} kopiert!`, "warning", 600);    

    if (selected) {                                 
        document.getSelection().removeAllRanges();    
        document.getSelection().addRange(selected); 
    } 
}


/// Initial setup for input logic
function setupSearchFunctionality(state) {
    const onSearch = () => {

        // side effect loading indication
        state.setActive('spinner');

        if (!state.isValdInput()) {
            state.alerts.fireMessage("Input er ikke gyldig", "warning", 1000);
            return of(null);
        }

        state.resetDisplayFields();

        const url = createUrl(state.getInputValue());

        const request = new XMLHttpRequest();
        request.open('GET', url);
    
        return of(request);
    }

    // Setup search key
    fromEvent(document, "keypress").pipe(
        filter(k => k.key === "Enter"),
        exhaustMap(onSearch),
    ).subscribe(
        req => {
            // TODO: custom operator to avoid nested subscriptions
            fetchAndHandleRequest(req, state)
        }, 
        console.error
    )

    // Setup search button
    fromEvent(state.search_elements.button, "click").pipe(
        exhaustMap(onSearch),
    ).subscribe(
        req => {
            // TODO: custom operator to avoid nested subscriptions
            fetchAndHandleRequest(req, state)
        }, 
        console.error
    );

    // TODO: on programatic change to avoid having to call handleUserInput manually
    // Incase browser has cached value in input field
    state.handleUserInput();
    const onInput = fromEvent(state.search_elements.input, "input");
    merge(onInput).subscribe(
        () => state.handleUserInput()
    );
}

/// Attempts to fetch xml from sru using an opened XMLHttpRequest request
/// NOTE: this will cause subscribe pyramid as XMLHttpRequest API is not well
///       suited for rxjs
function fetchAndHandleRequest(req, state) {
    if (req === null) {
        state.setActive('button');
        return;
    }

    fromEvent(req, 'load').pipe(
        catchError(() => state.setActive('button'))
    ).subscribe(
    () => {
        const went_wrong = () => {
            state.alerts.fireMessage(`Noe gikk galt under søking av objekt med id ${state.search_elements.input.value} Status: ${req.status}`, "danger", 3000);
        }

        let record_data = { status: -1 };
        if (Math.abs(req.status - 200) < 100) {
            record_data = parseXML(req.responseXML);
            if (record_data.status === 0) {
                state.importDisplayFields(record_data);
            }
        }

        if (record_data.status < 0) {
            went_wrong();
        }

        // side effect end loading indication
        state.setActive('button');
    },
        () => state.setActive('button')
    );

    req.send();
}

// This way we can have seperate function to set display fields
// so that we can reset them on search
// TODO: this will silently fail in any state except expected state
function parseXML(xmlDoc) {
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

    const numberOfRecords = xmlDoc.getElementsByTagName('numberOfRecords')[0].innerHTML;
    if (numberOfRecords === "0") {
        return { status: -1 };
    }

    let record_data = {
        status: 0,
        mms_id: "",
        title: "",
        sub_title: "",
        previous_title: "",
        previous_title_hint: "",
        next_title: "",
        next_title_hint: ""
    };
 
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
                record_data.mms_id = mmsIdElement.innerHTML;
            }
        }
    }

    // Retrieve current sub- and title
    {
        const element = findElementByAttribute(datafields, "tag", "245");
        const sub_fields = element.getElementsByTagName('subfield');

        const title = findElementByAttribute(sub_fields, "code", "a");
        record_data.title = title.innerHTML ? title.innerHTML : "";

        let sub_title_b = findElementByAttribute(sub_fields, "code", "b");
        record_data.sub_title = sub_title_b.innerHTML ? sub_title_b.innerHTML : "";

        let sub_title_c = findElementByAttribute(sub_fields, "code", "c");
        record_data.sub_title += (sub_title_c.innerHTML) ? sub_title_c.innerHTML + "\n" : "";
    }

    const retrieve_title_hist = (attr) => {
        const rtr = {
            title: "",
            hint: "",
        }

        const element = findElementByAttribute(datafields, "tag", attr);
        if (!element) {
            return rtr;
        }

        const sub_fields = element.getElementsByTagName('subfield');
        const pre_title = findElementByAttribute(sub_fields, "code", "t");
        rtr.title = pre_title.innerHTML.replace("&amp;", "&");

        const year = findElementByAttribute(sub_fields, "code", "g");
        rtr.hint = `Endret: ${year.innerHTML}`;

        return rtr;
    }

    // Previous title
    {
        const prev_title = retrieve_title_hist("780");
        record_data.previous_title = prev_title.title;
        record_data.previous_title_hint = prev_title.hint;
    }

    // Next title
    {
        const next_title = retrieve_title_hist("785");
        record_data.next_title = next_title.title;
        record_data.next_title_hint = next_title.hint;
    }

    return record_data;
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

