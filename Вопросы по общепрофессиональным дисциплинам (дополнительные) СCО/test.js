const fs = require("fs");
const path = require("path");
const cheerio = require("cheerio");

// Путь к папке с HTML файлами
const folderPath =
  "./Вопросы по общепрофессиональным дисциплинам (дополнительные) СCО";

const outputFolderPath = path.join(folderPath, "test");

// Создаем папку для сохранения, если она не существует
if (!fs.existsSync(outputFolderPath)) {
  fs.mkdirSync(outputFolderPath);
}

// Функция для извлечения div с классом 'content'
function extractContentDiv(filePath) {
  // Читаем содержимое файла
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      console.error(`Ошибка чтения файла ${filePath}: ${err}`);
      return;
    }

    // Загружаем содержимое в cheerio
    const $ = cheerio.load(data);

    // Находим div с классом 'content'
    const contentDiv = $(".content");

    // Проверяем, найден ли div
    if (contentDiv.length > 0) {
      const fileNameWithoutExt = path.basename(
        filePath,
        path.extname(filePath)
      );

      // Создаем новый HTML с только этим div
      const newHtml = `<!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Вопрос ${fileNameWithoutExt}</title>
      <link rel="stylesheet" href="../styles.css" />
  </head>
  <body>
   <div class="que multichoice immediatefeedback correct">
    <div class="content">
    ${contentDiv.html()}
    </div>
   </div>
  </body>
  </html>`;

      // Сохраняем новый файл в папке 'test' с тем же именем
      const newFilePath = path.join(outputFolderPath, path.basename(filePath));
      fs.writeFile(newFilePath, newHtml, (err) => {
        if (err) {
          console.error(`Ошибка записи файла ${newFilePath}: ${err}`);
        } else {
          console.log(`Извлечено в ${newFilePath}`);
        }
      });
    } else {
      console.log(`Div с классом 'content' не найден в ${filePath}`);
    }
  });
}

// Проходим по всем файлам в указанной папке
fs.readdir(folderPath, (err, files) => {
  if (err) {
    console.error(`Ошибка чтения директории: ${err}`);
    return;
  }

  files.forEach((file) => {
    if (path.extname(file) === ".html") {
      const filePath = path.join(folderPath, file);
      extractContentDiv(filePath);
    }
  });
});
