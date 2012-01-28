/**
 jquery.fluentgallery.js ver1.0

The MIT License

Copyright (c) since 2012 Grow! inc. jun takeno
http://growbutton.com

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
 */
(function($) {
  var before_column = -1;
	
  $.fn.fluentgallery = function(options){
    /**
     * default Options
     */
    var defaults ={
      tile_class : ".tile" ,
      resize     : false
    };
    
    var opts = $.extend(defaults , options);
    
    return this.each(function(){
    	var area_elem = $(this);
    	var total_width = area_elem.outerWidth(true);
    	
    	deployTiles(area_elem , opts.tile_class);
    	
    	if(opts.resize){
	    	$(window).bind("resize" , function(){
	    		deployTiles(area_elem , opts.tile_class);
	    	});
	   }
    });
  };
  
	/**
	 * Deploy tiles
	 */
	function deployTiles(area_elem , tile_class , column){
		var is_first = false;
		var total_column = 0;
		var tile_column_width = 0;
		var cols_height_array = new Array();

		area_elem.find(tile_class).each(function(i , elem){
			if(!is_first){
				is_first = true;
				tile_column_width = $(elem).outerWidth(true);
				total_column = Math.floor(area_elem.outerWidth(true) / tile_column_width);
				
				console.log(before_column);
				
				//if no change column count . It don't need resize
				if(before_column == total_column)return false;
				
				before_column = total_column;
				
				//init array 
				for(var i = 0; i < total_column; i++)cols_height_array.push(0);
				
				elem.style.top = '0px';
				elem.style.left = '0px';
			}
			
			var insert_position = getNextPosition(cols_height_array , elem , tile_column_width);
			
			area_elem.height(Math.max.apply(null, cols_height_array));
			
			elem.style.top  = insert_position.top + 'px';
			elem.style.left = insert_position.left + 'px';
			//console.log(cols_height_array);
		});
	}
	
	/**
	 * 次に配置すべき所を計算して配置する。
	 */
	function getNextPosition(cols_height_array , tile_elem , tile_column_width){
		var length = cols_height_array.length;
		var min = Math.min.apply(null, cols_height_array);  // → 1

		for(var i = 0; i <= length; i++){
			if(min == cols_height_array[i]){
				var insert_height = cols_height_array[i];
				cols_height_array[i] += $(tile_elem).outerHeight();
				return {left:tile_column_width*i , top:insert_height};
			}
		}
		
		return {top:0,left:0};
	}
})(jQuery);