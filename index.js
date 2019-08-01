#!/usr/bin/env node
const fs = require('fs');
const args = require('minimist')(process.argv.slice(2));
const chokidar = require('chokidar');
const readline = require('readline');

// output path to write shaders to 
let outputDir = null;

// paths to vertex and fragment shaders
let vertex,fragment = null;

// path to a modules directory, if this is null, then the watcher will only react to changes in your 
// vertex and fragment shaders. 
let modules = null;


// if we have an output path, save it, this will overwrite anything previously saved. 
if(args.hasOwnProperty("outputDir")){
    fs.writeFileSync("./output.txt",args.outputDir);
    outputDir = args.outputDir;
    setupProcess();
}else {

    // check for existance of a output path. 
    try {
        outputDir = fs.readFileSync("./output.txt","utf8");
        setupProcess();
    }catch(e){
        throw new Error("No output path was found and no output path was specified.");
    }
}





/**
 * Start checking for glsl 
 */
function setupProcess(){

    // first make output directory if it doesn't already exist
    if(!fs.existsSync(outputDir)){
        fs.mkdirSync(outputDir);
    }

    if(args.hasOwnProperty("vertex") && args.hasOwnProperty("fragment")){

        
        const watcher = chokidar.watch([
            args.vertex,args.fragment, args.modules !== undefined ? args.modules : ""
        ]);
     

        watcher.on('change', path => {
            // get filename 
            let file = path.split("/");
            file = file[file.length - 1];
            processShader(path).then(compiled => {
                fs.writeFile(`${outputDir}/${file}`,compiled,(err) => {

                    if(err){
                        throw err;
                    }
                });
            });
        });




    }else{
        throw new Error("No input file specified");
    }
}

// parses file for includes 
function processShader(file){

    return new Promise((res,rej) => {

        // ========== PARSE SHADER ============== //
        let shader = "";
        let reader = readline.createInterface({
            input:fs.createReadStream(file)
        });

   
        // read line by line, replace include statements with files specified. 
        reader.on('line',line => {
        if(line.search("#include") !== -1){
          
           // isolate include statement 
           let p = line.split("#include ");
           
           // take the last item in array, that's the path to grab
           let file = p[p.length - 1];

          
           try {
               // When you include files, the path is currently treated as a relative path based on where you run this tool. 
               // TODO need to figure out what the best way is on how to resolve where included files are
               let importedFile = fs.readFileSync(file,"utf8");
           
               line = importedFile;
               shader += line + "\n";

           }catch(e){
               throw new Error("In vertex shader, unable to include " + file);
           }

       }else{
           shader += line + "\n";
       }    
    })

    // ========== PARSE FRAGMENT SHADER ============== //
        reader.on('close',() => {
            res(shader);
        });

    })

}