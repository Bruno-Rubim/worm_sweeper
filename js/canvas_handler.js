export const canvasElement = document.querySelector('canvas');
export const ctx = canvasElement.getContext('2d');
export let renderScale;
export const scaleMultiplyer = 1

let sizeConfig = {
    originalWidth: 160,
    originalHeight: 160,
}

export function clearCanvas(){
    ctx.clearRect(0, 0, canvasElement.width, canvasElement.height);
}

export const updateCanvas = () => {
    let scale = 0
    if (innerWidth > innerHeight) {
        scale = Math.floor(innerHeight / sizeConfig.originalHeight)
    } else {
        scale = Math.floor(innerWidth / sizeConfig.originalWidth)
    }
    sizeConfig.width = scale * sizeConfig.originalWidth
    sizeConfig.height = scale * sizeConfig.originalHeight

    renderScale = scale * scaleMultiplyer;
    ctx.imageSmoothingEnabled = false

    canvasElement.style.left = Math.floor((innerWidth - sizeConfig.width) / 2) + 'px';
    canvasElement.style.top = Math.floor((innerHeight - sizeConfig.height) / 2) + 'px';
    canvasElement.width = sizeConfig.width;
    canvasElement.height = sizeConfig.height;
    canvasElement.style.position = 'absolute'
    ctx.imageSmoothingEnabled = false
}