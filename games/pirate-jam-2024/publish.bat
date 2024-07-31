call npm run build:production:full
call tar -a -c -f homunculus.zip dist
call butler push homunculus.zip kibertoad/we-have-homunculus-at-home:web-beta