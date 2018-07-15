/**
 * @author: Mostafa Bayomi
 * bayomim@tcd.ie
 * 
 * The main file to run OntoSeg
 * 
 * 
 * 
 */ 
var similarity = require('similarity');
var sys = require("hybrid");
var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var os = require('os');
var mkdirp = require('mkdirp');


/**
 * The declaration of the "walk" method. It should have been written in a separate module as it is used many times.
 * @param {*} dir the directory where your files are
 * @param {*} done a callback when finish reading the paths of the files in the given directory
 */
var walk = function (dir, done) {
  var results = [];
  fs.readdir(dir, function (err, list) {
    if (err) return done(err);
    var pending = list.length;
    if (!pending) return done(null, results);
    list.forEach(function (file) {
      file = path.resolve(dir, file);
      fs.stat(file, function (err, stat) {
        if (stat && stat.isDirectory()) {
          walk(file, function (err, res) {
            results = results.concat(res);
            if (!--pending) done(null, results);
          });
        } else {
          results.push(file);
          if (!--pending) done(null, results);
        }
      });
    });
  });
};
var textFiles = [],
vsmFiles = [];

/**
 * Here, is the start of everything. 
 * First, the similarity method is called.
 * This method simply loads the similarity files.
 * These files are found in the "sim" directory. Each file represents a class from DBpedis (e.g. "Actor", "Mammal", etc.).
 * Each file contains the semantic similarity score between the class (the file name is the class) and all other classes in DBpedia.
 * For example, for class "Actor", you will see file caleed "Actor.txt" contains an array of objects. 
 * Each object represents the semantic score of class "Actor" with other classes in DBpedia.
 * For examaple, you will see: [{"b":"Person","sim":0.6666666666666666},....
 * This means that the semantic score between class "Actor" and class "Person" in DBpedia is 0.6666666666666666.
 * The similarity score is based on the Wu&Palmer algorithm (read the OntoSeg paper for maore details).
 * Note that in the given example that "b" is for code purposes.
 * 
 * NOTE that each files may not contain similarity scores for all classes in DBpedia.
 * This is for two reasons: 
 *    1- If the similarity score of the current class (e.g. "Actor") and class (say "X") is zero, it is not added to the file to save some space. 
 *    2- If the similarity between class "X" and class "Actor" has been calculated before and saved in class X's file ("X.txt"), no need to put it in class Actor's file. 
 * 
 * After loading the similarity files into memory, the "walk" method is called to load all files in the given directory.
 */
similarity.start(function () {
    /**
     * "data/wiki/text" is the path to the directory where the .txt and .vsm files are.
     * Note that the .vsm files were buitl using the provided system called ("BuildVSM")
     */
    walk("data/wiki/text",function (err, textResults) {
        if (err) {
         console.log("Error in loading texts - "+err);
          throw err;
        }
        else {
			textFiles = textResults; // textResults: a list (array) containing all absolute paths of all found files in that directory and sub-directories. I make it = to textResults, the global array to be accessible from anywhere in the code
			run(0);// start running from index 0 in the "textFiles" list (start from the first file)
		}
	});
});
var allFilesStr = "";
/**
 * This methodd runs the OntoSeg algorithm (sys.run_system)
 * The method uses the text file and the classes file (the file contains vectors of classes of the given text) and then produces segments and then writes
 * the output in .txt file.
 * The output file contains the hierarchy of the text producedd by OntoSeg.
 * It produces only the top three levels (excluding the root)
 * The output looks like the following:
            ch1.txt
            0,1,2,12--0,2,12--2,12
            ========
 * this means that the output of OntoSeg for that file that contains 13 sentences (last index is 12 because the sentences numbers is zero-based) is:
 *      - The boundaries of the FIRST top level (after the root) are: 2,12. In another words, the text in the top level in the tree (under the root)
 *        is segmented into TWO segments where the boundaries are 2 and 12, i.e. first segment contains sentences 0, 1 and 2 and second segment contains sentneces 3,4,...,12
 *      - The boundaries of the SECOND top level (after the root) are: 0,2,12. In another words, the text in the SECOND top level in the tree (under the root)
 *        is segmented into THREE segments where the boundaries are 0, 2 and 12, i.e. first segment contains sentence number 0 only (the first sentence) 
 *        the second segment contains sentneces 0, 1 and 2 and theird segment contains sentneces 3,4,...,12
 *      - You can understand the theird level.
 * 
 * Note that I methion "after the root" because the root of the produced tree contains the whole sentences (the 13 sentences). Any algorithm that produces 
 * a hierarchy tree will have the same root. So in measuring the algorithm performance, we don't consider the root.
 * 
 * 
 * I produce the output as mentioned above so it fits with the evaluation code I've develpoed/modified. I used the code provided by (Kazantseva & Szpakowicz 2014).
 * For more info see: http://anna-kazantseva.com/content
 * 
 * You can use any evaluation measure and any implementation you want. You can simply read my output and convert it into any shape you want.
 * 
 * @param {*} fileIndex the number of the file in the "textFiles" array.
 */
function run(fileIndex){
	var textFileName = textFiles[fileIndex];
	var vsmFileName = textFileName.replace("text","vsm")+".vsm";
	sys.run_system(textFileName, vsmFileName, function (fileStr) {
		allFilesStr+= fileStr;
        fileIndex++;
        if (fileIndex < textFiles.length) { // still there are files
			allFilesStr+="\n========\n";
            run(fileIndex);
        }
        else {
            console.log("set is done\n\n");
			console.log(allFilesStr)
			// write the final file for the dataset
			writeFile(allFilesStr, function(){return;});
        }
    });
}

/**
 * A method to write the output file
 * @param {*} data the output text, e.g. 0,1,2,12--0,2,12--2,12
 * @param {*} cb 
 */
function writeFile(data,cb){
	var saveDir = "data/wiki";
	mkdirp(saveDir, function (err) {
        var fileExper = saveDir + "/OntoSeg_wiki_02.txt";
        var file = fs.createWriteStream(fileExper);
        file.on('error', function (err) { console.log("My_Error:" + err); });
        file.write(data,function () {
            file.end();
            cb();
        });
        
    });
	
	
	
	
	
	
}
