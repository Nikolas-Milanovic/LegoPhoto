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
      try {
        var img= document.getElementById("dragged_img");
        var height = img.naturalHeight || img.offsetHeight || img.height;
        var width = img.naturalWidth || img.offsetWidth || img.width;
      } catch (error) {
        console.log("catch");
        alert("No Image Inputed.\nPlease Upload Image file");
        return;
      }
 
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
      var selected_colors=getColorsSelected();
      for(var row=0; row < height; row+=scale){
        for(var col=0; col < width; col+=scale){

          var rgb=getAvrg(scale,row,col,rgb_pixels);
          
          var lego_color=closest_lego_color(rgb,rgb_pixels,selected_colors);
          rgb=lego_color.rgb;
          var col_hex_string=RGBToHex(rgb.r,rgb.g,rgb.b);
          
  
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

  /*
  Lego exact colors:
  Black
  Brick Yellow
  Bright Blue
  Bright Green
  Bright Orange
  Bright Red
  Bright Yellow
  Bright Yellowish Green
  Dark Green
  Dark Stone Grey
  Light Purple
  Medium Lilac
  Medium Nougat
  Medium Stone Grey
  Reddish Brown
  Silver Metallic
  White
*/
const legocolors = [
  {
    "rgb": {r:19,g:19,b:19},
    "color": "Black",
  },
  {
    "rgb": {r:221,g:196,b:142},
    "color": "Brick Yellow",
  },
  {
    "rgb": {r:0,g:108,b:183},
    "color": "Bright Blue",
  },
  {
    "rgb": {r:150,g:199,b:83},
    "color": "Bright Green",
  },
  {
    "rgb": {r:245,g:136,b:48},
    "color": "Bright Orange",
  },
  {
    "rgb": {r:221,g:26,b:33},
    "color": "Bright Red",  /*6*/
  },
  {
    "rgb": {r:225,g:205,b:3},
    "color": "Bright Yellow",
  },
  {
    "rgb": {r:154,g:202,b:60},
    "color": "Bright Yellowish Green",
  },
  {
    "rgb": {r:0,g:146,b:71},
    "color": "Dark Green",
  },
  {
    "rgb": {r:100,g:103,b:101},
    "color": "Dark Stone Grey",
  },
  {
    "rgb": {r:246,g:173,b:205},
    "color": "Light Purple",
  },
  {
    "rgb": {r:76,g:47,b:146},
    "color": "Medium Lilac",
  },
  {
    "rgb": {r:175,g:116,b:70},
    "color": "Medium Nougat",
  },
  {
    "rgb": {r:160,g:161,b:159},
    "color": "Medium Stone Grey",
  },
  {
    "rgb": {r:105,g:46,b:20},
    "color": "Reddish Brown",
  },
  {
    "rgb": {r:135,g:141,b:143},
    "color": "Silver Metallic",
  },
  {
    "rgb": {r:244,g:244,b:244},
    "color": "White",
  },
]

//getColorsSelected() returns the colors selected in the drop down
function getColorsSelected(){
  var len=legocolors.length;
  console.log(len);
  var selected=[];
  for(var i=0;i<len;i++){
    var id=""+i;
    console.log("id"+id);
    if(document.getElementById(id).checked){
      selected.push(i);
    }
  }
  console.log(selected);
  return selected;
}

//closest_lego_color(input ,rgb_pixels) compares the rgb paramter input to the
// array of legocolors, and returns the closest color
//O(n)
function closest_lego_color(input ,rgb_pixels, selected_colors){
  var closest_color=legocolors[0];
  var closest_distance=3*Math.pow(255,2);//max distance

  var len=selected_colors.length;
  for(var i=0;i<len;i++){
    var index=selected_colors[i];
    var d=Math.pow(input.r-legocolors[index].rgb.r,2)
    +Math.pow(input.g-legocolors[index].rgb.g,2)
    +Math.pow(input.b-legocolors[index].rgb.b,2);
    if(d<closest_distance){
      closest_distance=d;
      closest_color=legocolors[i];
    }
  }
  return closest_color;
}


//Checkbox functionality
var expanded = false;

function showCheckboxes() {
  var checkboxes = document.getElementById("checkboxes");
  if (!expanded) {
    checkboxes.style.display = "block";
    expanded = true;
  } else {
    checkboxes.style.display = "none";
    expanded = false;
  }
}




