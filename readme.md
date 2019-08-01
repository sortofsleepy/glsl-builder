GLSL-HELPER
=====

This is a simple command line helper for making it simpler to separate chunks of glsl into different files.(though technically this will work 
with any text based file)


How to use 
===
- `npm install` (TODO update with better directions, it's slightly different if I remember correctly with command line tools)
- `glsl-builder` + options
- add `#include <filename>` to your files.   
- There will be a watch process started so things will re-compile with every change. 

Options
=====
- `--outputPath`: the path to output the compiled files too
- `--vertex`: path to vertex shader
- `--fragment`: path to fragment shader


Notes 
====
- The traversal depth is currently only one file: for example if you include the "random" module into your vertex shader, any include statements in the "random" module will be ignored. 
