console.log("Hej, jestem pluginem");

WORDS = NewVocab_data;

//alert(NewVocab_data);

//document.write('foo');

// (function() {
//     var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
//     ga.src = chrome.extension.getURL("data.js");
//     var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
// })();

function textNodeIterator(node, func){
    if(node.nodeType === 3){
        func(node)
    } else if(node.nodeType === 1) {
       var children = node.childNodes;
       for(var i = 0; i < children.length; i++) {
          textNodeIterator(children[i], func);
       }
    }
}


function findWords(str) {
    var offset = 0;
    var result = [];
    var parts = str.toLowerCase().split(/([a-z]+)/)
    for(var i = 0; i < parts.length; i++) {
        if (i % 2 == 1) {
            result.push({'length': parts[i].length, 'offset': offset, 'text': parts[i]});
        }
        offset += parts[i].length;
    }
    if (offset != str.length) console.log('MISS:' + str);
    return result;
}

var ENG_LEX = [
	[/s$/, ''],
	[/es$/, ''],
	[/es$/, 'e'],
	[/ies$/, 'y'],
];

var WORDS_dict = {};
for (var i = 0; i < WORDS.length; i++) {
	WORDS_dict[WORDS[i]] = true;
}

function isInWords(word) {
	//return WORDS.indexOf(word) != -1;
	return WORDS_dict[word] === true;
}

function isNew(word) {
    //return /^a.{2,}/.test(word);
	
	//return WORDS.indexOf(word) == -1;
	
	if (isInWords(word)) {
		return false;
	}
	
	for (var i = 0; i < ENG_LEX.length; i++) {
		var lex = ENG_LEX[i];
		var base_word = word.replace(lex[0], lex[1]);
		if (isInWords(base_word)) {
			return false;
		}
	}
	return true;   
}

function innerHighlight(node, pat, fbgcolor) {
    if (node.nodeType == 3) {
        var pos = node.data.toUpperCase().indexOf(pat);
        if (pos >= 0) {
            var spannode = document.createElement('span');
            spannode.className = 'highlight';
            // Setting padding & margin to 0px to fix this -- https://github.com/curiosity/Find-Many-Strings/issues/1
            fbgcolor += ";padding: 0px; margin: 0px;";
            spannode.setAttribute('style', fbgcolor);
            var middlebit = node.splitText(pos);
            var endbit = middlebit.splitText(pat.length);
            var middleclone = middlebit.cloneNode(true);
            spannode.appendChild(middleclone);
            middlebit.parentNode.replaceChild(spannode, middlebit);
            skip = 1;
        }
    }
}

function hlText(content) {
   var result = [];
    var parts = content.split(/([a-zA-Z]+)/)
    
    for(var i = 0; i < parts.length; i++) {
        var part = parts[i];
        if (i % 2 == 1) {
            if (isNew(part.toLowerCase())) {
                result.push('<span style="background-color: #ffff00; color: #0000ff;">' + part + '</span>');
            } else {
                result.push(part);
            }
        } else {
            result.push(part);
        }
    }
    //if (offset != str.length) console.log('MISS:' + str);
    //return result;
    return result.join('');
}



function findAndReplace(container) {
     var content = container.innerHTML;
   var result = [];
    //var parts = content.split(/([a-z]+)/)
    var parts = content.split(/(>[^<.]*)([a-z]+)([^<.]*)/)
    
    for(var i = 0; i < parts.length; i++) {
        var part = parts[i];
        if (i % 2 == 1) {
            if (isNew(part)) {
                result.push('<span style="background-color: #ffff00; color: #0000ff;">' + part + '</span>');
            } else {
                result.push(part);
            }
        } else {
            result.push(part);
        }
    }
    //if (offset != str.length) console.log('MISS:' + str);
    //return result;
    container.innerHTML = result.join('');
}

//findAndReplace(document.body);


textNodeIterator(document.body, function (node) {
    //innerHighlight(node, 'A', 'background-color: #ffffbb;');
    //node.innerHTML = '<span style="background-color: #ffffbb;">' + node.data + '</span>';
    var newNode = document.createElement("span");
    //newNode.innerHTML = '<span style="background-color: #ffffbb;">' + node.data + '</span>';
    newNode.innerHTML = hlText(node.data);
    var parentNode = node.parentNode;
    parentNode.replaceChild(newNode, node);
    
    return 0;
        //console.log(node.data);
    var words = findWords(node.data);
    //console.log('found');
    var total = 0;
    for(var i = 0; i < words.length; i++) {
        var word = words[i];
        if (!isNew(word.text)) continue;
        
        total++;
        if (total > 3) break;
        console.log(word);

    }
})
