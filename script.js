// Plan 
// 1) get the color of the pixels DONE
// 2) next, get the average color DONE
// 3) thrid, get the Lego color thats closest to the avrg color DONE
// 4) display the the lego 1 by 1 platte in the browser DONE
// 5) provide instructions

let rgb_avrg;
let global_scale=20;
let c = document.createElement("canvas");
let c_intructions = document.createElement("canvas");

  function display_lego_photo(){
      print=true;
      console.log("generate_button clicked");
      try {
        var img= document.getElementById("dragged_img");
        var height = img.naturalHeight || img.offsetHeight || img.height;
        var width = img.naturalWidth || img.offsetWidth || img.width;
      } catch (error) {
        console.log("catch");
        alert("No Image Inputed.\nPlease Upload an Image File");
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
      global_scale=scale;


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

      c.setAttribute("width",width);
      c.setAttribute("height",height);

      console.log("h"+c.height);
      console.log("w"+c.width);

      //clear previous drawing on canvas
      ctx.beginPath();
      ctx.fillStyle = "white";
      ctx.fillRect(0,0,width,height);

      //create 2D array to store the average color of the pixels [height][width]
      var rgb_avrg_pixels = new Array(height/scale);
      var len=rgb_avrg_pixels.length;
      var width_avrg=width/scale;
      for(var i=0; i < len; i++){
          rgb_avrg_pixels[i] = new Array(width_avrg);
      }
      var row_avrg=0;
      var col_avrg=0;

      //Get the average color of the pixel blocks (sclae*scale) and paint that color onto the canvas
      var selected_colors=getColorsSelected();
      for(var row=0; row < height; row+=scale){
        for(var col=0; col < width; col+=scale){

          var rgb=getAvrg(scale,row,col,rgb_pixels);
          
          var lego_color=closest_lego_color(rgb,rgb_pixels,selected_colors);
          rgb=lego_color.rgb;

          //console.log(rgb);
          rgb_avrg_pixels[row_avrg][col_avrg]=rgb;
          col_avrg++;

          var col_hex_string=RGBToHex(rgb.r,rgb.g,rgb.b);
          
          ctx.beginPath();
          ctx.fillStyle = col_hex_string;
          ctx.arc(col+(scale/2),row+(scale/2), scale/2, 0, 2 * Math.PI);
          ctx.fill();
        }
        col_avrg=0;
        row_avrg++;
      }
      //set global variable
      rgb_avrg=rgb_avrg_pixels;

      //append canvas variable c to html 
      document.getElementById("output").appendChild(c);

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
  {//0
    "rgb": {r:19,g:19,b:19},
    "color": "Black",
  },
  {//1
    "rgb": {r:221,g:196,b:142},
    "color": "Brick Yellow",
  },
  {//2
    "rgb": {r:0,g:108,b:183},
    "color": "Bright Blue",
  },
  {//3
    "rgb": {r:150,g:199,b:83},
    "color": "Bright Green",
  },
  {//4
    "rgb": {r:245,g:136,b:48},
    "color": "Bright Orange",
  },
  {//5
    "rgb": {r:221,g:26,b:33},
    "color": "Bright Red", 
  },
  {//6
    "rgb": {r:225,g:205,b:3},
    "color": "Bright Yellow",
  },
  {//7
    "rgb": {r:154,g:202,b:60},
    "color": "Bright Yellowish Green",
  },
  {//8
    "rgb": {r:0,g:146,b:71},
    "color": "Dark Green",
  },
  {//9
    "rgb": {r:100,g:103,b:101},
    "color": "Dark Stone Grey",
  },
  {//10
    "rgb": {r:246,g:173,b:205},
    "color": "Light Purple",
  },
  {//11
    "rgb": {r:76,g:47,b:146},
    "color": "Medium Lilac",
  },
  {//12
    "rgb": {r:175,g:116,b:70},
    "color": "Medium Nougat",
  },
  {//13
    "rgb": {r:160,g:161,b:159},
    "color": "Medium Stone Grey",
  },
  {//14
    "rgb": {r:105,g:46,b:20},
    "color": "Reddish Brown",
  },
  {//15
    "rgb": {r:135,g:141,b:143},
    "color": "Silver Metallic",
  },
  {//16
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
var print=true; //for testing;
var r_weight=0.3; //0.3
var g_weight=0.3; //0.59
var b_weight=0.3; //0.11
function closest_lego_color(input ,rgb_pixels, selected_colors){
  var index=selected_colors[0];
  var closest_color=legocolors[index];

  var closest_distance=Math.pow(r_weight * (input.r-legocolors[index].rgb.r),2)
  + Math.pow(g_weight * (input.g-legocolors[index].rgb.g),2)
  + Math.pow(b_weight * (input.b-legocolors[index].rgb.b),2);

  var len=selected_colors.length;
  for(var i=0;i<len;i++){
    index=selected_colors[i];
    var d= Math.pow(r_weight * (input.r-legocolors[index].rgb.r),2)
    + Math.pow(g_weight * (input.g-legocolors[index].rgb.g),2)
    + Math.pow(b_weight * (input.b-legocolors[index].rgb.b),2);
    if(print){
      console.log(d);
    }
    
    if(d<closest_distance){
      closest_distance=d;
      closest_color=legocolors[index];
    }
  }
  print=false;
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

/*
for(var row=0; row < height; row+=scale){
  for(var col=0; col < width; col+=scale){

    var rgb=getAvrg(scale,row,col,rgb_pixels);
    
    var lego_color=closest_lego_color(rgb,rgb_pixels,selected_colors);
    rgb=lego_color.rgb;

    console.log(rgb);
    rgb_avrg_pixels[row_avrg][col_avrg]=rgb;
    col_avrg++;

    var col_hex_string=RGBToHex(rgb.r,rgb.g,rgb.b);
    
    ctx.beginPath();
    ctx.fillStyle = col_hex_string;
    ctx.arc(col+(scale/2),row+(scale/2), scale/2, 0, 2 * Math.PI);
    ctx.fill();
  }
  */

//print_quadrant(row,col,length) appendes the created canvas to the html
function print_quadrant(row,col,length){

  const original_col=col;
  var len_row=row+length;
  if(len_row>rgb_avrg.length){
    len_row=rgb_avrg.length-1;
  }

  var len_col=col+length;
  if(len_col>=rgb_avrg[0].length){
    len_col=rgb_avrg[0].length-1;
  }

  var height=(~~(rgb_avrg.length/3)+1)*global_scale;
  var width= (~~(rgb_avrg[0].length/3)+1)*global_scale;
  c_intructions.setAttribute("width",width);
  c_intructions.setAttribute("height",height);
  console.log("h:"+c_intructions.height);
  var ctx = c_intructions.getContext("2d");
  console.log(rgb_avrg);

  var col_count=0;
  var row_count=0;
  for(;row<len_row;row++){
    
    for(;col<len_col;col++){
      
      var rgb=rgb_avrg[row][col];
      // console.log(row,col);
      //console.log(rgb_avrg[row][col]);
      //console.log(row,col);
      var col_hex_string=RGBToHex(rgb.r,rgb.g,rgb.b);

      ctx.beginPath();
      //console.log(global_scale);
      //console.log(col+(global_scale/2),row+(global_scale/2),global_scale/2);
      ctx.fillStyle = col_hex_string;
      ctx.arc((col_count*global_scale)+(global_scale/2),(row_count*global_scale)+(global_scale/2), global_scale/2, 0, 2 * Math.PI);
      ctx.fill();
      col_count++;
    }
    row_count++;
    col_count=0;
    col=original_col;
    
  }
  document.getElementsByClassName("output_instructions")[0].appendChild(c_intructions);
}

//quadrant(quadrent) reads the users input (for which quadrent they want instructions for)
// then outputs the colors to the user;
function generate_quadrant(quadrent){
  //error check
  if(rgb_avrg==null){
    alert("No Image Generated.\nPlease Click Generate");
    return 
  }
   const parse=quadrent.split(" ");
   const row=parse[0];
   const col=parse[1];
   const rows=["Top","Middle","Bottom"];
   const cols=["Left","Middle","Right"];
   
   var row_portion=0;
   var col_portion=0;

   var width_height=3;
   for(var i=0;i<width_height;i++){

    if(0==row.localeCompare(rows[i])){
       break;
     }
     row_portion+=1/width_height;
    }

   for(var i=0;i<width_height;i++){
    if(0==col.localeCompare(cols[i])){
      break;
    }
    col_portion+=1/width_height;
  }
  console.log(row_portion,col_portion);

  const height=rgb_avrg.length;
  const width=rgb_avrg[0].length;
  const height_index=~~(height*row_portion);
  const width_index=~~(width*col_portion);
  //console.log(height_index,width_index);

  //console.log("len"+~~(height/width_height))
  print_quadrant(height_index,width_index,~~(height/width_height));


}

//Create eventListener for the displying instruction buttons
//We dont use the onlick attribute, so we can scale this feature in the future 
var grid_size=9;
for(var i=0;i<grid_size;i++){
const element = document.getElementsByClassName("cell")[i];
const quadrant=element.innerHTML;
element.addEventListener("click", () => {
	generate_quadrant(quadrant);
  });
}

