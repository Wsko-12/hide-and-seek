module.exports.get = function(type, x) {
    if (type === undefined) {
      type = 'u'
    }
    if (x === undefined) {
      x = 5;
    }
    let letters = 'AaBbCcDdEeFfGgHhIiJjKkLlMmNnPpQqRrSsTtUuVvWwXxYyZz';
  
    let numbers = '0123456789';
    let lettersMix, numbersMix;
    for (let i = 0; i < 10; i++) {
      lettersMix += letters;
      numbersMix += numbers;
    }
  
    let mainArr = lettersMix.split('').concat(numbersMix.split(''));
    let shuffledArr = mainArr.sort(function() {
      return Math.random() - 0.5;
    });
    let id = type + '_';
    for (let i = 0; i <= x; i++) {
      id += shuffledArr[i];
    };
    return id;
};
