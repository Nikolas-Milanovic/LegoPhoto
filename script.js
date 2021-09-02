// Plan 
// 1) get the color of the pixels 
// 2) next, get the average color 
// 3) thrid, get the Lego color thats closest to the avrg color
// 4) display the the lego 1 by 1 platte in the browser
// 5) provide instructions

document.getElementById("input_img").onload = function() {
    var c = document.getElementById("myCanvas");
    var ctx = c.getContext("2d");
    var img = document.getElementById("input_img");
    ctx.drawImage(img, 0, 0);
    
    var rgb = {r:0,g:0,b:0};
    //var scale=1;
    var height = img.naturalHeight || img.offsetHeight || img.height;
    var width = img.naturalWidth || img.offsetWidth || img.width;
    var imgData=ctx.getImageData(0, 0, c.width, c.height);
    
    var rgb_pixels = new  Array(height);
    
    //create 2D array [length][width]
    //(0,0)............(0,width)
    // .                 .
    // .                 .
    // .                 .
    //(length,0).......(length,width)
    for(var i=0; i < rgb_pixels.length; i++){
        rgb_pixels[i] = new Array(width);
    }

    //get rgb from imgData object and input it into a user friendly 2D array
    var i=0;
    for(var x=0; x < height; x++){
        for(var y=0; y < width; y++){
            rgb.r = imgData.data[i];
            rgb.g = imgData.data[i+1];
            rgb.b = imgData.data[i+2];
            console.log(rgb);
            rgb_pixels[x][y]=rgb;
            i+=4;
        }
    }
    
    console.log("testing output");
    console.log(rgb_pixels[500][500]);
    console.log(getAvrg(32,500,500,rgb_pixels));

    //ctx.putImageData(imgData, 0, 0);


  };


  function getAvrg(scale,x,y,rgb_pixels){
    var rgb = {r:0,g:0,b:0};
    
    for(var i=0;i<scale;i++){
      for(var j=0;j<scale;j++){
        rgb.r+=rgb_pixels[x+i][y+j].r;
        rgb.g+=rgb_pixels[x+i][y+j].g;
        rgb.b+=rgb_pixels[x+i][y+j].b;
      }
    }

    var count=scale*scale;
    rgb.r = ~~(rgb.r/count);
    rgb.g = ~~(rgb.g/count);
    rgb.b = ~~(rgb.b/count);

    return rgb;
  }



