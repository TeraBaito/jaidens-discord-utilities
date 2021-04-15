class AutoResponder {
    /**
     * 
     * @param {string|RegExp} input The input text
     * @param {string} output The output text
     * @param {boolean} regexp Is it a RegExp or a normal string?
     */
    constructor(input, output) {
        this.input = input;
        this.output = output;
        this.regexp = input instanceof RegExp;
    }
}

const autoresponders = [
    new AutoResponder(/^a(\.)?$/, 'a.'),
    new AutoResponder('ari bot', 'hey thats me'),
    new AutoResponder('is jaiden here', 
        'Unfortunately, Jaiden is not on this server, nor does she own any public server.' +
        ' However, this is the largest non-official fan server on Discord and you\'re welcome to stay!'),
    new AutoResponder('is jaiden animations here', 
        'Unfortunately, Jaiden is not on this server, nor does she own any public server.' +
        ' However, this is the largest non-official fan server on Discord and you\'re welcome to stay!'),
    new AutoResponder('gm', 'gm'),
    new AutoResponder('gn', 'gn'),
    new AutoResponder('osu', 'osu: the best game')
];
module.exports = autoresponders;