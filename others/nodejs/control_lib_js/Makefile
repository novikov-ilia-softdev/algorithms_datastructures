test:
	./node_modules/.bin/mocha --reporter list --ui tdd --timeout 3000

test_debug:
	./node_modules/.bin/mocha --debug --reporter list --ui tdd --timeout 500

test_bamboo:
	./node_modules/.bin/mocha --reporter mocha-bamboo-reporter --ui tdd --timeout 500

.PHONY: test test_debug 