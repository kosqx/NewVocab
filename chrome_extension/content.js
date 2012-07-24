var NewVocab_lex = [
	[/s$/, ''],
	[/es$/, ''],
	[/es$/, 'e'],
	[/ies$/, 'y'],
];

var NewVocab_dict = {};
for (var i = 0; i < NewVocab_data.length; i++) {
	NewVocab_dict[NewVocab_data[i]] = true;
}

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

function isInWords(word) {
	return NewVocab_dict[word] === true;
}

function isNew(word) {
	if (isInWords(word)) {
		return false;
	}
	
	for (var i = 0; i < NewVocab_lex.length; i++) {
		var lex = NewVocab_lex[i];
		var base_word = word.replace(lex[0], lex[1]);
		if (isInWords(base_word)) {
			return false;
		}
	}

	return true;
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
	return result.join('');
}

textNodeIterator(document.body, function (node) {
	var newNode = document.createElement("span");
	var parentNode = node.parentNode;

	newNode.innerHTML = hlText(node.data);
	parentNode.replaceChild(newNode, node);
	
	return 0;
})
