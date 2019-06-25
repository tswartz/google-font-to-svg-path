const fs = require('fs');

const dir = fs.readdirSync('json');
const wholeObj = {};

dir.forEach((file) => {
  if (!file.match('json')) {
    return;
  }
  const data = fs.readFileSync(`json/${file}`);
  const rawData = data && data.toString();
  const parsedData = JSON.parse(rawData || "{}");
  const keys = Object.keys(parsedData);
  console.log(file, keys.length);
  keys.forEach(_key => {
    if (wholeObj[_key]) {
      console.log('duplicate key in', file, '-', _key);
      return;
    }
    wholeObj[_key] = true;
  });
  // fs.readFile(`json/${file}`, (err, data) => { 
  //   try {
  //     const rawData = data && data.toString();
  //     const parsedData = JSON.parse(rawData || "{}");
  //     const keys = Object.keys(parsedData);
  //     console.log(file, keys.length);
  //   } catch (e) {
  //       console.log(e);
  //   }
  // });
  // let subDir;
  // try {
  //   subDir = fs.readdirSync(`json/${_dir}`);
  // } catch {
  //   return;
  // }
  // let wholeObj = {};
  // let counter = 0;
  // subDir.forEach((file, index) => {
  //   if (!file.match('json')) {
  //     return;
  //   }
  //   fs.readFile(`json/${_dir}/${file}`, (err, data) => { 
  //     try {
  //       const rawData = data && data.toString();
  //       const parsedData = JSON.parse(rawData || "{}");
  //       wholeObj = {
  //         ...wholeObj,
  //         ...parsedData,
  //       };
  //       fs.writeFile(`json/${_dir}.json`, JSON.stringify(wholeObj, null, 4), (err) => {
  //         if (err) throw error;
  //         counter += 1;
  //         if (counter === dir.length - 1) {
  //           fs.readFile(`json/${_dir}.json`, (err, data) => { 
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
});

// fs.readFile(`result.json`, (err, data) => { 
//   try {
//     const rawData = data && data.toString();
//     const parsedData = JSON.parse(rawData || "{}");
//     console.log('done:',  Object.keys(parsedData).length);
//   } catch (e) {
//       console.log(e);
//   }
// });
