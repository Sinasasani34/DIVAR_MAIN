const isTrue = (value) => ["true", 1, true].includes(value);
const isFlase = (value) => ["false", 0, false].includes(value);

const removePropertyInObject = (torget = {}, propertys = []) => {
    for (const item of propertys) {
        delete torget[item];
    }
    return torget;
}

module.exports = {
    isTrue,
    isFlase,
    removePropertyInObject
}