GLSL-HELPER
=====

THis is a simple command line helper for making it simpler to separate chunks of glsl into different files.(though technically this will work 
with any text based file)


How to use 
===
- `npm install`
- `<name tbd>` + options
- add `#include <filename>` to your files.   

Options
=====
- outputPath: "the path to output the compiled files too"
- vertex: path to vertex shader
- fragment: path to fragment shader


Notes 
====
- The traversal depth is currently only one file: for example if you include the "random" module into your vertex shader, any include statements in the "random" module will be ignored. 
