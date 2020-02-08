jsons = [{'a': '1'}, {'b': '1'}]

console.log(jsons)

xpto = jsons.reduce((total, value) => {
    return {...total, ...value}
});

console.log(xpto);