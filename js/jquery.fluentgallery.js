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

  $.fluentgallery = function(selector, options) {
    var container = $(selector);
    container.fluentgallery();
    return $.extend(container, {
      append : function(element) {
        container.fluentgallery({
          add : element
        });
      }
    });
  };
  var before_column = -1;
  var cols_height_arrays = {};
  var tile_column_widths = {};

  $.fn.fluentgallery = function(options) {
    /**
     * default Options
     */
    var defaults = {
      tile_class : ".tile",
      resize : true,
      add : null,
      margin_bottom : 0,
      reset : false,
      order : true ,
    };

    var opts = $.extend(defaults, options);
    if(opts.reset) {
      gallery_reset();
    }

    return this.each(function() {
      var area_elem = $(this);
      var total_width = area_elem.outerWidth(true);

      if($(this).find(opts.tile_class).length == 0) {
        $(area_elem).append('<div class="' + opts.tile_class.replace(".", "") + '">/div>');
        deployTiles(area_elem, opts.tile_class);
        $(area_elem).html('');

        cols_height_arrays[area_elem][0] = 0;
      }

      if(opts.add != null && cols_height_arrays[$(area_elem)]) {
        if(load_flag) {
          stack_div.push(opts.add);
          return false;
        }

        append($(area_elem), opts.add);
        return false;
      }

      deployTiles(area_elem, opts.tile_class);

      if(opts.resize) {
        $(window).bind("resize", function() {
          deployTiles(area_elem, opts.tile_class);
        });
      }
    });
  };
  function gallery_reset() {
    before_column = -1;
    cols_height_arrays = {};
    tile_column_widths = {};
  }

  /**
   * Deploy tiles
   */
  function deployTiles(area_elem, tile_class, column) {
    var is_first = false;
    var total_column = 0;
    var tile_column_width = 0;
    var cols_height_array = new Array();

    area_elem.find(tile_class).each(function(i, elem) {
      if(!is_first) {
        is_first = true;
        tile_column_width = $(elem).outerWidth(true);
        total_column = Math.floor(area_elem.outerWidth(true) / tile_column_width);

        //if no change column count . It don't need resize
        if(before_column == total_column)
          return false;
        before_column = total_column;

        //init array
        for(var i = 0; i < total_column; i++)
        cols_height_array.push(0);

        elem.style.top = '0px';
        elem.style.left = '0px';

        //keep position info.
        cols_height_arrays[area_elem] = cols_height_array;
        tile_column_widths[area_elem] = tile_column_width;
      }

      var insert_position = getNextPosition(cols_height_array, elem, tile_column_width);

      area_elem.height(Math.max.apply(null, cols_height_array));

      elem.style.top = insert_position.top + 'px';
      elem.style.left = insert_position.left + 'px';
      //console.log(cols_height_array);
    });
  }

  var stack_div = new Array();
  var load_flag = false;
  function next_append(target_elem) {
    if(stack_div.length.length == 0)
      return;

    append(target_elem, stack_div.shift());
  }

  /**
   * append
   */
  function append(target_elem, div) {
    load_flag = true;
    var tile = $(div).hide();

    function deploy(tile) {
      target_elem.append(tile);

      var position = getNextPosition(cols_height_arrays[target_elem], tile, tile_column_widths[target_elem]);
      tile.css('top', position.top + 'px').css('left', position.left + 'px').show();

      target_elem.height(Math.max.apply(null, cols_height_arrays[target_elem]));
    }

    if($(div).find("img.content_img").length == 0) {
      console.log("monstar.fm");
      deploy(tile);
      //next_append(target_elem);
      load_flag = false;
      return;
    }

    $(div).find("img.content_img").each(function() {
      $(this).bind("load", function() {
        deploy(tile);
        next_append(target_elem);
        load_flag = false;
      });

      $(this).bind("error", function() {
        $(this).remove();
        deploy(tile);
        next_append(target_elem);
        load_flag = false;
      });
    });
  }

  /**
   * 次に配置すべき所を計算して配置する。
   */
  function getNextPosition(cols_height_array, tile_elem, tile_column_width) {
    var length = cols_height_array.length;
    var min = Math.min.apply(null, cols_height_array);
    // → 1

    for(var i = 0; i <= length; i++) {
      if(min == cols_height_array[i]) {
        var insert_height = cols_height_array[i];
        cols_height_array[i] += $(tile_elem).outerHeight(true);
        return {
          left : tile_column_width * i,
          top : insert_height
        };
      }
    }

    return {
      top : 0,
      left : 0
    };
  }

})(jQuery);
