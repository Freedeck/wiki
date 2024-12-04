const fs = require('node:fs');
const path = require('node:path');

let dat = {
  block: false,
  variables: {},
};

const parseWMD = (line, index, lines) => {
  let out = line;
  if(line.includes('{{')) {
    dat['block'] = true;
    out = '';
  }
  if(dat['block']) {
    if(line.includes('}}')) {
      dat['block'] = false;
      out = '';
    } else {
      if(!line.includes('=')) return '';
      let variable = line.split('=')[0].trim();
      let value = line.split('=')[1].trim();
      dat['variables'][variable] = value;
      out = '';
    }
  }
  if(line.includes('{*')) {
    let variable = line.split('{*')[1].split(':')[0].trim();
    let friendlyNames = line.split('{*')[1].split(':')[1].split('@')[0].trim();
    let fnIterator = line.split('{*')[1].split('@')[1].split(':')[1].split(' as ')[0].trim();
    let iterator = line.split('{*')[1].split(':')[1].split('@')[1].split(' as ')[0].trim();
    let template = line.split('{*')[1].split(' as ')[1].split('*}')[0].trim();
    let list = dat['variables'][variable].split(',');
    let friendlyNameList = dat['variables'][friendlyNames].split(',');
    let listOut = '';
    list.forEach((item, index) => {
      let itemOut = template;
      itemOut = itemOut.replaceAll('{$'+iterator+'}', item);
      itemOut = itemOut.replaceAll('{$'+fnIterator+'}', friendlyNameList[index]);
      listOut += itemOut;
    });
    out = listOut;
  } else if(line.includes('{$')) {
    let variable = line.split('{$')[1].split('}')[0];
    if(dat['variables'][variable] != undefined)
    out = out.replace('{$'+variable+'}', dat['variables'][variable]);
  }
  let placeholderPattern = /<&freewiki:#([^ ]+) \/>/g;
  let match;
  while ((match = placeholderPattern.exec(out)) !== null) {
    let placeholder = match[0];
    let key = match[1];
    let replacement;
    console.log("# Generating template " + key);
    replacement = generateHtmlFor("templates/" + key, ".html");
    console.log("# Replaced template " + key);
    out = out.replace(placeholder, replacement);
  }
  return out;
}

const generateHtmlFor = (page, extension='.md', includeSections = false) => {
  const pathTo = path.resolve('media/' + page + extension);
  if(!fs.existsSync(pathTo)) return generateHtmlFor('templates/404', '.html')
  let file = fs.readFileSync(pathTo, 'utf8');
  let lines = file.split('\n');
  if(!page.includes("templates")) {
    dat.variables.CURRENTPAGE = page;
  }
  return generateHTML(lines, includeSections);
}

const minify = (html) => {
  return html.replace(/\s+/g, ' ').trim();
}

const generateHTML = (lines, includeSections = false) => {
  let out = '';
  lines.forEach((line, index) => {
    out += parseWMD(line, index, lines) + '\n';
  });

  // Handle sections if includeSections is true
  if (includeSections && dat['variables']['SECTIONS']) {
    let sections = dat['variables']['SECTIONS'].split(',');
    let sectionPages = dat['variables']['SECTION_PAGES'].split(';');
    let sectionTitles = dat['variables']['SECTION_TITLES'].split(';');
    let subSections = dat['variables']['SUBSECTIONS'] ? dat['variables']['SUBSECTIONS'].split(',') : [];
    let subSectionPages = dat['variables']['SUBSECTION_PAGES'] ? dat['variables']['SUBSECTION_PAGES'].split(';') : [];
    let subSectionTitles = dat['variables']['SUBSECTION_TITLES'] ? dat['variables']['SUBSECTION_TITLES'].split(';') : [];
    let sidebarContent = '';
    console.group("# Creating sidebar");
    sections.forEach((section, index) => {
      let pages = sectionPages[index].split(',');
      let titles = sectionTitles[index].split(',');
      sidebarContent += `<div class="section"><h2>${section}</h2><ul>`;
      console.log("% Pages: " + pages.join(", "));
      pages.forEach((page, pageIndex) => {
        sidebarContent += `<li><a href="/${page}">${titles[pageIndex]}</a>`;
        // Check if this page has sub-sections
        let subSectionIndex = subSections.indexOf(titles[pageIndex]);
        if (subSectionIndex !== -1) {
          let subPages = subSectionPages[subSectionIndex].split(',');
          let subTitles = subSectionTitles[subSectionIndex].split(',');
          sidebarContent += `<ul>`;
          subPages.forEach((subPage, subPageIndex) => {
            sidebarContent += `<li><a href="/${subPage}">${subTitles[subPageIndex]}</a></li>`;
          });
          sidebarContent += `</ul>`;
        }
        console.log("% Created sidebar page " + page);
        sidebarContent += `</li>`;
      });
      console.log("% Created sidebar");
      sidebarContent += `</ul></div>`;
    });
    console.log("% Replaced sidebar template");
    out = out.replace('<&freewiki:sidebar />', sidebarContent);
    console.groupEnd();
  }

  return out;
}

module.exports = {
  generateHtmlFor,
  generateHTML,
  parseWMD,
  minify
}