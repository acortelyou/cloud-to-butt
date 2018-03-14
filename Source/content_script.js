var dashClass = "[\\u002D\\u00AD\\u05BE\\u1806\\u2010-\\u2015\\u207B\\u2212\\uFE58\\uFE63\\uFE63\\uFF0D\\u002F\\u005C\\u2215\\u244A\\uFF0F\\uFF3C]";
var quoteClass = "[\\u0022\\u0027\\u0060\\u00B4\\u2018\\u2019\\u201C\\u201D]";
var replacements = [];

{
	addReplacement("\\b(\\s*"+quoteClass+"\\s*)Left(\\s*"+quoteClass+"\\s*)\\b", "$1Periwinkle$2");
	addReplacement("\\b(\\s*"+quoteClass+"\\s*)left(\\s*"+quoteClass+"\\s*)\\b", "$1periwinkle$2");
	addReplacement("\\b(\\s*"+quoteClass+"\\s*)Right(\\s*"+quoteClass+"\\s*)\\b", "$1Orangered$2");
	addReplacement("\\b(\\s*"+quoteClass+"\\s*)right(\\s*"+quoteClass+"\\s*)\\b", "$1orangered$2");
	addReplacement("\\b([Aa][Ll][Tt]\\s*"+dashClass+"*\\s*)Left\\b", "$1Periwinkle");
	addReplacement("\\b([Aa][Ll][Tt]\\s*"+dashClass+"*\\s*)left\\b", "$1periwinkle");
	addReplacement("\\b([Aa][Ll][Tt]\\s*"+dashClass+"*\\s*)Right\\b", "$1Orangered");
	addReplacement("\\b([Aa][Ll][Tt]\\s*"+dashClass+"*\\s*)right\\b", "$1orangered");
	addReplacement("\\bLeft(\\s*"+dashClass+"+\\s*[Ww]ing)", "Periwinkle$1");
	addReplacement("\\bleft(\\s*"+dashClass+"+\\s*[Ww]ing)", "periwinkle$1");
	addReplacement("\\bRight(\\s*"+dashClass+"+\\s*[Ww]ing)", "Orangered$1");
	addReplacement("\\bright(\\s*"+dashClass+"+\\s*[Ww]ing)", "orangered$1");
	addReplacement("\\bLeft("+dashClass+"+)(?![Hh][Aa][Nn][Dd])", "Periwinkle$1");
	addReplacement("\\bleft("+dashClass+"+)(?![Hh][Aa][Nn][Dd])", "periwinkle$1");
	addReplacement("\\bRight("+dashClass+"+)(?![Hh][Aa][Nn][Dd])", "Orangered$1");
	addReplacement("\\bright("+dashClass+"+)(?![Hh][Aa][Nn][Dd])", "orangered$1");
	addReplacement("("+dashClass+"+)Right\\b", "$1Orangered");
	addReplacement("("+dashClass+"+)right\\b", "$1orangered");
	addReplacement("("+dashClass+"+)Left\\b", "$1Periwinkle");
	addReplacement("("+dashClass+"+)left\\b", "$1periwinkle");
	addReplacement("\\b[Tt]he Left(?!"+dashClass+"+)(?!\\s*[Ss]ide)\\b", "Periwinkle");
	addReplacement("\\b[Tt]he left(?!"+dashClass+"+)(?!\\s*[Ss]ide)\\b", "periwinkle");
	addReplacement("\\b[Tt]he Right(?!"+dashClass+"+)(?!\\s*[Ss]ide)\\b", "Orangered");
	addReplacement("\\b[Tt]he right(?!"+dashClass+"+)(?!\\s*[Ss]ide)\\b", "orangered");
	addReplacement("\\bLeft( [Pp]olitic)", "Periwinkle$1");
	addReplacement("\\bRight( [Pp]olitic)", "Orangered$1");

	walk(document.body);
}

function addReplacement(pattern, replacement) {
	replacements.push({regex: new RegExp(pattern, "g"), replacement: replacement});
}

function walk(node, parent)
{
	var child, next;
	
	if ("tagName" in node)
	switch ( node.tagName.toLowerCase() )
	{
		case "script":
		case "style":
		case "meta":
		case "input":
		case "textarea":
			return;
	}
	
	if ("classList" in node &&
		"indexOf" in node.classList &&
		node.classList.indexOf("ace_editor") > -1) {
		return;
	}
		
	switch ( node.nodeType )  
	{
		case 1:  // Element
		case 9:  // Document
		case 11: // Document fragment
			child = node.firstChild;
			while ( child ) 
			{
				next = child.nextSibling;
				walk(child, node);
				child = next;
			}
			break;

		case 3: // Text node
			handleText(node, parent);
			break;
	}
}

function handleText(textNode, parent) 
{
	var v = textNode.nodeValue;
		
	var em = parent != null && parent.nodeName == "EM", emStart = "", emEnd = "";
	
	if (em) {
		if (parent.previousSibling != null && parent.previousSibling.nodeType == 3) emStart = parent.previousSibling.nodeValue;
		if (parent.nextSibling != null && parent.nextSibling.nodeType == 3) emEnd = parent.nextSibling.nodeValue;
		v = emStart + v + emEnd;
	}
	
	for (var i = 0; i < replacements.length; i++) {
		var old = v;
		v = v.replace(replacements[i].regex, replacements[i].replacement);
		if (em) {
			emStart = emStart.replace(replacements[i].regex, replacements[i].replacement);
			emEnd = emEnd.replace(replacements[i].regex, replacements[i].replacement);
		}
	}
	
	if (em) {
		var start = 0;
		while (start < emStart.length && emStart.charAt(start) == v.charAt(start)) {
			start++;
		}
		var end = 0;
		while (end < emEnd.length && emEnd.charAt(emEnd.length-1-end) == v.charAt(v.length-1-end)) {
			end++;
		}
		v = v.substr(start, v.length-start-end);
	}
	
	textNode.nodeValue = v;
}
