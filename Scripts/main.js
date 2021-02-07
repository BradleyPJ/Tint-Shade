

let rgbArray = [];

const componentToHex = (c) => {
  const hex = c.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}

const rgbToHex = (r, g, b) => {
  return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

const hexToRgb = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

const getTint = (color, factor) => {
  return Math.round(color + (255 - color) * 1 * factor);
};

const getShade = (color, factor) => {
  return Math.round(color * factor);
};

const getRGB = (colorObject) => {
  //Get RGB value from Hex
  const color = hexToRgb(colorObject);
  rgbArray = [];

  let j = 0;

  //Loop through rgb values multiplying them to get shades or tints
  for (let i = 0; i <= 1; i += 0.1) {
    j = Math.round(j * 10) / 10;
    const rgb = {
      tint: {
        r: getTint(color.r, j),
        g: getTint(color.g, j),
        b: getTint(color.b, j),
        hex: function () {
          return rgbToHex(this.r, this.g, this.b);
        }
      },
      shade: {
        r: getShade(color.r, j),
        g: getShade(color.g, j),
        b: getShade(color.b, j),
        hex: function () {
          return rgbToHex(this.r, this.g, this.b);
        }
      }
    }

    rgbArray.push(rgb);

    j += 0.1;

  }
  createTable()
}

const createTable = () => {

  document.querySelector('#color-hex-tints').innerHTML = ""
  document.querySelector('#tints').innerHTML = ""
  document.querySelector('#shades').innerHTML = ""
  document.querySelector('#color-hex-shades').innerHTML = ""

  for (let i = 0; i <= rgbArray.length - 1; i += 1) {
    const colorBlockTints = `<td class='colorBlock' style = 'background-color:${rgbArray[i].tint.hex()};' data-clipboard-text='${rgbArray[i].tint.hex()}'></td>  `;
    document.querySelector('#tints').insertAdjacentHTML('beforeend', colorBlockTints);

    const colorHexTints = `<td class='hex-value'>${rgbArray[i].tint.hex()}</td>  `;
    document.querySelector('#color-hex-tints').insertAdjacentHTML('beforeend', colorHexTints);

    const colorBlockShades = `<td  class='colorBlock' style = 'background-color:${rgbArray[10 - i].shade.hex()};'  data-clipboard-text='${rgbArray[10 - i].shade.hex()}' > </td > `;
    document.querySelector('#shades').insertAdjacentHTML('beforeend', colorBlockShades);

    const colorHexShades = `<td class='hex-value' '>${rgbArray[10 - i].shade.hex()}</td>  `;
    document.querySelector('#color-hex-shades').insertAdjacentHTML('beforeend', colorHexShades);
  }
}

document.getElementById('submit').addEventListener('click', () => {
  const input = document.getElementById('hexInput').value;
  return getRGB(input);
});

document.getElementById('get-color').addEventListener('click', () => {
  return getRGB(randomHex());;
});

const randomHex = () => { return "#000000".replace(/0/g, function () { return (~~(Math.random() * 16)).toString(16); }); }
getRGB(randomHex());
