@echo off
cls
node tools/build.js -n odin
start build\demo\index.html
