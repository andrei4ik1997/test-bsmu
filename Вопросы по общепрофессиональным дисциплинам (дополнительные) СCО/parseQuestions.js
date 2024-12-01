const fs = require("fs");
const path = require("path");
const cheerio = require("cheerio");

// Путь к директории с HTML-файлами
const directoryPath = "./questions";

// Функция для парсинга HTML файлов
const parseHtmlFiles = async () => {
  const files = fs.readdirSync(directoryPath);
  const results = [];

  for (const file of files) {
    if (path.extname(file) === ".html") {
      const filePath = path.join(directoryPath, file);
      const content = fs.readFileSync(filePath, "utf-8");
      const $ = cheerio.load(content);

      const question = $(".qtext")
        .text()
        .trim()
        .replaceAll("\n", " ")
        .replace(/\s+/g, " ");

      const rightAnswerString = $(".rightanswer").text().trim();

      let rightAnswer = rightAnswerString
        .replaceAll("\n", " ")
        .replace(/\s+/g, " ");

      if (rightAnswer.includes("Правильные ответы:")) {
        rightAnswer = rightAnswer.replace("Правильные ответы:", "").trim();
      }

      if (rightAnswer.includes("Правильный ответ:")) {
        rightAnswer = rightAnswer.replace("Правильный ответ:", "").trim();
      }

      const answers = [];

      $('.answer div[data-region="answer-label"]').each((i, elem) => {
        const answerText = $(elem)
          .find("div")
          .text()
          .trim()
          .replaceAll("\n", " ")
          .replace(/\s+/g, " ");

        if (answerText) {
          answers.push({
            id: i,
            value: answerText,
            isCorrect: rightAnswer.includes(answerText),
          });
        }
      });

      results.push({
        id: Number(path.basename(file, ".html")),
        question,
        answers,
        isMultiple: rightAnswerString.includes("Правильные ответы:"),
        rightAnswer: rightAnswer,
      });
    }
  }

  // Формируем содержимое для JS файла
  const jsContent = `const questions = ${JSON.stringify(
    results.sort((a, b) => a.id - b.id),
    null,
    2
  )};`;

  // Запись в JS файл
  fs.writeFileSync("questions.js", jsContent);
};

// Запуск функции
parseHtmlFiles();
