const { Translate } = require("@google-cloud/translate").v2;
const config = require('../config');

// const translate = new Translate({
//     projectId: config.googleTranslate.projectId,
//     key: config.googleTranslate.key,
// });

// async function gt(text, ln = "hi") {
//     try {
//         const [translation] = await translate.translate(text, ln);
//         return translation;
//     } catch (err) {
//         return text || '';
//     }
// }



// module.exports.translateObject = async function (data){
//     return new Promise(function(resolve, reject){
//         tr(data);
//         setTimeout(() => {
//             resolve(data);
//         }, 5000);
//     })
// }

// async function tr(obj) {

//     for (const [key, value] of Object.entries(obj)) {
//         if (typeof value === "object") {
//             tr(value);
//         } else {
//             obj[key] = await gt(value); //.split('').join(''));
//         }
//     }
// }

// module.exports.translateText = gt;