import DataUriParser from "datauri/parser.js"

import path from "path";

const getDataUri = (file) => {
    const parser = new DataUriParser();
    const extName = path.extname(file.originalname).toString();
    return parser.format(extName, file.buffer);
}

export default getDataUri;


// import DatauriParser from 'datauri/parser';
// import path from 'path';

// const getDataUri = (file) => {
//     const parser = new DatauriParser();
//     return parser.format(path.extname(file.originalname).toString(), file.buffer);
// };

// export default getDataUri;
