const fs = require('fs');

let wholeObj = {};

// const dir = fs.readdirSync('json');
// let counter = 0;
// dir.forEach((file, index) => {
//   if (!file.match('json')) {
//     return;
//   }
//   fs.readFile(`json/${file}`, (err, data) => { 
//     try {
//       const rawData = data && data.toString();
//       const parsedData = JSON.parse(rawData || "{}");
//       wholeObj = {
//         ...wholeObj,
//         ...parsedData,
//       };
//       fs.writeFile('result.json', JSON.stringify(wholeObj, null, 4), (err) => {
//         if (err) throw error;
//         counter += 1;
//         if (counter === dir.length - 1) {
//           fs.readFile(`result.json`, (err, data) => { 
//             try {
//               const rawData = data && data.toString();
//               const parsedData = JSON.parse(rawData || "{}");
//               console.log('done:',  Object.keys(parsedData).length);
//             } catch (e) {
//                 console.log(e);
//             }
//           });
//         }
//       });
//     } catch (e) {
//         console.log(file, e);
//     }
//   });
// });

fs.readFile(`result.json`, (err, data) => { 
  try {
    const rawData = data && data.toString();
    const parsedData = JSON.parse(rawData || "{}");
    console.log('done:',  Object.keys(parsedData).length);
  } catch (e) {
      console.log(e);
  }
});
