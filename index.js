const { schedulingPolicy } = require('cluster');
const { group, count } = require('console');
const fs = require('fs');
const path = require('path');

//Variables
studentsArray = [];
topicsArray = [];
let studentsPath = path.join('content', process.argv[2]);
let topicsPath = path.join('content', process.argv[3]);
var groupQty = process.argv[4];
var result = [];

// Reading students file
try {
    var studentsFile = fs.readFileSync(studentsPath, 'utf-8').split('\n');

    studentsFile.forEach((value, index) => {
        studentsArray.push(studentsFile[index].replace("\r", ""));
        if (studentsArray[studentsArray.length - 1] == "") {
            studentsArray.pop();
        }
    })

} catch (err) {
    console.log(err + "The file you entered does not exist or were not found.");
}

// Reading topics file
try {
    var topicsFile = fs.readFileSync(topicsPath, 'utf-8').split('\n');

    topicsFile.forEach((value, index) => {
        topicsArray.push(topicsFile[index].replace("\r", ""));
        if (topicsArray[topicsArray.length - 1] == "") {
            topicsArray.pop();
        }
    })

} catch (err) {
    console.log(err + "The file you entered does not exist or were not found.");
}

// Shuffle arrays
function shuffle(array) {
    var tmp, current, top = array.length;
    if (top) while (--top) {

        current = Math.floor(Math.random() * (top + 1));
        tmp = array[current];
        array[current] = array[top];
        array[top] = tmp;
    }
    return array;
}

// Randomizing
studentsArray = shuffle(studentsArray);
topicsArray = shuffle(topicsArray);


//Getting students qty per group and the remainder of it
var numStudentsPerGroup = Math.floor(studentsArray.length/groupQty);
var studentRemainder = studentsArray.length%groupQty;

//Getting topics qty per group and the remainder of it
var numTopicsPerGroup = Math.floor(topicsArray.length/groupQty);
var topicsRemainder = studentsArray.length%groupQty;


if(studentsFile.length>=groupQty && topicsArray.length>=groupQty){


    //Organize groups by topics and students
for (let index = 0; index < groupQty; index++) {
    let studentCurrentIndex = 0;
    let topicsCurrentIndex = 0;
    let tempArr = [];
    let tempObj = {};

    while (groupQty>0){
        for (let index = studentCurrentIndex; index < studentCurrentIndex+numStudentsPerGroup; index++) {
            tempArr.push(studentsArray[index]);
        }
        tempObj.students = tempArr;
        tempArr = [];
        for (let index = topicsCurrentIndex; index < topicsCurrentIndex+numTopicsPerGroup; index++) {
            tempArr.push(topicsArray[index]);
        }
        tempObj.topics = tempArr;
        tempArr = [];

        result.push(tempObj);
        tempObj = {};
        studentCurrentIndex = studentCurrentIndex+numStudentsPerGroup;
        topicsCurrentIndex = topicsCurrentIndex+numTopicsPerGroup;
        groupQty--;
    }
    
}

// Organize Remainder
const RandomizeRemainder = (remainder, array, isTopic)=>{
    array = array.slice(array.length - array.length-remainder);

    result = shuffle(result);

    let counterArr1 = array.length-1;
    let counterArr2 = result.length-1;

    while(counterArr1>=0){
        if(counterArr2==0){
            counterArr2=result.length-1
        }else{
            if(isTopic){
                result[counterArr2].topics.push(array[counterArr1]);
            }else{
                result[counterArr2].students.push(array[counterArr1]);
            }
        counterArr1--,
        counterArr2--
        }
    }
}

if(studentRemainder){
    RandomizeRemainder(studentRemainder, studentsArray, false);
}
if(topicsRemainder){
    RandomizeRemainder(topicsRemainder, topicsArray, true);
}

for (let index = 0; index < result.length; index++) {
    console.log(`\nGroup ${index+1} (${result[index].students.length} Students, ${result[index].topics.length} Topic)`);
    console.log(`\n Students:`)

    for (let studentIndex = 0; studentIndex < result[index].students.length; studentIndex++) {
        console.log(`   ${result[index].students[studentIndex]}`);
        
    }
    console.log(`\n Topics:`)
    for (let topicIndex = 0; topicIndex < result[index].topics.length; topicIndex++) {
        console.log(`   ${result[index].topics[topicIndex]}`);
        
    }
}
}else{
    console.log(`The number of TOPICS must be equal or fewer than the number of STUDENTS and equal or more than the number of GROUPS. 
     Number of topics were: ${topicsArray.length} 
     Number of students were: ${studentsArray.length} 
     Number of groups were: ${groupQty}`)
}