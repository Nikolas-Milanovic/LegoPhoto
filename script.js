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
    var imgData=ctx.getImageData(0, 0, c.width, c.height);

    var scale=40;
    var height = img.naturalHeight || img.offsetHeight || img.height;
    var width = img.naturalWidth || img.offsetWidth || img.width;
    
    var rgb_pixels = new Array(height);
    
    //create 2D array [height][width]
    for(var i=0; i < rgb_pixels.length; i++){
        rgb_pixels[i] = new Array(width);
    }

    //get rgb from imgData object and input it into a user friendly 2D array
    var i=0;
    for(var x=0; x < height; x++){
        for(var y=0; y < width; y++){
            //console.log(imgData.data[i]+" "+imgData.data[i+1]+" "+imgData.data[i+2]);
            var rgb = {r:0,g:0,b:0};
            rgb.r = imgData.data[i];
            rgb.g = imgData.data[i+1];
            rgb.b = imgData.data[i+2];
            rgb_pixels[x][y]=rgb;
            i+=4;
        }
    }

    height=scale*(~~(height/scale));
    width=scale*(~~(width/scale));
    console.log(height+" "+width);
    console.log(rgb_pixels.length);
    console.log(rgb_pixels[rgb_pixels.length-1].length);
    console.log(rgb_pixels[height-1][width-1]);


    //get the average color of the pixels and paint that color onto the canvas
    for(var row=0; row < height; row+=scale){
      for(var col=0; col < width; col+=scale){
        //console.log("row:"+row+"col:"+col);
        var rgb=getAvrg(scale,row,col,rgb_pixels);
        var col_hex_string=RGBToHex(rgb.r,rgb.g,rgb.b);
        ctx.fillStyle = col_hex_string;
        ctx.fillRect(col,row,scale,scale);
        //console.log(col_hex_string);
        
      }
    }


    console.log("i value: "+i);
    console.log("testing output");
    console.log(rgb_pixels[500][500]);
    console.log(getAvrg(scale,500,500,rgb_pixels));
    console.log(rgb_pixels[0][0]);


    //ctx.fillStyle = "rgb(0,0,0)";
    //ctx.fillStyle = "#FF0000";
    ctx.fillStyle = "green";

    //ctx.fillStyle="rgba(254,0,0,0.5)";

    ctx.fillRect(100, 0, scale, scale);

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

  function RGBToHex(r,g,b) {
    r = r.toString(16);
    g = g.toString(16);
    b = b.toString(16);
  
    if (r.length == 1)
      r = "0" + r;
    if (g.length == 1)
      g = "0" + g;
    if (b.length == 1)
      b = "0" + b;
  
    return "#" + r + g + b;
  }





