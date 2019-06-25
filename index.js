var makerjs = require('makerjs');
var fs = require('fs');

let obj = {};
let started = {};
let fontListLength;

var textFile = null,
  makeTextFile = function (text) {
    var data = new Blob([JSON.stringify(text, null, 4)], {type: 'text/plain'});

    // If we are replacing a previously generated file we need to
    // manually revoke the object URL to avoid memory leaks.
    if (textFile !== null) {
      window.URL.revokeObjectURL(textFile);
    }

    textFile = window.URL.createObjectURL(data);

    // returns a URL you can use as a href
    return textFile;
  };

function onDownloadClick() {
    console.log(Object.keys(obj).length, fontListLength);
    console.log(started);
    downloadObjectAsJson(obj);
}

function downloadObjectAsJson(exportObj){
    const start = document.getElementById('start-index').value;
    for (let i = 0; i < Object.keys(exportObj).length; i+=5) {
        const keys = Object.keys(exportObj).slice(i, i + 5);
        const _exportObj = keys.reduce((acc, key) => {
            acc[key] = exportObj[key];
            return acc;
        }, {});
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(_exportObj, null, 4));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href",     dataStr);
        downloadAnchorNode.setAttribute("download", `${start}-${i}-${i+5}.json`);
        document.body.appendChild(downloadAnchorNode); // required for firefox
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    }
  }

const DEFAULT_GOOGLE_FONT_VARIANT_FALLBACK_ORDER = [
    'regular',
  '500',
  '300',
  '600',
  '700',
  '200',
  '800',
  '900',
  '100',
  'italic',
];

const getDefaultVariant = googleFont => {
    const variantsMap = googleFont.variants
        ? googleFont.variants.reduce((map, variant) => {
            map[variant] = variant;
            return map;
        }, {})
        : {};
    for (const variant of DEFAULT_GOOGLE_FONT_VARIANT_FALLBACK_ORDER) {
        if (variantsMap[variant]) return variant;
    }
    return googleFont.variants ? googleFont.variants[0] : '';
};

const weights = {
    100: "Thin",
    200: "Extra-light",
    300: "Light",
    400: "Regular",
    500: "Medium",
    600: "Semi-bold",
    700: "Bold",
    800: "Extra-bold",
    900: "Black",
};

const formatVariant = variant => {
    const weight = parseInt(variant, 10) || 400;
    let variantText = weights[`${weight}`];
    if (~variant.indexOf('italic')) {
        variantText += ' italic';
    }
    return variantText;
};

function getSvg(font, text, container) {
    var textModel = new makerjs.models.Text(font, text, 16, false, false);
    var svgText = makerjs.exporter.toSVG(textModel);
    var div = document.createElement('div');
    div.innerHTML = svgText.trim();  
    const svgElement = div.firstChild;
    svgElement.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    svgElement.setAttribute('xmlns:xlink', 'http://www.w3.org/1999/xlink');
    const g = svgElement.getElementById('svgGroup');
    g.setAttribute('fill', '#33475b');
    g.setAttribute('stroke', '#33475b');
    g.setAttribute('stroke-width', '0.1mm');
    g.style.fill = '#33475b';
    g.style.stroke = '#33475b';
    g.style.strokeWidth = '0.1mm';
    // g.removeAttribute('stroke');
    // g.removeAttribute('stroke-linecap');
    container.appendChild(svgElement);
    return svgElement;
}

let counter = 0;

function onGenerateClick() {
    var xhr = new XMLHttpRequest();
    xhr.open('get', 'https://www.googleapis.com/webfonts/v1/webfonts?key=AIzaSyC8hEjn7ZY29XMVVnXHDFlhkA8HcQZ8Wd0', true);
    xhr.onloadend = function () {
        counter = 0;
        obj = {};
        started = {};
        document.getElementById('download-button').setAttribute('disabled', true);
        document.getElementById('output-svg').innerHTML = '';
        document.getElementById('loading-text').className = '';
        document.getElementById('done-text').className = 'hidden';
        const start = +document.getElementById('start-index').value;
        const end = +document.getElementById('end-index').value;
        let fontList = JSON.parse(xhr.responseText);
        fontList = fontList.items.slice(start, end);
        fontListLength = fontList.length;
        fontList.forEach((f, index) => {
            obj[f.family] = {};
            started[f.family] = true;
            var defaultVariant = getDefaultVariant(f);
            const div = document.createElement('div');
            const label = document.createElement('span');
            label.innerHTML = f.family;
            div.appendChild(label);
            f.variants.forEach((v, vIndex) => {
                var url = f.files[v];
                opentype.load(url, function (err, font) {
                    if (font) {
                        const text = formatVariant(v) || f.family;
                        const variantSvgElement = getSvg(font, text, div);
                        obj[f.family][v] = variantSvgElement.outerHTML;
                        if (v === defaultVariant) {
                            const mainSvgElement = getSvg(font, f.family, div);
                            obj[f.family].main = mainSvgElement.outerHTML;
                        }
                        if (Object.keys(obj[f.family]).length === f.variants.length + 1) {
                            document.getElementById('output-svg').appendChild(div);
                            delete started[f.family];
                            counter += 1;
                            if (counter === fontListLength) {
                                document.getElementById('loading-text').className = 'hidden';
                                document.getElementById('done-text').className = '';
                                document.getElementById('download-button').removeAttribute('disabled');
                                console.log('done!');
                            }
                        }
                        console.log('added', f.family, v);
                    } else {
                        console.log(f.family, err);
                    }
                });
            });
        });
    };
    xhr.send();
}
