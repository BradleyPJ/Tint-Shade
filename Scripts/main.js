import ClipboardJS from 'clipboard';
import '../Styles/global.css';

new ClipboardJS('.colorBlock');

let rgbArray = [];
let hashState = true;

const checkHex = (input) => {
  //checks if 6 hex
  const regHex = /^#[0-9A-F]{6}$/i;
  return regHex.test(input);
}

const componentToHex = (c) => {
  const hex = c.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
};

const rgbToHex = (r, g, b, hash) => {
  if (hash == false || hash == "false") {
    return componentToHex(r) + componentToHex(g) + componentToHex(b);
  } else {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
  }
};

const hexToRgb = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16),
    }
    : null;
};

const getTint = (color, factor) => {
  return Math.round(color + (255 - color) * 1 * factor);
};

const getShade = (color, factor) => {
  return Math.round(color * factor);
};

const getRGB = (colorObject) => {
  //Get RGB value from Hex
  const color = hexToRgb(colorObject);
  let rgbInternalArray = [];

  let j = 0;

  //Loop through rgb values multiplying them to get shades or tints
  for (let i = 0; i <= 1; i += 0.1) {
    j = Math.round(j * 10) / 10;
    const rgb = {
      tint: {
        r: getTint(color.r, j),
        g: getTint(color.g, j),
        b: getTint(color.b, j),
        hex: function (hash) {
          return rgbToHex(this.r, this.g, this.b, hash);
        }
      },
      shade: {
        r: getShade(color.r, j),
        g: getShade(color.g, j),
        b: getShade(color.b, j),
        hex: function (hash) {
          return rgbToHex(this.r, this.g, this.b, hash);
        }
      },
    };

    rgbInternalArray.push(rgb);
    j += 0.1;
  }
  rgbArray.push(rgbInternalArray);
  createTable();
};

const createTable = () => {
  setTable();
  for (let i = 0; i <= rgbArray.length - 1; i += 1) {
    document.getElementById("color-content").insertRow(-1).id = `tints-${i + 1
      }`;
    document.getElementById("color-content").insertRow(-1).id = `tints-values-${i + 1
      }`;
    document.getElementById("color-content").insertRow(-1).id = `shades-${i + 1
      }`;
    document
      .getElementById("color-content")
      .insertRow(-1).id = `shades-values-${i + 1}`;
  }

  for (let j = 0; j <= rgbArray.length - 1; j += 1) {
    for (let i = 0; i <= rgbArray[j].length - 1; i += 1) {
      const colorBlockTints = `<td class='colorBlock' style = 'background-color:${rgbArray[j][i].tint.hex()};' data-clipboard-text='${rgbArray[j][i].tint.hex(hashState)}'></td>  `;
      document
        .querySelector(`#tints-${j + 1}`)
        .insertAdjacentHTML("beforeend", colorBlockTints);

      const colorHexTints = `<td class='hex-value'>${rgbArray[j][i].tint.hex(hashState)}</td>  `;
      document
        .querySelector(`#tints-values-${j + 1}`)
        .insertAdjacentHTML("beforeend", colorHexTints);

      const colorBlockShades = `<td  class='colorBlock' style = 'background-color:${rgbArray[j][10 - i].shade.hex()
        };'  data-clipboard-text='${rgbArray[j][10 - i].shade.hex(hashState)}' > </td > `;
      document
        .querySelector(`#shades-${j + 1}`)
        .insertAdjacentHTML("beforeend", colorBlockShades);

      const colorHexShades = `<td class='hex-value' '>${rgbArray[j][10 - i].shade.hex(hashState)
        }</td>  `;
      document
        .querySelector(`#shades-values-${j + 1}`)
        .insertAdjacentHTML("beforeend", colorHexShades);
    }
  }
};

const setTable = () => {
  document.getElementById("color-content").innerHTML =
    "<tr id = 'percentage-display'><tr>";
  for (let i = 0; i <= 110 - 1; i += 10) {
    const colorPercentage = `<td class = "color-perc"><span>${i}%</span></td>`;
    document
      .querySelector("#percentage-display")
      .insertAdjacentHTML("beforeend", colorPercentage);
  }
};

document.getElementById("submit").addEventListener("click", () => {
  rgbArray = [];
  const input = document.getElementById("hexInput").value.split(" ");
  // Remove all any input values from the array if they are not hex colors
  input.forEach((i) => {
    if (checkHex(i) === false) {
      let index = input.indexOf(i)
      if (index > -1) {
        input.splice(index, 1)
      }
    }
  });
  (Object.keys(input).length === 0) ? alert("Please enter a valid hex code") : console.log(`${input.length} : false`)
  localStorage.setItem("colors", JSON.stringify(input));
  input.forEach((i) => {
    getRGB(i);
  });
});

document.getElementById("get-color").addEventListener("click", () => {
  rgbArray = [];
  return getRGB(randomHex());
});

document.getElementById("includeHash").addEventListener("change", () => {
  if (document.getElementById("includeHash").checked) {
    hashState = false
    localStorage.setItem("hashState", hashState);
    loadSavedColor();
  } else {
    hashState = true
    localStorage.setItem("hashState", hashState);
    loadSavedColor();
  }
});

const randomHex = () => {
  return "#000000".replace(/0/g, function () {
    return (~~(Math.random() * 16)).toString(16);
  });
};

const loadSavedColor = () => {
  let savedColor = [];
  (JSON.parse(localStorage.getItem("colors"))) ? savedColor = JSON.parse(localStorage.getItem("colors")) : "Boop"
  rgbArray = [];
  (Object.keys(savedColor).length === 0) ? getRGB(randomHex()) : () => {
    savedColor.forEach((i) => {
      getRGB(i);
    })
  }
  savedColor.forEach((i) => {
    getRGB(i);
  })
};

hashState = localStorage.getItem("hashState");

if (localStorage.getItem("hashState") == false) {
  document.getElementById("includeHash").checked = true
}
loadSavedColor();
