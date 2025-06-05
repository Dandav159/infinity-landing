const fs = require("fs");
const path = require("path");

const articlesDir = path.join(__dirname, "../articles");

function formatTitle(filename) {
  return filename
    .replace(".html", "")
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, c => c.toUpperCase()); // capitalize each word
}

function generateNavHtml(fileNames) {
  const links = fileNames
    .filter(f => f.endsWith(".html"))
    .map(f => `<a href="${f}">${formatTitle(f)}</a>`)
    .join(" | ");
  return `<nav class="nav">${links}</nav>`;
}

function injectNavIntoFiles() {
  const files = fs.readdirSync(articlesDir);
  const navHtml = generateNavHtml(files);

  files.forEach(file => {
    if (!file.endsWith(".html")) return;

    const filePath = path.join(articlesDir, file);
    let content = fs.readFileSync(filePath, "utf8");

    // Replace any existing <nav class="nav">...</nav>
    content = content.replace(/<nav class="nav">[\s\S]*?<\/nav>/, "");

    // Insert nav before </body>
    content = content.replace(
      /<\/body>/,
      `${navHtml}\n</body>`
    );

    fs.writeFileSync(filePath, content, "utf8");
    console.log(`✅ Updated ${file}`);
  });
}

injectNavIntoFiles();
