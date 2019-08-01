const fs = require('fs');
const args = require('minimist')(process.argv.slice(2));
const chokidar = require('chokidar');
const readline = require('readline');

// output path to write shaders to 
let outputDir = null;

let vertex,fragment = null;

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
            args.vertex,args.fragment
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

        // ========== PARSE VERTEX SHADER ============== //
        let shader = "";
        let reader = readline.createInterface({
            input:fs.createReadStream(file)
        });

   
        // read line by line, replace include statements with files specified. 
        reader.on('line',line => {
        if(line.search("#include") !== -1){
           
           // include takes up this many parts
           let stride = 9;

          
           // isolate include statement 
           let p = line.split("#include ");
           
           // take the last item in array, that's the path to grab
           let file = p[p.length - 1];

          
           try {
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