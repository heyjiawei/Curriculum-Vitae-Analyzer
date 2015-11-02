//find the keyword with the particular name in an array
//if not found, returns an empty keyword
function findKeyWord(keyWordArray, nameToFind) {
   for (var i = 0; i < keyWordArray.length; i++) {
       var keyWord = keyWordArray[i];
       if (keyWord.name === nameToFind) {
           return keyWordArray.splice(i, 1);
       }
   }
    //not found
    return new Keyword();
}
