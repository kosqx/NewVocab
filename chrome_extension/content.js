
function textNodeIterator(node, func) {
	'use strict';

	if (node.nodeType === 3) {
		func(node);
	} else if (node.nodeType === 1) {
		var children = node.childNodes, i;
		for (i = 0; i < children.length; i += 1) {
			textNodeIterator(children[i], func);
		}
	}
}

function isInWords(config, word) {
	'use strict';

	return config.dict[word] === true;
}

function isNew(config, word) {
	'use strict';

	if (isInWords(config, word)) {
		return false;
	}

	var i = 0;
	for (i = 0; i < config.lex.length; i += 1) {
		var lex = config.lex[i],
			base_word = word.replace(lex[0], lex[1]);
		if (isInWords(config, base_word)) {
			return false;
		}
	}

	return true;
}

function highlightText(config, content) {
	'use strict';

	var result = [],
		parts = content.split(/([a-zA-Z']+)/),
		i = 0;
		part = null;

	for (i = 0; i < parts.length; i += 1) {
		var part = parts[i];
		if (i % 2 === 1) {
			if (isNew(config, part.toLowerCase())) {
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

function highlightPage(vocab_size) {
	'use strict';

	var dict = {}, 
		i = 0;
	for (i = 0; i < Math.min(NewVocab_data.length, vocab_size); i += 1) {
		dict[NewVocab_data[i]] = true;
	}

	var config = {
		'vocab_size': vocab_size,
		'dict': dict,
		'lex': [
			[/s$/, ''],
			[/es$/, ''],
			[/es$/, 'e'],
			[/ies$/, 'y']
		],
	};

	textNodeIterator(document.body, function (node) {
		var newNode = document.createElement("span"),
			parentNode = node.parentNode;

		newNode.innerHTML = highlightText(config, node.data);
		parentNode.replaceChild(newNode, node);

		return 0;
	});
}
