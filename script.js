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
      //console.log("generate_button clicked");
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
      total_cost();
      download();
      document.getElementById("dimensions").removeAttribute("hidden");
  };

  function download(){
    var link = document.createElement('a');
    link.download = 'MyLegoPhoto.jpeg';
    link.href = c.toDataURL()
    link.click();
  }
  

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



//Code Referenced from freecodecamp.
//Class HashTable creates a hashtable using chaining to avoid collisions
//We will use the hastable to quickly (avrg O(1))look up the lego.colors using their color name
// as the hash (the key) and the index in the array lego.colors as the respective value 
//Using mode 61 as the has function and since we only have a finite number of lego colors. Using 61 gives
// a search runtime of O(1). This can be confirmed with the display memeber function
class HashTable {
  constructor() {
    this.table = new Array(61);
    this.size = 0;
  }

  _hash(key) {
    return key % this.table.length;
  }

  set(key, value) {
    const index = this._hash(key);
    if (this.table[index]) {
      for (let i = 0; i < this.table[index].length; i++) {
        if (this.table[index][i][0] === key) {
          this.table[index][i][1] = value;
          return;
        }
      }
      this.table[index].push([key, value]);
    } else {
      this.table[index] = [];
      this.table[index].push([key, value]);
    }
    this.size++;
  }

  get(key) {
    const index = this._hash(key);
    //console.log("index:",index);
    if (this.table[index]) {
      for (let i = 0; i < this.table.length; i++) {
        if (this.table[index][i][0] === key) {
          return this.table[index][i][1];
        }
      }
    }
    return undefined;
  }
  display() {
    this.table.forEach((values, index) => {
      const chainedValues = values.map(
        ([key, value]) => `[ ${key}: ${value} ]`
      );
      console.log(`${index}: ${chainedValues}`);
    });
  }
}

const ht = new HashTable();
ht.set(191919,0);
ht.set(221196142,1);
ht.set(0108183,2);
ht.set(15019983,3);
ht.set(24513648,4);
ht.set(2212633,5);
ht.set(2252053,6);
ht.set(15420260,7);
ht.set(014671,8);
ht.set(100103101,9);
ht.set(246173205,10);
ht.set(7647146,11);
ht.set(17511670,12);
ht.set(160161159,13);
ht.set(1054620,14);
ht.set(135141143,15);
ht.set(244244244,16);

//ht.display();


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

class legos{
  constructor(){
    this.colors = [
      {//0
        "rgb": {r:19,g:19,b:19},
        "color": "Black",
        "num": 0,
        "quad_freq":0,
        "total_freq":0,
        "index":0,
      },
      {//1
        "rgb": {r:221,g:196,b:142},
        "color": "Brick Yellow",
        "num": 0,
        "quad_freq":0,
        "total_freq":0,
        "index":1,
      },
      {//2
        "rgb": {r:0,g:108,b:183},
        "color": "Bright Blue",
        "num": 0,
        "quad_freq":0,
        "total_freq":0,
        "index":2,
      },
      {//3
        "rgb": {r:150,g:199,b:83},
        "color": "Bright Green",
        "num": 0,
        "quad_freq":0,
        "total_freq":0,
        "index":3,
      },
      {//4
        "rgb": {r:245,g:136,b:48},
        "color": "Bright Orange",
        "num": 0,
        "quad_freq":0,
        "total_freq":0,
        "index":4,
      },
      {//5
        "rgb": {r:221,g:26,b:33},
        "color": "Bright Red",
        "num": 0,
        "quad_freq":0,
        "total_freq":0,
        "index":5,
      },
      {//6
        "rgb": {r:225,g:205,b:3},
        "color": "Bright Yellow",
        "num": 0,
        "quad_freq":0,
        "total_freq":0,
        "index":6,
      },
      {//7
        "rgb": {r:154,g:202,b:60},
        "color": "Bright Yellowish Green",
        "num": 0,
        "quad_freq":0,
        "total_freq":0,
        "index":7,
      },
      {//8
        "rgb": {r:0,g:146,b:71},
        "color": "Dark Green",
        "num": 0,
        "quad_freq":0,
        "total_freq":0,
        "index":8,
      },
      {//9
        "rgb": {r:100,g:103,b:101},
        "color": "Dark Stone Grey",
        "num": 0,
        "quad_freq":0,
        "total_freq":0,
        "index":9,
      },
      {//10
        "rgb": {r:246,g:173,b:205},
        "color": "Light Purple",
        "num": 0,
        "quad_freq":0,
        "total_freq":0,
        "index":10,
      },
      {//11
        "rgb": {r:76,g:47,b:146},
        "color": "Medium Lilac",
        "num": 0,
        "quad_freq":0,
        "total_freq":0,
        "index":11,
      },
      {//12
        "rgb": {r:175,g:116,b:70},
        "color": "Medium Nougat",
        "num": 0,
        "quad_freq":0,
        "total_freq":0,
        "index":12,
      },
      {//13
        "rgb": {r:160,g:161,b:159},
        "color": "Medium Stone Grey",
        "num": 0,
        "quad_freq":0,
        "total_freq":0,
        "index":13,
      },
      {//14
        "rgb": {r:105,g:46,b:20},
        "color": "Reddish Brown",
        "num": 0,
        "quad_freq":0,
        "total_freq":0,
        "index":14,
      },
      {//15
        "rgb": {r:135,g:141,b:143},
        "color": "Silver Metallic",
        "num": 0,
        "quad_freq":0,
        "total_freq":0,
        "index":15,
      },
      {//16
        "rgb": {r:244,g:244,b:244},
        "color": "White",
        "num": 0,
        "quad_freq":0,
        "total_freq":0,
        "index":16,
      },
    ]
  }

  //setColorNum(count) sets the color's num member variable equal to the count paramter
  // only if the color did not already have a number set (i.e equal to 0)
  // function returns true if the color's num variable was set for the first time.
  setColorNum(rgb, count){
    var key=(rgb.r+"").concat(rgb.g+"").concat(rgb.b+"");
    //console.log("key "+key);
    var index=ht.get(parseInt(key)); //from hashtable O(1);
    
    this.colors[index].quad_freq++;
    if(this.colors[index].num==0){
      this.colors[index].num=count;
      return true;
    }
    return false;
  }

  getColorNum(rgb){
    var key=(rgb.r+"").concat(rgb.g+"").concat(rgb.b+"");
    if(key==221196142){

    }
    var index=ht.get(parseInt(key)); //from hashtable O(1);
    return this.colors[index].num;
  }

  reset_num_quadfreq(){
    var len=this.colors.length;
    for(var i=0;i<len;i++){
      this.colors[i].quad_freq=0;
    }
  }

  reset_num_totalfreq(){
    var len=this.colors.length;
    for(var i=0;i<len;i++){
      this.colors[i].total_freq=0;
    }
  }
}

let lego = new legos();







//getColorsSelected() returns the colors selected in the drop down
function getColorsSelected(){
  var len=lego.colors.length;
  //console.log(len);
  var selected=[];
  for(var i=0;i<len;i++){
    var id=""+i;
    if(document.getElementById(id).checked){
      selected.push(i);
    }
  }
  //console.log(selected);
  return selected;
}

//closest_lego_color(input ,rgb_pixels) compares the rgb paramter input to the
// array of lego.colors, and returns the closest color
//O(n)

var r_weight=0.3; //0.3
var g_weight=0.3; //0.59
var b_weight=0.3; //0.11
function closest_lego_color(input ,rgb_pixels, selected_colors){
  var index=selected_colors[0];
  var closest_color=lego.colors[index];

  var closest_distance=Math.pow(r_weight * (input.r-lego.colors[index].rgb.r),2)
  + Math.pow(g_weight * (input.g-lego.colors[index].rgb.g),2)
  + Math.pow(b_weight * (input.b-lego.colors[index].rgb.b),2);

  var len=selected_colors.length;
  for(var i=0;i<len;i++){
    index=selected_colors[i];
    var d= Math.pow(r_weight * (input.r-lego.colors[index].rgb.r),2)
    + Math.pow(g_weight * (input.g-lego.colors[index].rgb.g),2)
    + Math.pow(b_weight * (input.b-lego.colors[index].rgb.b),2);

    if(d<closest_distance){
      closest_distance=d;
      closest_color=lego.colors[index];
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


var count=1; //count will a unique reference to each lego color (refer to building instructions to see purpose)
//print_quadrant(row,col,length) appendes the created canvas to the html
function print_quadrant(row,col,height,width){

  const original_col=col;
  var len_row=row+height;
  if(len_row>rgb_avrg.length){
    len_row=rgb_avrg.length;
  }

  var len_col=col+width;
  if(len_col>=rgb_avrg[0].length){
    len_col=rgb_avrg[0].length;
  }

  
  // var height=(~~(rgb_avrg.length/3)+1)*global_scale*2;
  // var width= (~~(rgb_avrg[0].length/3)+1)*global_scale*2;
  var canvas_height=height*global_scale*2;
  var canvas_width=width*global_scale*2;
  c_intructions.setAttribute("width",canvas_width);
  c_intructions.setAttribute("height",canvas_height);
  //console.log("h:"+c_intructions.height);
  var ctx = c_intructions.getContext("2d");
  //console.log(rgb_avrg);

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
      var stroke_width=global_scale/4;
      ctx.strokeStyle = col_hex_string;
      ctx.arc((col_count*global_scale*2)+(global_scale),(row_count*global_scale*2)+(global_scale), global_scale-(stroke_width/2) , 0, 2 * Math.PI);
      //ctx.arc((col_count*global_scale)+(global_scale/2),(row_count*global_scale)+(global_scale/2), global_scale/2, 0, 2 * Math.PI);
      ctx.lineWidth=stroke_width;
      ctx.stroke();

      if(lego.setColorNum(rgb,count)){
        count++;
      }
      var num=lego.getColorNum(rgb);

      
      //Draw respective number
      ctx.font = global_scale+"px Arial";
      ctx.textAlign = 'center';
      ctx.textBaseline= 'middle';



      ctx.fillText(""+num,(col_count*global_scale*2)+(global_scale), ((row_count*global_scale*2)+(global_scale)));

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
   lego.reset_num_quadfreq();
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
     row_portion+=1;
    }

   for(var i=0;i<width_height;i++){
    if(0==col.localeCompare(cols[i])){
      break;
    }
    col_portion+=1;
  }
  //(row_portion,col_portion);

  const height=rgb_avrg.length;
  const width=rgb_avrg[0].length;

  var quad_height=~~(height/width_height)+1;
  var quad_width=~~(width/width_height)+1;
  console.log(quad_width,quad_height);

  const height_index=quad_height*row_portion;
  const width_index=quad_width*col_portion;
  
  console.log("y,x >>>",height_index,width_index);

  //console.log("len"+~~(height/width_height))
 
  print_quadrant(height_index,width_index,quad_height,quad_width);


  //Now we also display the referenced number and quantity in the list element
  createlist();
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

//compare_num(a,b) will be used to compare the memeber variable for the color objects
// the member variable being the num feild.
// We then use this function to sort the lego.colors array based on each obj num variable
function compare(a,b) {
  if ( a.num < b.num ){
    return -1;
  }
  if ( a.num > b.num ){
    return 1;
  }
  return 0;
}

//createlits() creates a list of the lego.colors currently needing to be displyed for instructions
function createlist() {
  var root=document.getElementById("color-list");
  while( root.firstChild ){
    root.removeChild( root.firstChild );
  }
  
  //now we add new <li> elements
  var completelist= document.getElementById("color-list");
  
  len=lego.colors.length;
  var temp=[...lego.colors];

  //sort the colors based on num field
  temp.sort(compare);

  for(var i=0;i<len;i++){
    if(temp[i].quad_freq!=0){
      var str_quad_freq=""+temp[i].quad_freq;
      var str_num=""+temp[i].num;
      var str_color=temp[i].color;
      var str=str_num+": "+str_color+"<br>  x "+str_quad_freq;
      var id="id=\"_"+temp[i].index+"\"";
      completelist.innerHTML += "<li "+id+">  "+str+"</li>";

    }
  }
}

function total_cost(){
  lego.reset_num_totalfreq();
  var total=document.getElementById("total");
  var height=rgb_avrg.length;
  var width=rgb_avrg[0].length;
  var size=height*width;
  var str_size=""+size;
  total.innerHTML= "Total Cost: "+size+"pieces x $0.06 CAD/piece = $"+ Math.round(size*0.06) +" CAD";


  
  var key,index;

  for(var row=0;row<height;row++){
    for(var col=0;col<width;col++){
      var rgb=rgb_avrg[row][col];
      key=(rgb.r+"").concat(rgb.g+"").concat(rgb.b+"");
      index=ht.get(parseInt(key));
      lego.colors[index].total_freq++;
    }
  }


  var total_legos=document.getElementsByClassName("total-legos")[0];
  total_legos.innerHTML="";
  var len=lego.colors.length;
  for(var i=0;i<len;i++){
    if(lego.colors[i].total_freq!=0){
      var id="id=\"_"+lego.colors[i].index+"\"";
      console.log("<div "+id+">"+lego.colors[i].color+": x "+lego.colors[i].total_freq+"</div>");
      total_legos.innerHTML+="<div "+id+">"+lego.colors[i].color+": x "+lego.colors[i].total_freq+"</div>";
    }
  }

  var dimensions=document.getElementById("dimensions");
  dimensions.innerHTML="Height: "+height+" pieces,  Width: "+width+" pieces";
}