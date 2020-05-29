import { fromEvent, from, empty, of, Observable } from "rxjs";
import { exhaustMap, delay, tap, catchError, flatMap } from "rxjs/operators"

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
            previousTitles: document.getElementById("previousTitles"),
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
        }
    }

    //setupSearchFunctionality(state);
    injectRelevantFields(test_xml, state.display_elements);
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

            return initRequest(state.getInputValue());
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
    fromEvent(req, 'load').subscribe(() => {
            console.log(req.responseXML);
            injectRelevantFields(req, state.display_elements);

            // side effect end loading indication
            state.set_active('button');
        },
        () => state.set_active('button')
    );

    req.send();
}

function injectRelevantFields(text, display_elements) {
    const parser = new DOMParser();
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
    }

    {
        const target_institute = '47BIBSYS_NB';

        const control_fields = xmlDoc.getElementsByTagName('datafield');
        const elements = findElementsByAttribute(control_fields, "tag", "852");
        for (let element of elements) {
            const sub_fields = element.getElementsByTagName('subfield');
            const institute = findElementByAttribute(sub_fields, "code", "a");

            if (institute.textContent.includes(target_institute)) {
                const mmsIdElement = findElementByAttribute(sub_fields, "code", "6");
                // TODO: emit error event if element is null
                display_elements.mmsId.value = mmsIdElement !== null ? mmsIdElement.textContent : "";
            }
        }
        
    }

    

}

function initRequest(id) {
    const url = createUrl(id);
       
    const request = new XMLHttpRequest();
    request.open('GET', url);

    return of(request);
}


function createUrl(id) {
    const target_host_name = "bibsys.alma.exlibrisgroup.com";
    // Because Alma SRU is a creation from hell, they don't support Origin -> Acccess-Control-Allow-Origin
    // responses, and so the browser refuse to load fetched content.
    // as a **sinful** hack we send our SRU to a herokuapp that serves as our backend.
    const cors_anywhere_url = "https://cors-anywhere.herokuapp.com/" 
    const sru_url = cors_anywhere_url + "https://" + target_host_name
                  + "/view/sru/47BIBSYS_NB?version=1.2&operation=searchRetrieve&recordSchema=marcxml"
                  + "&maximumRecords=1&query=alma.granular_resource_type=p AND alma.all_for_ui="
    
    return sru_url + id;
}

/*
/// Fetches an alma entry with *id*
function fetchEntry(id) {


    // TODO: use this if we set up a backend
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
        
}*/


const test_xml = `<?xml version="1.0" encoding="UTF-8"?><searchRetrieveResponse xmlns="http://www.loc.gov/zing/srw/">
<version>1.2</version>
<numberOfRecords>1</numberOfRecords>
<records>
  <record>
    <recordSchema>marcxml</recordSchema>
    <recordPacking>xml</recordPacking>
    <recordData>
      <record xmlns="http://www.loc.gov/MARC21/slim">
        <leader>01537nas--2200481-a-4500</leader>
        <controlfield tag="001">999919897247602201</controlfield>
        <controlfield tag="005">20190927105609.0</controlfield>
        <controlfield tag="008">751101c18959999no-qx-p-o-----0---b0nor-c</controlfield>
        <datafield tag="010" ind1=" " ind2=" ">
          <subfield code="a">###99111268</subfield>
          <subfield code="z">sf 81003069</subfield>
        </datafield>
        <datafield tag="016" ind1="7" ind2=" ">
          <subfield code="a">010509673</subfield>
          <subfield code="2">Uk</subfield>
        </datafield>
        <datafield tag="016" ind1="7" ind2=" ">
          <subfield code="a">010509673</subfield>
          <subfield code="2">Uk</subfield>
        </datafield>
        <datafield tag="016" ind1="7" ind2=" ">
          <subfield code="a">010509673</subfield>
          <subfield code="2">Uk</subfield>
        </datafield>
        <datafield tag="016" ind1="7" ind2=" ">
          <subfield code="a">010509673</subfield>
          <subfield code="2">Uk</subfield>
        </datafield>
        <datafield tag="016" ind1="7" ind2=" ">
          <subfield code="a">010509673</subfield>
          <subfield code="2">Uk</subfield>
        </datafield>
        <datafield tag="022" ind1=" " ind2=" ">
          <subfield code="a">0039-7717</subfield>
        </datafield>
        <datafield tag="035" ind1=" " ind2=" ">
          <subfield code="a">(OCoLC)1767053</subfield>
        </datafield>
        <datafield tag="035" ind1=" " ind2=" ">
          <subfield code="a">(CKB)110978977122426</subfield>
        </datafield>
        <datafield tag="035" ind1=" " ind2=" ">
          <subfield code="a">(CONSER)---99111268-</subfield>
        </datafield>
        <datafield tag="035" ind1=" " ind2=" ">
          <subfield code="a">(EXLCZ)99110978977122426</subfield>
        </datafield>
        <datafield tag="042" ind1=" " ind2=" ">
          <subfield code="a">pcc</subfield>
        </datafield>
        <datafield tag="043" ind1=" " ind2=" ">
          <subfield code="a">e-no---</subfield>
        </datafield>
        <datafield tag="050" ind1="0" ind2="0">
          <subfield code="a">AP45</subfield>
          <subfield code="b">.S8</subfield>
        </datafield>
        <datafield tag="082" ind1="0" ind2="0">
          <subfield code="a">058/.3982</subfield>
          <subfield code="2">19</subfield>
        </datafield>
        <datafield tag="210" ind1="0" ind2=" ">
          <subfield code="a">Syn segn</subfield>
        </datafield>
        <datafield tag="222" ind1=" " ind2="0">
          <subfield code="a">Syn og segn</subfield>
        </datafield>
        <datafield tag="245" ind1="0" ind2="0">
          <subfield code="a">Syn og segn :</subfield>
          <subfield code="b">norsk tidsskrift utgjeve av Det Norske samlaget.</subfield>
        </datafield>
        <datafield tag="246" ind1="1" ind2=" ">
          <subfield code="i">Issues for 1984- have title:</subfield>
          <subfield code="a">Syn &amp; segn</subfield>
        </datafield>
        <datafield tag="260" ind1=" " ind2=" ">
          <subfield code="a">Oslo :</subfield>
          <subfield code="b">Johansen &amp; Nielsens prenteverk</subfield>
        </datafield>
        <datafield tag="300" ind1=" " ind2=" ">
          <subfield code="a">volumes :</subfield>
          <subfield code="b">illustrations, portraits ;</subfield>
          <subfield code="c">23-26 cm</subfield>
        </datafield>
        <datafield tag="310" ind1=" " ind2=" ">
          <subfield code="a">4 no. a year,</subfield>
          <subfield code="b">1984-&lt;1999></subfield>
        </datafield>
        <datafield tag="321" ind1=" " ind2=" ">
          <subfield code="a">Ten no. a year,</subfield>
          <subfield code="b">&lt;1961>-1979</subfield>
        </datafield>
        <datafield tag="321" ind1=" " ind2=" ">
          <subfield code="a">8 no. a year,</subfield>
          <subfield code="b">1980-1983</subfield>
        </datafield>
        <datafield tag="336" ind1=" " ind2=" ">
          <subfield code="a">text</subfield>
          <subfield code="b">txt</subfield>
          <subfield code="2">rdacontent</subfield>
        </datafield>
        <datafield tag="337" ind1=" " ind2=" ">
          <subfield code="a">unmediated</subfield>
          <subfield code="b">n</subfield>
          <subfield code="2">rdamedia</subfield>
        </datafield>
        <datafield tag="338" ind1=" " ind2=" ">
          <subfield code="a">volume</subfield>
          <subfield code="b">nc</subfield>
          <subfield code="2">rdacarrier</subfield>
        </datafield>
        <datafield tag="362" ind1="1" ind2=" ">
          <subfield code="a">Began with 1. årg. in 1895.</subfield>
        </datafield>
        <datafield tag="588" ind1=" " ind2=" ">
          <subfield code="a">Description based on: 8. aarg., 6 (juni 1902); title from cover.</subfield>
        </datafield>
        <datafield tag="588" ind1=" " ind2=" ">
          <subfield code="a">Latest issue consulted: 105. årg., hefte 2 (1999).</subfield>
        </datafield>
        <datafield tag="650" ind1=" " ind2="0">
          <subfield code="a">Periodicals.</subfield>
        </datafield>
        <datafield tag="650" ind1=" " ind2="7">
          <subfield code="a">Periodicals.</subfield>
          <subfield code="2">fast</subfield>
          <subfield code="0">(OCoLC)fst01058072</subfield>
        </datafield>
        <datafield tag="710" ind1="2" ind2=" ">
          <subfield code="a">Norske samlaget.</subfield>
        </datafield>
        <datafield tag="853" ind1="0" ind2="0">
          <subfield code="8">1</subfield>
          <subfield code="a">årg.</subfield>
          <subfield code="b">hefte</subfield>
          <subfield code="i">(year)</subfield>
        </datafield>
        <datafield tag="863" ind1="4" ind2="0">
          <subfield code="8">1</subfield>
          <subfield code="a">&lt;27>-</subfield>
          <subfield code="i">&lt;1921>-</subfield>
          <subfield code="x">provisional</subfield>
        </datafield>
        <datafield tag="852" ind1="0" ind2="1">
          <subfield code="a">47BIBSYS_HIOA</subfield>
          <subfield code="6">999919790759602212</subfield>
          <subfield code="9">E</subfield>
        </datafield>
        <datafield tag="852" ind1="0" ind2="1">
          <subfield code="a">47BIBSYS_MF</subfield>
          <subfield code="6">999919750939502227</subfield>
          <subfield code="9">E</subfield>
        </datafield>
        <datafield tag="852" ind1="0" ind2="1">
          <subfield code="a">47BIBSYS_NLA</subfield>
          <subfield code="6">999919687025002228</subfield>
          <subfield code="9">E</subfield>
        </datafield>
        <datafield tag="852" ind1="0" ind2="1">
          <subfield code="a">47BIBSYS_AHO</subfield>
          <subfield code="6">999919697039902237</subfield>
          <subfield code="9">E</subfield>
        </datafield>
        <datafield tag="852" ind1="0" ind2="1">
          <subfield code="a">47BIBSYS_SIRUS</subfield>
          <subfield code="6">999919682932802256</subfield>
          <subfield code="9">E</subfield>
        </datafield>
        <datafield tag="852" ind1="0" ind2="1">
          <subfield code="a">47BIBSYS_DIASYK</subfield>
          <subfield code="6">999919632323502265</subfield>
          <subfield code="9">E</subfield>
        </datafield>
        <datafield tag="852" ind1="0" ind2="1">
          <subfield code="a">47BIBSYS_HVO</subfield>
          <subfield code="6">999919762209702220</subfield>
          <subfield code="9">E</subfield>
        </datafield>
        <datafield tag="852" ind1="0" ind2="1">
          <subfield code="a">47BIBSYS_DIAKON</subfield>
          <subfield code="6">999919729428502247</subfield>
          <subfield code="9">E</subfield>
        </datafield>
        <datafield tag="852" ind1="0" ind2="1">
          <subfield code="a">47BIBSYS_NTNU_UB</subfield>
          <subfield code="6">999919782251202203</subfield>
          <subfield code="9">E</subfield>
        </datafield>
        <datafield tag="852" ind1="0" ind2="1">
          <subfield code="a">47BIBSYS_LOVISHS</subfield>
          <subfield code="6">999919690624302272</subfield>
          <subfield code="9">E</subfield>
        </datafield>
        <datafield tag="852" ind1="0" ind2="1">
          <subfield code="a">47BIBSYS_GLOMDAL</subfield>
          <subfield code="6">999919662189002299</subfield>
          <subfield code="9">E</subfield>
        </datafield>
        <datafield tag="852" ind1="0" ind2="1">
          <subfield code="a">47BIBSYS_HIT</subfield>
          <subfield code="6">999919714339502210</subfield>
          <subfield code="9">E</subfield>
        </datafield>
        <datafield tag="852" ind1="0" ind2="1">
          <subfield code="a">47BIBSYS_BRC</subfield>
          <subfield code="6">999919658320202229</subfield>
          <subfield code="9">E</subfield>
        </datafield>
        <datafield tag="852" ind1="0" ind2="1">
          <subfield code="a">47BIBSYS_AHUS</subfield>
          <subfield code="6">999919724097702263</subfield>
          <subfield code="9">E</subfield>
        </datafield>
        <datafield tag="852" ind1="0" ind2="1">
          <subfield code="a">47BIBSYS_UBIN</subfield>
          <subfield code="6">999919791820502211</subfield>
          <subfield code="9">E</subfield>
        </datafield>
        <datafield tag="852" ind1="0" ind2="1">
          <subfield code="a">47BIBSYS_HIM</subfield>
          <subfield code="6">999919702006802223</subfield>
          <subfield code="9">E</subfield>
        </datafield>
        <datafield tag="852" ind1="0" ind2="1">
          <subfield code="a">47BIBSYS_NIH</subfield>
          <subfield code="6">999919675319402238</subfield>
          <subfield code="9">E</subfield>
        </datafield>
        <datafield tag="852" ind1="0" ind2="1">
          <subfield code="a">47BIBSYS_BREDK</subfield>
          <subfield code="6">999919715399502261</subfield>
          <subfield code="9">E</subfield>
        </datafield>
        <datafield tag="852" ind1="0" ind2="1">
          <subfield code="a">47BIBSYS_RIKSANT</subfield>
          <subfield code="6">999919670428302233</subfield>
          <subfield code="9">E</subfield>
        </datafield>
        <datafield tag="852" ind1="0" ind2="1">
          <subfield code="a">47BIBSYS_NB</subfield>
          <subfield code="6">999919894875602202</subfield>
          <subfield code="9">E</subfield>
        </datafield>
        <datafield tag="852" ind1="0" ind2="1">
          <subfield code="a">47BIBSYS_HIO</subfield>
          <subfield code="6">999919731750702218</subfield>
          <subfield code="9">E</subfield>
        </datafield>
        <datafield tag="852" ind1="0" ind2="1">
          <subfield code="a">47BIBSYS_UBO</subfield>
          <subfield code="6">999919759175702204</subfield>
          <subfield code="9">E</subfield>
        </datafield>
        <datafield tag="852" ind1="0" ind2="1">
          <subfield code="a">47BIBSYS_SSB</subfield>
          <subfield code="6">999919663829402226</subfield>
          <subfield code="9">E</subfield>
        </datafield>
        <datafield tag="852" ind1="0" ind2="1">
          <subfield code="a">47BIBSYS_HH</subfield>
          <subfield code="6">999919881922902214</subfield>
          <subfield code="9">E</subfield>
        </datafield>
        <datafield tag="852" ind1="0" ind2="1">
          <subfield code="a">47BIBSYS_HIB</subfield>
          <subfield code="6">999919800904502221</subfield>
          <subfield code="9">E</subfield>
        </datafield>
        <datafield tag="852" ind1="0" ind2="1">
          <subfield code="a">47BIBSYS_MAIHAUG</subfield>
          <subfield code="6">999919672794502270</subfield>
          <subfield code="9">E</subfield>
        </datafield>
        <datafield tag="852" ind1="0" ind2="1">
          <subfield code="a">47BIBSYS_NILU</subfield>
          <subfield code="6">999919669188902292</subfield>
          <subfield code="9">E</subfield>
        </datafield>
        <datafield tag="852" ind1="0" ind2="1">
          <subfield code="a">47BIBSYS_UBA</subfield>
          <subfield code="6">999919728543902209</subfield>
          <subfield code="9">E</subfield>
        </datafield>
        <datafield tag="852" ind1="0" ind2="1">
          <subfield code="a">47BIBSYS_UBB</subfield>
          <subfield code="6">999919750852202207</subfield>
          <subfield code="9">E</subfield>
        </datafield>
        <datafield tag="852" ind1="0" ind2="1">
          <subfield code="a">47BIBSYS_BI</subfield>
          <subfield code="6">999919703562602215</subfield>
          <subfield code="9">E</subfield>
        </datafield>
        <datafield tag="852" ind1="0" ind2="1">
          <subfield code="a">47BIBSYS_DMMH</subfield>
          <subfield code="6">999919677186602262</subfield>
          <subfield code="9">E</subfield>
        </datafield>
        <datafield tag="852" ind1="0" ind2="1">
          <subfield code="a">47BIBSYS_UBTO</subfield>
          <subfield code="6">999919768223202205</subfield>
          <subfield code="9">E</subfield>
        </datafield>
        <datafield tag="852" ind1="0" ind2="1">
          <subfield code="a">47BIBSYS_BUSKSYK</subfield>
          <subfield code="6">999919681979202266</subfield>
          <subfield code="9">E</subfield>
        </datafield>
        <datafield tag="852" ind1="0" ind2="1">
          <subfield code="a">47BIBSYS_DEPSS</subfield>
          <subfield code="6">999919666185902253</subfield>
          <subfield code="9">E</subfield>
        </datafield>
        <datafield tag="852" ind1="0" ind2="1">
          <subfield code="a">47BIBSYS_OSTFSYK</subfield>
          <subfield code="6">999918979658302303</subfield>
          <subfield code="9">E</subfield>
        </datafield>
        <datafield tag="906" ind1=" " ind2=" ">
          <subfield code="a">JOURNAL</subfield>
        </datafield>
      </record>
    </recordData>
    <recordIdentifier>999919897247602201</recordIdentifier>
    <recordPosition>1</recordPosition>
  </record>
</records>
<extraResponseData xmlns:xb="http://www.exlibris.com/repository/search/xmlbeans/">
  <xb:exact>true</xb:exact>
  <xb:responseDate>2020-05-29T11:59:31+0200</xb:responseDate>
</extraResponseData>
</searchRetrieveResponse>
`