const $ = (name, value, properties) => {
    const selfClosingElements = ["area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "param", "source", "track", "wbr"];

    if (selfClosingElements.includes(name)) {
        if (properties) {
            return (`<${name} ${properties.map((p) => ` ${p.k}="${p.v}" `)}/>`);
        } else if (!properties) {
            return (`<${name}/>`);
        }
    } else if (!selfClosingElements.includes(name)) {
        if (properties) {
            return (`<${name} ${properties.map((p) => ` ${p.k}="${p.v}" `)}>${value}<${name}/>`);
        } else if (!properties) {
            return (`<${name}>${value}<${name}/>`)
        }
    }
};

export const accountingMailMessage = () => {
    return (`
    <!doctype html>
    <html lang="en">
    <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    </head>
        <body>
        <main>
        ${$('div', $('p', 'Uspešno, Hvala Vam na interesovanju za artikle iz naše prodavnice "AlexIT".<br/>Vaša narudžbina je primljena i biće obrađena u što kraćem roku'))}
        ${$('div', $('p', 'Ukoliko imate bilo kakvih pitanja odgovorite na ovaj email'))}
        ${$('div', $('p', `Powered by ${$('a', 'AlexIT', [{ k: "href", v: "http://localhost:4200/" }])}`))}
        <main/>
        </body>
    </html>
    `);
}