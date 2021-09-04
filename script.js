// Plan 
// 1) get the color of the pixels DONE
// 2) next, get the average color DONE
// 3) thrid, get the Lego color thats closest to the avrg color 
// 4) display the the lego 1 by 1 platte in the browser DONE
// 5) provide instructions

//document.getElementById("input_img").onload = function() {
var c = document.createElement("canvas");

  function display_lego_photo(){
      
      console.log("generate_button clicked");
 
      var img= document.getElementById("dragged_img");

      var height = img.naturalHeight || img.offsetHeight || img.height;
      var width = img.naturalWidth || img.offsetWidth || img.width;

      c.width=width;
      c.height=height;
  
      var ctx = c.getContext("2d");
      ctx.drawImage(img,0,0);
      var imgData=ctx.getImageData(0, 0, width, height);

      var scale_input=""+document.getElementById("scale").value; //Scale represents how many pixels from the inputed_img will represent 1by1 lego plate. 
      //Example: scale = 10; Then scale*scale=10*10=100 pixels will be represented by the color of one 1by1 lego plate
      var scale=parseInt(scale_input);
      console.log("scale"+ scale);


      //create 2D array [height][width]
      var rgb_pixels = new Array(height);
      for(var i=0; i < rgb_pixels.length; i++){
          rgb_pixels[i] = new Array(width);
      }

      //Get rgb from imgData object and input it into a user friendly 2D array
      var i=0;
      for(var x=0; x < height; x++){
          for(var y=0; y < width; y++){
              var rgb = {r:0,g:0,b:0};
              rgb.r = imgData.data[i];
              rgb.g = imgData.data[i+1];
              rgb.b = imgData.data[i+2];
              rgb_pixels[x][y]=rgb;
              i+=4;
          }
      }
      
      //console.log(rgb_pixels[500][500]);
      //Height and Width must be rounded down appropiatelly to avoid out of bounds expection when calling the getAvrg() func
      height=scale*(~~(height/scale));
      width=scale*(~~(width/scale));
      console.log("h"+c.height);
      console.log("w"+c.width);

      var str_height=""+height;
      var str_width=""+width;

      c.setAttribute("width",str_width);
      c.setAttribute("height",height);
      
      //c.width=width;
      //c.height=height;

      console.log("h"+c.height);
      console.log("w"+c.width);

      ctx.beginPath();
      ctx.fillStyle = "white";
      ctx.fillRect(0,0,width,height);

      //Get the average color of the pixel blocks (sclae*scale) and paint that color onto the canvas
      for(var row=0; row < height; row+=scale){
        for(var col=0; col < width; col+=scale){

          //var rgb=getAvrg(scale,row,col,rgb_pixels);
          var rgb=getAvrg(scale,row,col,rgb_pixels);
          var col_hex_string=RGBToHex(rgb.r,rgb.g,rgb.b);
          
          //ctx.fillStyle = "#FFFFFF";
          //ctx.fillRect(col,row,scale,scale);

          ctx.beginPath();
          ctx.fillStyle = col_hex_string;
          ctx.arc(col+(scale/2),row+(scale/2), scale/2, 0, 2 * Math.PI);
          ctx.fill();

        }
      }

      //append canvas variable c to html 
      document.getElementById("output").appendChild(c);
    //}
  };
  

  //getAvrg(scale,x,y,rgb_pixels) uses the rgb data stored in the rgb_pixels 2D array. To then get the average color of the pixels
  // in the area as defined by: x,y being the top left corner and scale is the width and height
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


  //RGBToHex(r,g,b) takes the RGB and outputs the HEX in a string format
  //r,g,b are integer values [0,255]
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



