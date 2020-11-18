"use strict";

let promise;
// async function f(){
//     return await Promise.all([new Promise(function(resolve, reject) {
//     setTimeout(() => resolve("done!"), 1000);
    
//   })]);
  
// }


let results = await Promise.all([new Promise(function(resolve, reject) {
    setTimeout(() => resolve("done!"), 1000);
    
  })]);
  
  // resolve запустит первую функцию, переданную в .then

//   f().then(
//     result => console.log(result), // выведет "done!" через одну секунду
//     error => console.log(error) // не будет запущена
//   );
console.log (results);
  console.log("тест");