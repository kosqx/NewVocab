#!/usr/bin/env python
#-*- coding: utf-8 -*-


def generate_nltk_brown():
	import nltk.data
	#print nltk.data.path
	nltk.data.path.append('/home/kosqx/English/nltk_data')
	from nltk.corpus import brown

	words = brown.words()

	counts = {}

	for word in words:
		word = word.lower()

		if word != word.upper():
			counts[word] = counts.get(word, 0) + 1

	counted = [(c, w) for w, c in counts.iteritems()]

	counted.sort()
	counted.reverse()

	return [w for c, w in counted]


def generate_wiki_gutenberg():
	import urllib2
	import re

	def download_single(url):
		opener = urllib2.build_opener()
		opener.addheaders = [('User-agent', 'Mozilla/5.0')]
		f = opener.open(url)

		data = f.read()
	
		words = re.findall(r'''<a href="/wiki/([a-zA-Z']+)" title="\1">\1</a>''', data)
		return words

	urls = [
		'http://en.wiktionary.org/wiki/Wiktionary:Frequency_lists/PG/2006/04/1-10000',
		'http://en.wiktionary.org/wiki/Wiktionary:Frequency_lists/PG/2006/04/10001-20000',
		'http://en.wiktionary.org/wiki/Wiktionary:Frequency_lists/PG/2006/04/20001-30000',
		'http://en.wiktionary.org/wiki/Wiktionary:Frequency_lists/PG/2006/04/30001-40000',
	]

	result = []

	for url in urls:
		result.extend(download_single(url))

	return result


def format_js_list(words):
	formated = ['NewVocab_data = [\n']

	for i, word in enumerate(words):
		formated.append(' "%s",' % word)
		if i % 10 == 9:
			formated.append('\n')

		if i % 100 == 99:
			formated.append('// %d:\n' % (i + 1))

	formated.append('\n]')

	return ''.join(formated)


print format_js_list(generate_wiki_gutenberg())

