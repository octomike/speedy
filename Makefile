build:
	cd ../pebblejs && git reset --hard && git clean -f
	cp -r resources ../pebblejs
	cp -r src/*.js ../pebblejs/src/js/
	cd ../pebblejs && pebble build && pebble install

clean:
	cd ../pebblejs && git reset --hard && git clean -f && pebble clean

