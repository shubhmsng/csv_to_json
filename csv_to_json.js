/** 
 *  file-name  : csv_to_json.js
 *  Created at : 07/11/2018
 *  @author    : Shubham Singh <shubham.singh@ucertify.com>
 *  @version   : 1.0
 *  @detail    : converts and save data of csv file to json format
 *  Last updated by   : shubham singh <shubham.singh@ucertify.com>
 *  Last updated date : 07/11/2018
 */

/**
* include fs(file system), fast-csv(csv parser) and path(system path library) module.
*/
const fs = require('fs');
const csv = require('fast-csv');
const path = require('path');

/**
 * A function for converting json to csv format and save it into json file 
 * @param string $file It takes a string which containes a file location for reading csv file
*/
const csv_to_json = (file) => {
	//create a file stream
    const stream = fs.createReadStream(file);
    //declare a csv_chunks empty array that will store the csv files rows in array format.
    let csv_chunks = [];
    //declare a directory constant for getting the directory location of file.
    const directory = path.dirname(file);
    //declare a file_name constant for getting the file_name without extension.
    const file_name = path.basename(file).split('.')[0];

    /**
	 * A function for converting csv data(stored in csv_chunks araay) into json format
	 * and save it into json file 
	*/
    const toJson = () => {
    	let json = [];
    	const keys = csv_chunks.shift();

    	csv_chunks.forEach((rows) => {
    		let row_object = {};
    		rows.forEach((val, index)=>{
    			row_object[keys[index]] = val;
    		})
    		json.push(row_object);
    	});
    	json = JSON.stringify(json);

    	fs.writeFile(path.join(directory, file_name+".json"), json, (err)=>{
    		if(err) {
    			console.log('Oops!!! error occured while writing to file.');
    		}
    		console.log('Bravo!!! file converted successfully.');
    		console.log(path.join(__dirname, directory, file_name+".json"));
    	})
    }

    /**
	 * A function for reading and storing csv data into an array csv_chunks.
	*/
    const csvStream = csv()
        .on("data", function(data){
             csv_chunks.push(data);
        })
        .on("end", function(){
            toJson();
        }).on("error", function(err){
        	console.log('Please enter csv file.');
        });
    stream.pipe(csvStream);
}

//get csv file
const file_location = process.argv[2] 
//convert to and save into json format.
csv_to_json(file_location);