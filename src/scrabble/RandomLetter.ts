// Values from http://www.nymphomath.ch/crypto/stat/francais.html
const LETTERS_FREQUENCIES: { [key: string]: number } = {
    A: 8.41,
    B: 1.06,
    C: 3.03,
    D: 4.18,
    E: 17.27,
    F: 1.12,
    G: 1.27,
    H: 0.92,
    I: 7.34,
    J: 0.31,
    K: 0.05,
    L: 6.01,
    M: 2.96,
    N: 7.13,
    O: 5.26,
    P: 3.01,
    Q: 0.99,
    R: 6.55,
    S: 8.09,
    T: 7.07,
    U: 5.74,
    V: 1.32,
    W: 0.04,
    X: 0.45,
    Y: 0.30,
    Z: 0.12,
};
const SET = buildFrequenciesSet(LETTERS_FREQUENCIES);

export default function (): string {
    const random = Math.random() * 100;
    return SET.find(item => random < item[1])[0];
}

function buildFrequenciesSet(frequencies: { [key: string]: number }) {
    let acc = 0;
    const set: [string, number][] = [];
    Object.keys(frequencies).forEach(letter => {
        const freq = frequencies[letter];
        set.push([letter, acc = acc + freq]);
    });
    if (set[set.length - 1][1] !== 100) throw 'Set is not normalized!';
    return set;
}
