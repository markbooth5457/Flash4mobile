// some code pinched from http://developer.apple.com/internet/webcontent/XMLHttpRequestExample/example.html

// global flag
var isIE = false;

// global request and XML document objects
var req1;
var req2;

// retrieve XML document (reusable generic function);
// parameter is URL string (relative or complete) to
// an .xml file whose Content-Type is a valid XML
// type, such as text/xml; XML source must be from
// same domain as HTML file
function loadXMLDoc(url) {
    // branch for native XMLHttpRequest object
    if (window.XMLHttpRequest) {
        req2 = new XMLHttpRequest();
        req2.onreadystatechange = processReqChange2;
        req2.open("GET", url, true);
        req2.setRequestHeader("Content-Type", "text/xml;charset=UTF-8");
        req2.send("");
    // branch for IE/Windows ActiveX version
    } else if (window.ActiveXObject) {
        isIE = true;
        req2 = new ActiveXObject("Microsoft.XMLHTTP");
        if (req2) {
            req2.onreadystatechange = processReqChange2;
            req2.open("GET", url, true);
            req2.setRequestHeader("Content-Type", "text/xml;charset=UTF-8");
            req2.send("");
        }
    }
}
function loadXMLTopics(url) {
    // branch for native XMLHttpRequest object
    if (window.XMLHttpRequest) {
        req1 = new XMLHttpRequest();
        req1.onreadystatechange = processReqChange1;      
        req1.open("GET", url, true);
        req1.setRequestHeader("Content-Type", "text/xml;charset=UTF-8");
        req1.send("");
    // branch for IE/Windows ActiveX version
    } else if (window.ActiveXObject) {
        isIE = true;
        req1 = new ActiveXObject("Microsoft.XMLHTTP");
        if (req1) {
            req1.onreadystatechange = processReqChange1;
            req1.open("GET", url, true);
            req1.setRequestHeader("Content-Type", "text/xml;charset=UTF-8");
            req1.send("");
        }
    }
}
function loadXMLVerbs(url) {
    // branch for native XMLHttpRequest object
    if (window.XMLHttpRequest) {
        req3 = new XMLHttpRequest();
        req3.onreadystatechange = processReqChange3;      
        req3.open("GET", url, true);
        req3.setRequestHeader("Content-Type", "text/xml;charset=UTF-8");
        req3.send("");
    // branch for IE/Windows ActiveX version
    } else if (window.ActiveXObject) {
        isIE = true;
        req3 = new ActiveXObject("Microsoft.XMLHTTP");
        if (req3) {
            req3.onreadystatechange = processReqChange3;
            req3.open("GET", url, true);
            req3.setRequestHeader("Content-Type", "text/xml;charset=UTF-8");
            req3.send("");
        }
    }
}

// handle onreadystatechange event of req object for topics
function processReqChange1() 
{
    // only if req shows "loaded"
    if (req1.readyState == 4) 
    {
        // only if "OK"
        if (req1.status == 200) 
        {
 //               clearTopicList();
                buildTopicList();
        } 
        else 
        {
            alert("There was a problem retrieving the topic XML data:\n" +
                req1.status + req1.statusText);
        }
    }
}
// handle onreadystatechange event of req object for card file
function processReqChange2() 
{
    // only if req shows "loaded"
    if (req2.readyState == 4) 
    {
        // only if "OK"
        if (req2.status == 200 || req2.status ==304 ) 
        {
                buildDeckFromXML();
        } 
        else 
        {
            alert("There was a problem retrieving the XML data:\n" +
                req2.status + req2.statusText);
        }
    }
}

// handle onreadystatechange event of req object for verbs file
function processReqChange3() 
{
    // only if req shows "loaded"
    if (req3.readyState == 4) 
    {
        // only if "OK"
        if (req3.status == 200 || req3.status ==304 ) 
        {
                buildVerbTableFromXML();
        } 
        else 
        {
            alert("There was a problem retrieving the XML data:\n" +
                req3.status + req3.statusText);
        }
    }
}

// retrieve text of an XML document element, including
// elements using namespaces
function getElementTextNS(prefix, local, parentElem, index) {
    var result = "";
    if (prefix && isIE) {
        // IE/Windows way of handling namespaces
        result = parentElem.getElementsByTagName(prefix + ":" + local)[index];
    } else {
        // the namespace versions of this method 
        // (getElementsByTagNameNS()) operate
        // differently in Safari and Mozilla, but both
        // return value with just local name, provided 
        // there aren't conflicts with non-namespace element
        // names
        result = parentElem.getElementsByTagName(local)[index];
    }
    if (result) {
        // get text, accounting for possible
        // whitespace (carriage return) text nodes 
        if (result.childNodes.length > 1) {
            var pack ="";
            for (var i=0; i<result.childNodes.length; i++)
            {
                pack += (result.childNodes[i].nodeValue).replace(/^\s+|\s+$/g, "");
            }
            return pack;
        } else {
            return result.firstChild.nodeValue;    		
        }
    } else {
        return "n/a";
    }
}

//add rows to the table of verbs
function buildVerbTableFromXML() {
   
    var verbs = req3.responseXML.getElementsByTagName("verb");
    var table = document.getElementById('List');
    var row;
    var cell;
    var infinitive;
    var names = new Array("prsnt","imprfct","prtrt","pstprtcpl","grnd","imprtv","prsntsbj","notes");
    // loop through <verb> elements, and add a row to the verb table
    // using the various tense elements
    for (var i = 0; i < verbs.length; i++) {
        row = table.insertRow(1);
        // now work through the tenses (columns)
        cell = row.insertCell(0);
        infinitive = getElementTextNS("", "infntv", verbs[i], 0);
        var translation = getElementTextNS("", "english", verbs[i], 0);
        key = infinitive+"english";
        tenseAry[key] = translation;
        cell.innerHTML = "<span id='"+key
                                +"' onmouseover='rollOverSpan(event)'"
                                +" onmouseout='rollOffSpan(event)'>"
                                +infinitive+"</span>";
        var tense;
        
        for(k=0; k<names.length; k++)
        {
            tense = names[k];
            cell = row.insertCell(k+1);
            var type = "Irregular"
            if (verbs[i].getElementsByTagName(tense)[0].getAttribute("regular") == "true") {
                type = "Regular";
            }
            
            key = tense+infinitive;
            tenseAry[key] = getElementTextNS("", tense, verbs[i], 0);
            cell.innerHTML = "<span id='"+key
                            +"' onmouseover='rollOverSpan(event)'"
                            +" onmouseout='rollOffSpan(event)'>"
                            +type+"</span>";
            
        }
    }
}

// add cards with items from
// the current XML document
function buildDeckFromXML() {
    var items = req2.responseXML.getElementsByTagName("c");
    // loop through <c> elements, and add a card to the deck
    // using the <f> and <b> elements
    for (var i = 0; i < items.length; i++) {
        var front = getElementTextNS("", "f", items[i], 0);
        var back = getElementTextNS("", "b", items[i], 0);
        c.add_card(front,back);
    }
    c.display_card();
}

// empty select list content
function clearList(select) {
    while (select.length > 0) {
        select.remove(0);
    }
}

// add item to select element 
function appendToSelect(select, value, content) {
    var opt;
    opt = document.createElement("option");
    opt.value = value;
    opt.appendChild(content);
    select.appendChild(opt);
}

// fill Topics select list with items from
// the XML topics document
function buildTopicList() {
    var topicSelect = document.getElementById("topics");
   // clearList(topicSelect);
    var topics = req1.responseXML.getElementsByTagName("topic"); 
    
    var topicName;
    var file;
    var title;
    
    // loop through <topics> elements, adding them to the topics select element with entry the <topicname>
    // and add each nested <item> element to an array for later populating the items select element
    for (var i = 0; i < topics.length; i++) {
        // within each topic, save the <item>s in an associative array on <topicname>
        topicName = getElementTextNS("", "topicname", topics[i], 0);
        
        appendToSelect(topicSelect, topicName, document.createTextNode(topicName) );
        descriptions[topicName] = new Array();
        topicItems[topicName] = new Array();
        var items = topics[i].getElementsByTagName("item");
        for (var j = 0; j < items.length; j++)
        {
            file = getElementTextNS("", "file", items[j], 0);
            title = getElementTextNS("", "title", items[j], 0);
            
            var entry = new Array();
            entry["file"] = file;
            entry["title"] = document.createTextNode(title);
            topicItems[topicName][j] = entry;
            descriptions[file] = getElementTextNS("", "descr", items[j], 0);
        }
    }
}

// fill items select list from array topicItems
function setItems(select, topicName)
{
    clearList(select);
    appendToSelect(select,"",document.createTextNode("now a section..."));
    for (var i = 0; i < topicItems[topicName].length; i++)
    {
        var value = topicItems[topicName][i]["file"];
        var content = topicItems[topicName][i]["title"];
        appendToSelect(select, value,content );
    }

}
