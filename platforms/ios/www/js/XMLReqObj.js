// some code adapted from http://developer.apple.com/internet/webcontent/XMLHttpRequestExample/example.html

// global flag
var isIE = false;

// retrieve XML document (reusable generic function);
// parameter is URL string (relative or complete) to
// an .xml file whose Content-Type is a valid XML
// type, such as text/xml; XML source must be from
// same domain as HTML file
// function XMLReqObj(url,process) {
//     this.url = url;
//     this.processXML = process;
//     this.processReq = processReqChange;
//     var self = this;// used in inner method cos this doesn't work right
//     // branch for native XMLHttpRequest object
//     if (window.XMLHttpRequest) {
//         this.req = new XMLHttpRequest();
//     // branch for IE/Windows ActiveX version
//     } else if (window.ActiveXObject) {
//         isIE = true;
//         this.req = new ActiveXObject("Microsoft.XMLHTTP");
//     }
//     if (this.req) {
//         this.req.onreadystatechange = this.processReq;
//         this.req.open("GET", url, true);
//         this.req.setRequestHeader("Content-Type", "text/xml;charset=UTF-8");
//         this.req.send("");
//     }
//replaced by...
 function XMLReqObj(url,process) {
   $.ajax({
     type: 'GET',
     url: url,
     // data to be added to query string:
     //data: { name: 'Zepto.js' },
     // type of data we are expecting in return:
     dataType: 'text/xml;charset=UTF-8',
     timeout: 1300,
     context: $('body'),
     success: function(event,success ,xhr){
        process(xhr.responseXML);
      },
     error: function(xhr, type){
       alert('Ajax error!'+" loading: "+url)
     }
   })
}
// or...

//$.post(url,[data],function(data, status, xhr){...},[dataType]) => XMLHttpRequest


    // handle onreadystatechange event of req object
    function processReqChange()
    {
        // only if req shows "loaded"
        if (self.req.readyState == 4)
        {
            // only if "OK"
            if (self.req.status == 200)
            {
              alert(self.req.responseXML)
                    self.processXML(self.req.responseXML);
            }
            else
            {
                alert("There was a problem retrieving the XML data:\n" +
                    self.req.status + self.req.statusText);
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
