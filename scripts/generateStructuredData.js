const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

const targetDir = path.join(__dirname, '../articles');

function getHtmlFiles(dir) {
  let files = [];
  fs.readdirSync(dir).forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      files = files.concat(getHtmlFiles(fullPath));
    } else if (file.endsWith('.html')) {
      files.push(fullPath);
    }
  });
  return files;
}

function processHtmlFile(filePath) {
  const html = fs.readFileSync(filePath, 'utf8');
  const $ = cheerio.load(html);

  const faqs = [];
  $('h3').each((_, el) => {
    const question = $(el).text().trim();
    const answerParagraphs = [];
    let current = $(el).next();

    while (current.length && current[0].tagName !== 'h3' && current[0].tagName !== 'hr') {
      if (current[0].tagName === 'p') {
        answerParagraphs.push(current.text().trim());
      }
      current = current.next();
    }

    if (answerParagraphs.length) {
      faqs.push({
        "@type": "Question",
        "name": question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": answerParagraphs.join('\n\n')
        }
      });
    }
  });

  if (faqs.length === 0) return;

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs
  };

  // Remove old FAQPage blocks
  $('script[type="application/ld+json"]').each((_, script) => {
    const text = $(script).html();
    if (text.includes('"@type": "FAQPage"')) {
      $(script).remove();
    }
  });

  // Inject the new script
  $('head').append(`
    <script type="application/ld+json">
${JSON.stringify(structuredData, null, 2)}
    </script>
  `);

  fs.writeFileSync(filePath, $.html(), 'utf8');
  console.log(`✅ Injected FAQ schema into: ${filePath}`);
}

const htmlFiles = getHtmlFiles(targetDir);
htmlFiles.forEach(processHtmlFile);
