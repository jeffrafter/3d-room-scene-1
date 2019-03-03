const data = [
  [12, 948],
  [11, 941],
  [10, 933],
  [9, 922],
  [8, 911],
  [7, 894],
  [6, 870],
  [5, 840],
  [4, 729],
  [3, 712],
  [2, 543]
];

const zReadingToFeet = zReading => {
  let upper, indexOfUpper, lower, indexOfLower;
  console.log(zReading);

  if (zReading <= 543) return 0;

  // first, correct for high or low readings
  if (zReading > data[0][1]) {
    zReading = data[0][1];
  }
  if (zReading < data[data.length - 1][1]) {
    zReading = data[data.length - 1][1];
  }

  // then, find upper and lower bounds
  data.forEach((mapping, i) => {
    const z = mapping[1];

    if (zReading <= z) {
      upper = z;
      indexOfUpper = i;
    } else {
      if (!lower) {
        lower = z;
        indexOfLower = i;
      }
    }
  });

  // then figure out where on the line between the 2 numbers we should be
  const range = upper - lower;
  const placeOnRange = zReading - lower;
  // this becasue we do every 1 foot, but would change if we measured different "step" intervals
  const stepSize = 1;
  // the place between upper and lower that this reading sits, mapped to feet
  const scaledPlace = (stepSize * placeOnRange) / range;

  const lowerFeet = data[indexOfLower][0];

  return lowerFeet + scaledPlace;

  // EXAMPLE
  // upper is 948, lower is 941, actual is 943
  //
  // range =  upper - lower // 7
  //
  // placeOnRange = actual - lower // 2
  //
  // scale = 2 / 7
  //
  // value = lowerX + scale = 11 + 2/7
};

// const reading1 = 943
// console.log(zReadingToFeet(reading1))
//
// const reading2 = 600
// console.log(zReadingToFeet(reading2))

module.exports = zReadingToFeet;
