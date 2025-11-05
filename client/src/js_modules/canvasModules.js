export function setCTX(canvasData,pixelSize,ctx){
  for(let y=0;canvasData[0].length>y;y++){
      for(let x=0;canvasData.length>x;x++){
        ctx.fillStyle = colorCompatible[canvasData[y][x]] ?? "#000000ff";
        ctx.fillRect(x*pixelSize,y*pixelSize,pixelSize,pixelSize);
      }
  }
}
export function updeteCTX(posData,pixelSize,ctx){
  ctx.fillStyle = colorCompatible[posData.color] ?? "#000000ff";
  ctx.fillRect(posData.x*pixelSize,posData.y*pixelSize,pixelSize,pixelSize);
}
const colorCompatible = {
  1: "black",
  2: "maroon",
  3: "green",
  4: "olive",
  5: "navy",
  6: "purple",
  7: "teal",
  8: "silver",
  9: "gray",
  10: "red",
  11: "lime",
  12: "yellow",
  13: "blue",
  14: "fuchsia",
  15: "aqua",
  16: "white",
};
export default colorCompatible