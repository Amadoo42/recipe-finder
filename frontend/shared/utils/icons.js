import { SVG_NAMESPACE, SPRITE_NAMES_URL } from '/static/constants/icon-constants.js';

/**
 *  @summary Dynamically adds SVG icons to the page by injecting the appropriate <use> elements into the DOM for each icon instance.
 */
export async function addIcons() {

    // Names of the icons used in the page, mapped to their corresponding SVG file URLs
    const names = await fetchUsedSpriteNames();

    // Build the SVG sprite sheet and add it to the DOM
    await buildSprites(names);

    // Add icons
    for (const iconName in names) {
        const icons = document.querySelectorAll(`.${iconName}.icon`);
        icons.forEach(icon => injectUse(icon, iconName));
    }
}

/**
 *  @summary Fetches the names of SVG icons used in the page, mapped to their corresponding SVG file URLs.
 */
async function fetchUsedSpriteNames() {
    // Fetch the full list of sprite names and their corresponding SVG file URLs
    const fullJSON = await fetchAllSpriteNames();

    const usedJSON = {};

    for (const iconName in fullJSON) {
        const icons = document.querySelectorAll(`.${iconName}.icon`);
        if (icons.length > 0) { // If there are elements in the DOM that use this icon, add it to the usedJSON
            usedJSON[iconName] = fullJSON[iconName];
        }
    }
    return usedJSON;
}

/**
 *  @summary Fetches the full list of SVG sprite names and their corresponding file URLs.
 */
function fetchAllSpriteNames() {
    return fetch(SPRITE_NAMES_URL).then(res => res.json());
}

/**
 *  @summary Builds the SVG sprite sheet and adds it to the DOM.
 *  @params {Object} names - An object mapping icon names to their corresponding SVG file URLs. All names assumed to be valid and present in the DOM.
 */
async function buildSprites(names) {

    let SVGSprites = document.createElementNS(SVG_NAMESPACE, 'svg');
    SVGSprites.setAttribute('style', 'display: none;');

    for (const iconName in names) {
        const pathData = await fetchSpriteData(names[iconName]);
        const symbol = createSymbolElement(iconName, pathData);
        SVGSprites.appendChild(symbol);
    }
    console.log(SVGSprites.children);

    document.body.prepend(SVGSprites);
}

/**
 *  @summary Fetches the path data for a specific SVG sprite.
 *  @params {string} svgURL - The URL of the SVG file to fetch.
 *  @returns {Promise<string>} - A promise resolving to the path data.
 */
async function fetchSpriteData(svgURL) {
    // Raw file content
    const text = await fetch(svgURL).then(res => res.text());
    // Parse SVG content into HTML
    const parsed = new DOMParser().parseFromString(text, 'image/svg+xml');
    // Extract the "d" attribute of the "path" element, which contains the path data for the icon.
    const pathElement = parsed.querySelector('path');
    return pathElement.getAttribute('d');
}

/**
 *  @summary Creates an SVG symbol element for a specific icon.
 *  @params {string} iconName - The name of the icon.
 *  @params {string} pathData - The path data for the icon.
 *  @returns {Element} - The created SVG symbol element.
 */
function createSymbolElement(iconName, pathData) {
    const symbol = document.createElementNS(SVG_NAMESPACE, 'symbol');
    symbol.setAttribute('id', `icon-${iconName}`);
    symbol.setAttribute('viewBox', '0 0 640 640');

    const path = document.createElementNS(SVG_NAMESPACE, 'path');
    path.setAttribute('d', pathData);
    symbol.appendChild(path);
    return symbol;
}

/**
 *  @summary Injects the appropriate <use> elements into the given SVG element.
 *  @params {Element} SVGelement - The SVG element to which the icon should be added.
 *  @params {string} iconName - The name of the icon to inject.
 */
function injectUse(SVGelement, iconName) {
    const svg = document.createElementNS(SVG_NAMESPACE, 'svg');
    const use = document.createElementNS(SVG_NAMESPACE, 'use');
    use.setAttribute('href', `#icon-${iconName}`);

    svg.appendChild(use);
    SVGelement.appendChild(svg);
}