const express = require('express');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const docxConverter = require('docx-pdf');
const app = express();
require('dotenv').config();
const port = process.env.PORT || 3001;

app.use(express.json());

// Enable CORS
app.use(cors());
// Serve static files from the 'uploads' directory
app.use('/uploads', express.static('uploads'));


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads');
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

app.post('/convert', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  const inputFilePath = req.file.path;
  const outputFilePath = inputFilePath + '.pdf';

//   docxConverter(inputFilePath, outputFilePath, function (err, result) {
//     if (err) {
//       console.error(err);
//       return res.status(500).json({ error: 'Conversion failed' });
//     }

//     res.download(outputFilePath, 'output.pdf', (err) => {
//       if (err) {
//         console.error(err);
//         return res.status(500).json({ error: 'File download failed' });
//       }
//     });
//   });
// });
docxConverter(inputFilePath, outputFilePath, function (err, result) {
  if (err) {
    console.error('Conversion Error:', err);
    return res.status(500).json({ error: 'Conversion failed' });
  }

  res.download(outputFilePath, 'output.pdf', (err) => {
    if (err) {
      console.error('Download Error:', err);
      return res.status(500).json({ error: 'File download failed' });
    }
  });
});
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
