const fs = require('fs');
const path = require('path');
const marked = require('marked');

const contentDir = path.join(__dirname, '../posts');
const outputDir = path.join(__dirname, '../articles');
const templatePath = path.join(__dirname, '../templates', 'layout.html');

const template = fs.readFileSync(templatePath, 'utf8');

fs.readdirSync(contentDir).forEach(file => {
  if (path.extname(file) === '.md') {
    const markdown = fs.readFileSync(path.join(contentDir, file), 'utf8');
    const htmlContent = marked.parse(markdown);
    const finalHtml = template.replace('{{ content }}', htmlContent);
    const outputFileName = file.replace('.md', '.html');
    fs.writeFileSync(path.join(outputDir, outputFileName), finalHtml);
    console.log(`Generated ${outputFileName}`);
  }
});