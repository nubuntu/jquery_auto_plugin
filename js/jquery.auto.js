/* 

autoForm 1.0.0

---------------------------------------------------------------------------

Copyright (C) 2015 by Noercholis (http://www.noercholis.com)

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

(function( $ ) {
        $.widget("nubuntu.autoForm", {
            options : {
                buttons_align : 'center',
                date_format   : 'yy-mm-dd',
                async         : false,  
            },
            $container      : null,
            $container_body : null,
            $title          : null, 
            $form           : null,
            $msgbox         : null,
            _create : function(){
                this.element.addClass('row');
                if(this.options.source){
                    var options = this._get_source();
                    $.extend(true, this.options, options);                    
                }
                this._create_box();                
            },
            "reload" : function(){
                this.element.empty();
                this._create();
            },
            _get_source : function(){
                var params      = {};
                var source_url  = this.options.source + '?autoform_action=get_source';
                if(this.options.session_name){
                    source_url  = source_url + '&autoform_session_name=' + this.options.session_name;
                }
                $.ajax({
                      url: source_url,
                      type: "GET",
                      async: false,
                      success: function(data) {
                        try {
                            params = JSON.parse(data);
                        } catch (e) {
                            return {};
                        }
                      }
                });
                return params;
            },
            _create_box : function(){
                this.$container = $('<div/>').addClass('panel panel-primary autoform_title').appendTo(this.element);
                this._create_title();
                this._create_body();
                this._create_form();
            },
            _create_title : function(){
                if(!this.options.title){
                    this.options.title='';
                }
                this.$title = $("<div/>").addClass('panel-heading autotable_title')
                        .append('<h3 class="panel-title pull-left">' + this.options.title + '</h3>')
                        .append('<div class="clearfix"></div>')
                        .appendTo(this.$container);
            },
            _create_body  : function(){
                this.$container_body = $('<div/>').addClass('panel-body').appendTo(this.$container);
            },
            _create_form  : function(){
               this.$form = $('<form/>')
                                .append(this._get_msg_box())
                                .append(this._get_fields())
                                .append(this._get_buttons())
                                .appendTo(this.$container_body);
            },
            _get_msg_box : function(){
                this.$msgbox = $('<div/>').addClass('autoform_message alert').hide();
                return this.$msgbox;    
            },
            _get_fields : function(){
                var $fieldset   = $('<div/>').addClass('autoform_inputs');
                var self        = this;
                $.each(this.options.fields, function(index, field) {
                    field.name  = index;
                    if(!field.value){
                        field.value = null;
                    }
                    $fieldset.append(self._get_field(field));
                });
                return $fieldset;
            },
            _get_field : function(field){
                var $div = $('<div/>').addClass('form-group').append(this._get_input(field));
                $div = this._set_visibility(field,$div);
                field.element = $div; 
                return $div;                       
            },
            _get_input : function (field){
                var $div    = $('<div/>').addClass('input form-group');
                var $label  = this._get_label(field);
                if(field.required){
                    $label.addClass('label-required');
                }
                var $input  = null;
                switch(field.type){
                    default:
                        $input = this._get_input_text(field);
                    break;
                    case 'textarea':
                        $input = this._get_input_textarea(field);
                    break;
                    case 'select':
                        $input = this._get_input_select(field);
                    break;
                    case 'date':
                        $input = this._get_input_date(field);
                    break;
                    case 'email':
                        $input = this._get_input_email(field);
                    break;
                    case 'radio':
                        $input = this._get_input_radio(field);
                    break;
                }
                switch(field.type){
                    default:
                        $label.append($('<span/>').addClass('form-input')
                                        .append($input))
                                        .appendTo($div);
                    break;
                    case "caption":
                        return this._get_caption(field.title);
                    break;
                    case "label":
                        return this._get_label(field,false);
                    break;
                    case 'hidden':
                        return this._get_input_hidden(field);
                    break;
                    case 'checkbox':
                        if(field.options){
                            return this._get_input_checkbox_group(field);
                        }
                        return this._get_input_checkbox(field);
                    break;
                }
                return $div;
            },
            _set_visibility    : function(field,$div){
                if(field.visible!==undefined){
                    if(!field.visible){
                        $div.hide();
                    }
                }
                return $div;
            },
            _get_label        : function(field,input_label){
                input_label = input_label!==undefined?input_label:true;
                var $label  = $('<div/>');
                var $span   = $('<label/>').attr('for',field.name).html(field.title);
                if(input_label){
                    $span.addClass('form-label');
                }
                return $label.append($span);
            },
            _get_caption      : function(title){
                var $div = $('<div/>').addClass('widget-title').append(
                                    $('<div/>').addClass('meta').append(
                                        $('<div/>').addClass('name').html(title)
                                    )
                                );
                return $div

            },
            _get_input_base   : function(field,$input){
                var self = this;
                $input.prop('name','autoform_' + field.name)
                      .prop('id','autoform_' + field.name)
                      .data('field',field)
                      .addClass('form-control autoform_control');
                if(field.required){
                    $input.prop('required',field.required);
                }
                if(field.attr){
                    $.each(field.attr, function(key,value) {
                        $input.prop(key,value);
                    });
                }
                $input.change(function(){
                    var el  = $(this);
                    var val = self._get_input_change(el);
                    if(field.change!==undefined){
                        if(typeof field.change==='string'){
                            var func = field.change.replace("function","function change");
                            eval(func);
                            change(self,val,el);                           
                        }else{
                            field.change(self,val,el);
                        }
                    }
                });             
                return $input; 
            },
            _get_input_change : function(element){
                var field   = element.data('field');
                field.value = this._get_input_value(element,field);
                element.data('field',field);
                return field.value;
            },
            _get_input_text : function(field){
                var $input  =  $('<input/>').prop('type','text');
                $input      =  this._get_input_base(field,$input);
                return $input;
            },
            _get_input_textarea : function(field){
                var $input  =  $('<textarea/>');
                $input      =  this._get_input_base(field,$input);
                return $input;
            },
            _get_input_select : function(field){
                var $input  = $('<select/>');
                if(field.options!==undefined){
                    $input.append($('<option/>').val('').html('-'));
                    $.each(field.options, function(index,option) {
                        $input.append($('<option/>').val(option.value).html(option.text));
                    });
                }
                $input      =  this._get_input_base(field,$input);
                return $input;
            },
            _get_input_date   : function(field){
                var $input  =  $('<input/>').prop('type','text');
                $input      =  this._get_input_base(field,$input);
                $input.datepicker({
                        dateFormat: this.options.date_format,
                        changeMonth: true,
                        changeYear: true,
                        beforeShow: function(i) { if ($(i).attr('readonly')) { return false; } },
                });
                return $input;
            },
            _get_input_email  : function(field){
                var $input  =  $('<input/>').prop('type','email');
                $input      =  this._get_input_base(field,$input);
                return $input;
            },
            _get_input_radio    : function(field){
                var self = this;
                var $div = $('<div/>');
                if(field.options!=undefined){
                    $.each(field.options, function(index,option){
                        var $input  =  $('<input/>').prop('type','radio').prop('value',option.value);
                        if(field.default!==undefined && field.default==option.value){
                            $input.prop('checked',true);
                        }
                        $input      =  self._get_input_base(field,$input);
                        $input.prop('id',$input.prop('id') + '_' + option.value);
                        $input.removeClass('form-control');
                        $div.append($input);
                        $div.children().last().after(' ' + option.text + '<br/>');
                    });
                }
                return $div;
            },
            _get_input_hidden : function(field){
                var $input  =  $('<input/>').prop('type','hidden');
                if(field.value){
                    $input.val(field.value);
                }
                $input      =  this._get_input_base(field,$input);
                return $input;
            },
            _get_input_checkbox : function(field){
                var $input_div      = $('<div/>').addClass('checkbox');
                var $input          = $('<input/>').prop('type','checkbox');
                $input              = this._get_input_base(field,$input);
                var $input_label    = $('<label/>').append($input).append('<span>' + field.title + '</span>');
                return $input_div.append($input_label);
            },
            _get_input_checkbox_group    : function(field){
                var self        =  this;
                var $div        = $('<div/>');
                if(field.options!=undefined){
                    $.each(field.options, function(index,option){
                        var $input  =  $('<input/>').prop('type','checkbox').prop('value',option.value);
                        $input      =  self._get_input_base(field,$input);
                        $input.prop('id',$input.prop('id') + '_' + option.value);
                        $input.removeClass('form-control');
                        $div.append($input);
                        $div.children().last().after(' ' + option.text + '<br/>');
                    });
                }
                return $div;
            },
            _get_input_value    : function($input,field){
                switch(field.type){
                    default:
                        return $input.val();
                    break;
                    case 'checkbox':
                        if(field.options){
                            return this._get_input_value_checkbox_group($input,field);
                        }
                        return $input.prop('checked');
                    break;    
                }
                return $input.val();
            },
            _get_input_value_checkbox_group : function($input,field){
                var values  = [];
                var $parent = $input.parent();
                $.each(field.options,function(key,option){
                    var checked = $parent.find('#autoform_' + field.name + '_' + option.value).prop('checked');
                    if(checked){
                        values.push(option.value);
                    }
                });
                return values;
            },
            _get_buttons : function(){
                var $div = $('<div/>').addClass('autoform_action pull-right');
                var self = this;
                if(this.options.buttons){
                    $.each(this.options.buttons, function(index, button) {
                        $div.append(self._get_button(button)).append(' ');
                    });
                }
                return $div;
            },
            _get_button : function(button){
                var $a      = $('<a/>').addClass('btn');
                var self    = this;
                if(button.class!==undefined)
                    $a.addClass(button.class);
                if(button.href!==undefined)
                    $a.prop('href',button.href);
                if(button.click!==undefined){
                    if(typeof button.click==='string'){
                        var func = button.click.replace("function","function click");
                        eval(func);
                        $a.click(function(){
                            click(self);                           
                        });
                    }else{
                        $a.click(function(){
                            button.click(self);                        
                        });
                    }
                }
                if(button.icon){
                    var $icon = $('<span/>').addClass(button.icon);
                    $a.append($icon).append(' ' + button.title);
                }else{
                    $a.html(button.title);
                }
                return $a;
            },
            get_fields   : function(){
                var $controls = this.$container.find('.autoform_control');
                var fields    = [];
                $controls.each(function(index){
                    var field = $(this).data('field');
                    fields.push(field);
                });
                return fields;
            },
            get_data    : function(){
                var fields  = this.get_fields();
                var data    = {};
                $.each(fields, function(index, field) {
                    data[field.name] = field.value;
                });
                return data;
            },
            validate    : function(){
                var self    = this;
                var valid   = true;
                this.$msgbox.empty().hide();
                $.each(this.options.fields, function(index, field) {
                    if(field.required){
                        if(!field.value){
                            self.$msgbox.append(field,field.title + ' is required and cannot be empty.<br/>');
                            valid = false;
                        }else{
                            if(field.value.trim().length<1){    
                                self.$msgbox.append(field,field.title + ' is required and cannot be empty<br/>');
                                valid = false;
                            }
                        }
                    }
                });
                if(!valid){
                    self.$msgbox.addClass('alert-danger');
                    self.$msgbox.show().delay(5000).fadeOut();
                }
                return valid;
            },
            submit     : function(callback){
                var self        = this;
                var data        = this.get_data();
                var response    = '';
                var action_save = this.options.action_save!==undefined?this.options.action_save:this.options.source + '?autoform_action=save_data'; 
                if(this.options.encode){
                    data = JSON.stringify(data);
                    data = this._encode(data);
                }
                $.ajax({
                      url: action_save,
                      data: data,
                      type: "POST",
                      async: this.options.async,
                      success: function(data) {
                        console.log(data);
                        if(self.options.async){
                            callback(data);
                        }else{
                            response = data;
                        }
                      }
                });
                return response;
            },
            show_error : function(field,message){
                var $div = $('<div/>').addClass('error').html(message);
                field.element.after($div);
            },
            "serialize" : function(){
                  var self          = this;
                  var placeholder   = '____PLACEHOLDER____';
                  var fns           = [];
                  var json          = JSON.stringify(this.options, function(key, value) {
                    if (typeof value === 'function') {
                      value = self._clear_string(value.toString());
                      fns.push('"' + value.toString() + '"');
                      return placeholder;
                    }
                    return value;
                  }, 2);
                  json = json.replace(new RegExp('"' + placeholder + '"', 'g'), function(_) {
                    return fns.shift();
                  });
                  return json;
            },
            "load" : function(){
                var self = this;
                $.each(this.options.fields, function(index, field) {
                    self._set_value(field);
                });
            },
            _set_value    : function(field){
                switch(field.type){
                    default:
                        this._set_value_text(field);
                    break;
                    case 'radio':
                        this._set_value_radio(field);
                    break;
                    case 'checkbox':
                        if(field.options){
                            this._set_value_checkbox_group(field);
                        }else{
                            this._set_value_checkbox(field);
                        }
                    break;
                }
            },
            "bind" : function(record){
                var self = this;
                $.each(record,function(key,value){
                    if(self.options.fields[key]){
                        self.options.fields[key].value = value;
                    }
                });
            },
            "set_options" : function(options){
                this.options = options;
                this.element.empty();
                this._create();
            },
            _set_value_text : function(field){
                var $element = field.element.find("[name=autoform_" + field.name + "]"); 
                $element.val(field.value).change();
            },
            _set_value_radio : function(field){
                var $element = field.element.find("#autoform_" + field.name + "_" + field.value);
                $element.prop("checked",field.value).change();
            },
            _set_value_checkbox : function(field){
                var $element = field.element.find("[name=autoform_" + field.name + "]"); 
                $element.prop("checked",field.value).change();
            },
            _set_value_checkbox_group : function(field){
                var $element = field.element; 
                $element.find('[name="autoform_' + field.name + '"]').prop("checked",false);
                if(field.value){
                    for(i=0;i<field.value.length;i++){
                        var value = field.value[i];
                        var $element_child = field.element.find("#autoform_" + field.name + "_" + value);
                        $element_child.prop("checked",true);
                    }
                    $element_child.change();
                }
            },
            _clear_string : function(str) {
                str = str.replace(/\s{2,}/g, ' ');
                str = str.replace(/\t/g, ' ');
                str = str.toString().trim().replace(/(\r\n|\n|\r)/g,"");
                str = str.replace(/"/g,"\\\"");
                return str;
            },
            "get_options" : function(){
                return this.options;
            },
            _encode        : function(data){
                  var b64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
                  var o1, o2, o3, h1, h2, h3, h4, bits, i = 0,
                    ac = 0,
                    enc = '',
                    tmp_arr = [];

                  if (!data) {
                    return data;
                  }

                  do { // pack three octets into four hexets
                    o1 = data.charCodeAt(i++);
                    o2 = data.charCodeAt(i++);
                    o3 = data.charCodeAt(i++);

                    bits = o1 << 16 | o2 << 8 | o3;

                    h1 = bits >> 18 & 0x3f;
                    h2 = bits >> 12 & 0x3f;
                    h3 = bits >> 6 & 0x3f;
                    h4 = bits & 0x3f;

                    // use hexets to index into b64, and append result to encoded string
                    tmp_arr[ac++] = b64.charAt(h1) + b64.charAt(h2) + b64.charAt(h3) + b64.charAt(h4);
                  } while (i < data.length);

                  enc = tmp_arr.join('');

                  var r = data.length % 3;

                  return (r ? enc.slice(0, r - 3) : enc) + '==='.slice(r || 3);
            }

        });
}(jQuery));

/* 

autoTable 1.0.0

---------------------------------------------------------------------------

Copyright (C) 2015 by Noercholis (http://www.noercholis.com)

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

(function( $ ) {
        $.widget("nubuntu.autoTable", {
            options : {
                title : null,
                async : true,
                max_text : 300,
                limit : 20,
                button_align : "left",
            },
            $container              : null,
            $title                  : null,
            $table                  : null,
            $thead                  : null,
            $tbody                  : null,
            $tfoot                  : null,
            $div_paging             : null,
            $ul_paging              : null,
            $div_dialog             : null,
            $div_busy               : null,
            $div_busy_message       : null,
            $form                   : null,
            $toolbar                : null,
            _dialog                 : null,
            _fields_size            : null,
            _current_page           : 1,
            _page_count             : 1,
            _total                  : 0,
            _records                : [],
            _table_key              : null,
            _list_params            : null,
            _create : function(){
                if(this.options.source){
                    var options = this._get_source();
                    $.extend(true, this.options, options);                    
                }
                this._init_fields();
                this._create_container();                
            },
            "reload" : function(){
                this.element.empty();
                this._create();
            },
            _get_source : function(){
                var params = {};
                this._do_ajax({autotable_action:'get_source'},function(data){
                    try {
                        params = JSON.parse(data);
                    } catch (e) {
                        return {};
                    }
                },{async:false});
                return params;
            },
            _init_fields      : function(){
                this._fields_size = Object.keys(this.options.fields).length;
            },
            _create_container : function(){
                this.$container = $('<div/>').addClass('panel panel-primary table-responsive').appendTo(this.element);
                this._create_busy_panel();
                this._create_title();
                this._create_table();
            },
            _create_busy_panel : function(){
                this.$div_busy = $('<div/>').addClass('autotable_busy_panel').hide().appendTo(this.$container);
                this._create_busy_message();
            },
            _create_busy_message : function(){
                this.$div_busy_message = $('<div/>').addClass('panel-heading autotable_busy_message')
                                                    .append('<span class="glyphicon glyphicon-refresh autotable_busy_message_animate"></span> Loading...')
                                                    .appendTo(this.$container);
            },
            _show_busy  : function(){
                this.$div_busy.width(this.$container.width())
                                .height(this.$container.height())
                                .show();
                this.$div_busy_message.width(this.$title.width())
                                        .height(this.$title.height())
                                        .show();
            },
            _hide_busy : function(){
                this.$div_busy_message.hide();
                this.$div_busy.hide();
            },
            _create_title : function(){
                if(!this.options.title){
                    this.options.title='';
                }
                this.$title = $("<div/>").addClass('panel-heading autotable_title')
                        .append('<h3 class="panel-title pull-left">' + this.options.title + '</h3>')
                        .appendTo(this.$container);
                this._create_toolbar();        
            },
            _create_toolbar    : function(){
                var $div        = $('<div/>').addClass('col-md-10 col-lg-10 col-sm-10 pull-right');
                this.$toolbar   = $('<div/>').addClass('row input-group').append(this._create_new_button()).appendTo($div);
                this.$title.append($div).append('<div class="clearfix"></div>');
            },
            _create_new_button : function(){
                var self = this;
                var $button = $('<button/>').addClass('btn btn-primary')
                            .append('<span class="glyphicon glyphicon-plus" aria-hidden="true"></span> Add New')
                            .click(function(){
                                self.add_new();
                            });
                return  $('<span>').addClass('input-group-btn').append($button);            
            },
            _create_table  : function(){
               this.$table = $('<table/>').addClass('table table-striped table-hover autotable_table').appendTo(this.$container);
               this._create_header();
               this._create_body();
               this._create_footer();
               this._create_dialog();
            },
            _create_header : function(){
                var self    = this;
                this.$thead = $("<thead/>");
                var $tr     = $("<tr/>");
                if(this.options.button_align=='left'){
                    $tr.append("<th></th>");
                }
                $.each(this.options.fields,function(index,field){
                    if(field.key){
                        self._table_key = index;
                    }
                    if(field.list===undefined || field.list!=false){
                        $tr.append(self._create_header_th(field));
                    }
                });
                if(this.options.button_align=='right'){
                    $tr.append("<th></th>");
                }
                this.$thead.append($tr).appendTo(this.$table);
            },
            _create_header_th : function(field){
                return $('<th/>').html(field.title);
            },
            _create_body   : function(){
                this.$tbody   = $("<tbody/>");
                this.$table .append(this.$tbody);
                if(!this.options.records){
                    this.$tbody.append(this._create_empty_row());
                }else{
                    this._create_records(this.options.records);                    
                }
            },
            _create_footer : function(){
                this.$tfoot  = $("<tfoot/>").appendTo(this.$table);
            },
            _create_dialog : function(){
                this.$form       = this._create_form();
                var self         = this;
                this.$div_dialog = $('<div/>').append(this.$form).addClass('autotable_dialog').css('z-index',1000);
                this.$div_dialog.dialog({
                                  autoOpen: false,
                                  height: 'auto',
                                  width: 600,
                                  modal: true,
                                  table:self,
                                 dialogClass:"no-titlebar",
                                  close: function() {
                                  }
                                });
            },
            _create_pagination : function(){
                var colspan             = this.$thead.find("tr:last").find("th").length;
                var $tr                 = $("<tr/>");
                this.$div_paging        = $("<div/>").addClass('autotable_pagination pull-right');
                this.$ul_paging         = $("<ul/>").addClass('pagination').appendTo(this.$div_paging);
                this._create_first_and_previous();
                var page_numbers = this._calculate_page_numbers(this._page_count);

                this._create_page_numbers(page_numbers);
                this._create_last_and_next();
                $tr.append($("<td/>").prop('colspan',colspan).append(this.$div_paging).append(this._create_pagination_detail()));
                this.$tfoot.empty().append($tr);
            },
            _create_pagination_detail : function(){
                var start = (this._current_page-1) * this.options.limit + 1;
                var end   = start + (this._records.length-1);
                var $div = $('<div/>').addClass('autotable_pagination_detail pagination-detail')
                                    .append('<span class="pagination-info">Showing ' + start + ' to ' + end + ' of ' + this._total + ' rows </span>')
                                    .append(this._create_pagination_page_list());
                return $div;                    
            },
            _create_pagination_page_list : function(){
                var self            = this;
                var $span_list      = $('<span/>').addClass('page-list');
                var $span_group     = $('<span/>').addClass('btn-group dropup').appendTo($span_list);
                var $button         = $('<button/>').addClass('btn btn-default dropdown-toggle').attr('data-toggle','dropdown')
                                                    .append('<span class="page-size">' + this.options.limit + '</span>')
                                                    .append(' ')
                                                    .append('<span class="caret"></span>')
                                                    .appendTo($span_group);
                var callback        = function(){
                                            var pages           = $(this).find('a').html();
                                            self.options.limit  = pages;
                                            $(this).closest('.btn-group').find('.page-size').html(pages);
                                            self.load();
                                        }
                var $ul             = $('<ul/>').addClass('dropdown-menu').attr('role','menu')
                                                .append($('<li><a href="javascript:void(0)">10</a></li>').click(callback))
                                                .append($('<li><a href="javascript:void(0)">25</a></li>').click(callback))
                                                .append($('<li><a href="javascript:void(0)">50</a></li>').click(callback))
                                                .append($('<li><a href="javascript:void(0)">100</a></li>').click(callback))
                                                .appendTo($span_group);
                return $span_list.append(' Records per page');                                
            },
            _create_first_and_previous  : function(){
                var self    = this;
                var $first  = $('<li/>')
                    .addClass('autotable_page_first')
                    .append($('<a/>').html('&lt&lt'))
                    .data('page_number', 1)
                    .css('cursor','pointer')
                    .click(function(){
                        var page_num = $(this).data('page_number');
                        self._load(page_num);
                    })
                    .appendTo(this.$ul_paging);

                var $previous = $('<li/>')
                    .addClass('autotable_page_previous')
                    .append($('<a/>').html('&lt'))
                    .data('page_number', this._current_page - 1)
                    .css('cursor','pointer')
                    .click(function(){
                        var page_num = $(this).data('page_number');
                        if(page_num>0){
                            self._load(page_num);
                        }
                    })
                    .appendTo(this.$ul_paging);

                if (this._current_page<= 1) {
                    $first.addClass('autotable_page_disabled');
                    $previous.addClass('autotable_page_disabled');
                }

            },
            _create_last_and_next : function () {
                var self    = this;
                var $next   = $('<li/>')
                    .addClass('autotable_page_next')
                    .append($('<a/>').html('&gt'))
                    .data('page_number', this._current_page + 1)
                    .css('cursor','pointer')
                    .click(function(){
                        var page_num = $(this).data('page_number');
                        if(page_num<=self._page_count){
                            self._load(page_num);
                        }
                    })
                    .appendTo(this.$ul_paging);
                var $last = $('<li/>')
                    .addClass('autotable_page_last')
                    .append($('<a/>').html('&gt&gt'))
                    .data('page_number', this._page_count)
                    .css('cursor','pointer')
                    .click(function(){
                        var page_num = $(this).data('page_number');
                        self._load(page_num);
                    })
                    .appendTo(this.$ul_paging);

                if (this._current_page >= this._page_count) {
                    $next.addClass('autotable_page_disabled');
                    $last.addClass('autotable_page_disabled');
                }
            },
            _create_page_numbers : function (page_numbers) {
                var previous_number = 0;
                for (var i = 0; i < page_numbers.length; i++) {
                    if ((page_numbers[i] - previous_number) > 1) {
                        $('<li/>')
                            .addClass('autotable_page_space')
                            .append($('<a/>').html('...'))
                            .appendTo(this.$ul_paging);
                    }
                    this._create_page_number(page_numbers[i]);
                    previous_number = page_numbers[i];
                }
            },
            _create_page_number : function (page_number) {
                var self        = this;
                var $pageNumber = $('<li/>')
                    .addClass('autotable_page_number')
                    .append($('<a/>').html(page_number))
                    .data('page_number', page_number)
                    .css('cursor','pointer')
                    .click(function(){
                        var page_num = $(this).data('page_number');
                        self._load(page_num);
                    })
                    .appendTo(this.$ul_paging);
                
                if (this._current_page == page_number) {
                    $pageNumber.addClass('autotable_page_number_active autotable_page_disabled active');
                }
            },
            _create_empty_row : function(){
                return $("<tr>\
                                <td colspan='" + this._fields_size + "'>\
                                    <div class=blankslate'>\
                                        <b>Data empty!</b>\
                                    </div>\
                                </td>\
                            </tr>")
            },
            _create_records : function(records){
                var self = this;
                $.each(records,function(index, record) {
                    self.$tbody.append(self._create_record(record));
                });
            },
            _create_record : function(record){
                var self = this;
                var $tr = $('<tr/>').addClass('autotable_row').data('record',record);
                if(this.options.button_align=='left'){
                    $tr.append($('<td/>').addClass('autotable_action').append(this._create_action()));
                }
                $.each(this.options.fields,function(field_name,field){
                    if(field.list===undefined || field.list!=false){
                        var text = record[field_name];
                        if(text!=null){
                            if(text.length>self.options.max_text){
                                text = text.substr(0,(self.options.max_text-3)) + '...';
                            }
                        }else{
                            text = '';
                        }
                        $tr.append('<td class="col_' + field_name + '">' + text + '</td>');
                    } 
                });
                if(this.options.button_align=='right'){
                    $tr.append($('<td/>').addClass('autotable_action').append(this._create_action()));
                }
                return $tr;

            },
            _create_action  : function(){
                var self            = this;
                var $div_action     = $('<div/>');
                var $edit_action    = $('<button/>').addClass('btn btn-info btn-xs').prop('title','Edit')
                                                .append('<span class="glyphicon glyphicon-edit"></span>')
                                                .click(function(){
                                                    var $tr     = $(this).closest('tr');
                                                    var record  = $tr.data('record');
                                                    var options = self._get_form_options('edit',$tr);
                                                    self.$form.autoForm('set_options',options).autoForm('bind',record).autoForm('load');
                                                    self.$div_dialog.dialog({title:'Edit record'}).dialog('open');
                                                });
                var $delete_action   = $('<button/>').addClass('btn btn-danger btn-xs').prop('title','Delete')
                                                .append('<span class="glyphicon glyphicon-trash"></span>')                
                                                .click(function(){
                                                    var $tr     = $(this).closest('tr');
                                                    var record  = $tr.data('record');
                                                    var options = self._get_form_options('delete',$tr);
                                                    self.$form.autoForm('set_options',options).autoForm('bind',record).autoForm('load');
                                                    self.$div_dialog.dialog({title:'Delete record'}).dialog('open');
                                                });
                return $div_action.append($edit_action).append(' ').append($delete_action);                                                    
            },
            "add_new"    : function(){
                var options = this._get_form_options('create');
                this.$form.autoForm('set_options',options);
                this.$div_dialog.dialog({title:'Add new record'}).dialog('open');
            },
            _create_form : function(){
                return $('<div/>').autoForm(this.options);
            },
            _get_form_options : function(action,$tr){
                var self        = this;
                var options     = this.$form.autoForm('get_options');
                var fields      = $.extend(true, {}, this.options.fields);
                var new_fields  = {autotable_action:{type:'hidden',value:'form_save'}};
                options.async       = true;
                options.action_save = this.options.source;
                options.buttons = {
                    close: {
                        title: "Cancel",
                        class: "btn-default",
                        icon: "glyphicon glyphicon-remove",
                        click: function(){
                            self.$div_dialog.dialog('close');
                        }
                    },
                    save: {
                        title:"Save",
                        class: "btn-primary",
                        icon: "glyphicon glyphicon-ok",
                        click: function(form){
                            if(form.validate()){
                                form.submit(function(data){
                                    if(data>0){
                                        switch(action){
                                            case 'edit':
                                                self._update_row($tr,form.get_data());
                                            break;
                                            case 'create':
                                                self._load(self._current_page);
                                            break;
                                            case 'delete':
                                                self._delete_row($tr);
                                            break;
                                        }
                                        self.$div_dialog.dialog('close');
                                    }else{
                                        alert('Save data failed...');
                                    }
                                });
                            }
                        }
                    }
                }; 
                switch(action){
                    case 'edit':
                        options.title = 'Edit Record';
                        $.each(fields,function(index,field){
                            edit = field.edit !== undefined ? field.edit : true;
                            if(!edit){   
                               field.type = 'hidden';     
                            }
                            new_fields[index] = field;
                        });
                    break;
                    case 'create':
                        options.title = 'Add New Record';
                        $.each(fields,function(index,field){
                            field.value    = null;
                            create = field.create !== undefined ? field.create : true;
                            if(!create){
                                field.type = 'hidden';    
                            }
                            new_fields[index] = field;
                        });
                    break;
                    case 'delete':
                        options.title = 'Are you sure ?'; 
                        options.buttons.save.title          = 'Delete';
                        new_fields.autotable_action.value   = 'form_delete';
                        new_fields['message'] = {
                            type:'caption',
                            title:'<span class="glyphicon glyphicon-warning-sign"></span> This record will be deleted, Are you sure ?'
                        };                       
                        $.each(fields,function(index,field){
                            if(field.key){
                                field.type = 'hidden';     
                                new_fields[index] = field;
                            }
                        });
                    break;
                }
                options.fields      = new_fields;
                return options;
            },
            _update_row     : function($tr,record){
                var self = this;
                $tr.data('record',record);
                $.each(this.options.fields,function(field_name,field){
                    if(field.list===undefined || field.list!=false){
                        var text = record[field_name];
                        if(text!=null){
                            if(text.length>self.options.max_text){
                                text = text.substr(0,(self.options.max_text-3)) + '...';
                            }
                        }else{
                            text = '';
                        }
                        $tr.find(".col_" + field_name).text(text);
                    } 
                });
                $tr.effect("highlight", {}, 3000);
            },
            _delete_row     : function($tr){
                $tr.effect("highlight", {}, 3000);                
                $tr.remove();                
                this._load(this._current_page);
            },
            _load   : function(page){
                page = page!==undefined?page:1;
                var self = this;
                this._show_busy();
                var data = this._get_list_params({autotable_page:page});
                this._do_ajax(data,function(data){
                    try{
                        data = JSON.parse(data);
                        self._on_load(data,page);
                        self._hide_busy();                    
                    }catch(e){
                        alert(e);
                        console.log(data);
                        self._hide_busy();                    
                    }
                });        
            },
            _get_list_params : function(options){
                var params          = {
                                        autotable_action    :'get_records',
                                        autotable_limit     : this.options.limit,
                                    };
                params              = $.extend(true, params, options);
                this._list_params   = $.extend(true,this._list_params,params);                       
                return this._list_params;        
            },
            _do_ajax : function(post_data,on_response,params){
                var options = {
                      url: this.options.source,
                      type: "POST",
                      data: post_data,
                      async: this.options.async,
                      success: function(data) {
                        on_response(data);
                      }
                };
                if(params!==undefined){
                    options = $.extend(true, options, params);                    
                }
                $.ajax(options);
            },
            _on_load : function(data,page){
                this.$tbody.empty();
                if(data.records!=null && data.records.length>=1){
                    this._records = data.records;
                    this._create_records(data.records);
                    if(data.total>=1){
                        this._current_page  = page;
                        this._total         = data.total;
                        this._page_count    = Math.floor(data.total/this.options.limit);
                        if(this._total>(this._page_count*this.options.limit)){
                            this._page_count++;
                        }
                    }
                    if(this._page_count>=1){
                        this._create_pagination();
                    }
                }else{
                    this.$tbody.append(this._create_empty_row());                    
                    this.$tfoot.empty();
                }
            },
            _get_confirm_dialog : function(title,message,callback){
                var $div = $('<div id="dialog-confirm" title="' + title + '">\
                            <p><span class="ui-icon ui-icon-alert" style="float:left; margin:0 7px 20px 0;"></span>\
                            ' + message + '</p></div>');
                return $div.dialog({
                              resizable: false,
                              height:'auto',
                              modal: true,
                              buttons: {
                                Yes: function() {
                                  $( this ).dialog( "close" );
                                    callback();
                                },
                                Cancel: function() {
                                  $( this ).dialog( "close" );
                                }
                              }
                            });
            },
            "load"  : function(){
                this._load(1);
            },
            _normalize_number: function (number, min, max, defaultValue) {
                if (number == undefined || number == null || isNaN(number)) {
                    return defaultValue;
                }

                if (number < min) {
                    return min;
                }

                if (number > max) {
                    return max;
                }

                return number;
            },
            _insert_to_array : function (array, value) {
                if ($.inArray(value, array) < 0) {
                    array.push(value);
                }
            },
            _calculate_page_numbers: function (pageCount) {
                if (pageCount <= 4) {
                    //Show all pages
                    var pageNumbers = [];
                    for (var i = 1; i <= pageCount; ++i) {
                        pageNumbers.push(i);
                    }

                    return pageNumbers;
                } else {
                    //show first three, last three, current, previous and next page numbers
                    var shownPageNumbers = [1, 2, pageCount - 1, pageCount];
                    var previousPageNo = this._normalize_number(this._current_page - 1, 1, pageCount, 1);
                    var nextPageNo = this._normalize_number(this._current_page + 1, 1, pageCount, 1);

                    this._insert_to_array(shownPageNumbers, previousPageNo);
                    this._insert_to_array(shownPageNumbers, this._current_page);
                    this._insert_to_array(shownPageNumbers, nextPageNo);
                    shownPageNumbers.sort(function (a, b) { return a - b; });
                    return shownPageNumbers;
                }
            },
            _encode        : function(data){
                  var b64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
                  var o1, o2, o3, h1, h2, h3, h4, bits, i = 0,
                    ac = 0,
                    enc = '',
                    tmp_arr = [];

                  if (!data) {
                    return data;
                  }

                  do { // pack three octets into four hexets
                    o1 = data.charCodeAt(i++);
                    o2 = data.charCodeAt(i++);
                    o3 = data.charCodeAt(i++);

                    bits = o1 << 16 | o2 << 8 | o3;

                    h1 = bits >> 18 & 0x3f;
                    h2 = bits >> 12 & 0x3f;
                    h3 = bits >> 6 & 0x3f;
                    h4 = bits & 0x3f;

                    // use hexets to index into b64, and append result to encoded string
                    tmp_arr[ac++] = b64.charAt(h1) + b64.charAt(h2) + b64.charAt(h3) + b64.charAt(h4);
                  } while (i < data.length);

                  enc = tmp_arr.join('');

                  var r = data.length % 3;

                  return (r ? enc.slice(0, r - 3) : enc) + '==='.slice(r || 3);
            },
        });
}(jQuery));

/** autoTable Advanced search extension 

**/
(function ($) {
    var base = {
        _create_toolbar : $.nubuntu.autoTable.prototype._create_toolbar,
    };
    $.extend(true, $.nubuntu.autoTable.prototype, {
        $div_search     : null,
        $search_input   : null,
        $search_button  : null,
        _search_list    : [],
        _search_option  : 'contain',
        options: {
            search:true,
        },
        _create_toolbar : function(){
            base._create_toolbar.apply(this,arguments);
            if(this.options.search){
                this._create_search();
            }
        },
        _create_search : function(){
            this.$div_search = $('<div/>').addClass('input-group pull-right').prependTo(this.$toolbar);
            this.$div_search.append(this._create_search_input())
                            .append(this._create_search_option())
                            .append(this._create_search_button());
            this.$div_search.find('.dropdown-menu').css({
                                                        'min-width':this.$div_search.width(),
                                                        'border':'none',
                                                        'box-shadow':'none',
                                                        'webkit-box-shadow':'none',
                                                        'background':'transparent',
                                                    })
                            .find('.form-control').removeClass('form-control');
        },
        _create_search_button : function(){
            var self            = this;
            this.$search_button = $('<button/>').addClass('btn btn-default')
                                        .append('<span class="glyphicon glyphicon-search" aria-hidden="true"></span>')
                                        .click(function(){
                                            var data    = {
                                                            autotable_search        : self.$search_input.val(),
                                                            autotable_search_list   : self._search_list,
                                                            autotable_search_option : self._search_option,
                                                        };
                                            self._list_params = $.extend(true, self._list_params, data);
                                            self.load(1);                                                                                                    
                                        });
            return  $('<span>').addClass('input-group-btn').append(this.$search_button);            
        },
        _create_search_option : function(){
            var $div             = $('<div/>').addClass('input-group-btn');
            var $dropdown        = $('<div>').addClass('dropdown').appendTo($div);
            var $dropdown_button = $('<button/>').addClass('btn btn-default dropdown-toggle')
                                                .attr('data-toggle','dropdown')
                                                .append('<span class="caret"></span>')
                                                .appendTo($dropdown);
            var $dropdown_menu    = $('<div/>').addClass('dropdown-menu dropdown-menu-right')
                                                .attr('role','menu')
                                                .append(this._create_search_option_form())
                                                .appendTo($dropdown);
            return $div;                                        
        },
        _create_search_option_form : function(){
            var self                    = this;
            var options                 = {title:'Filter By'};
            options.fields              = {
                                                search_list: {
                                                                    type:'checkbox',
                                                                    title:'',
                                                                    options:[],
                                                                    value:[],
                                                                    change:function(form,val){
                                                                        self._search_list = val;
                                                                    }
                                                                },
                                                search_option : {
                                                                    type:'radio',
                                                                    title:'Search Option',
                                                                    options:[
                                                                        {value:'contain',text:'Contains'},
                                                                        {value:'equal',text:'Equals'},
                                                                    ],
                                                                    default:'contain',
                                                                    change: function(form,val){
                                                                        self._search_option = val;
                                                                    }

                                                                }    
                                            };
            $.each(this.options.fields,function(key,field){
                if(field.searchable){
                    options.fields.search_list.value.push(key);
                    options.fields.search_list.options.push({value:key,text:field.title});
                }
            });
            return $('<div/>').addClass('form_search').autoForm(options).autoForm('load');
        },
        _create_search_input : function(){
            var self                  = this;
            return this.$search_input = $('<input/>').attr('type','text')
                                                    .attr('placeholder','Search...')
                                                    .css('min-width','250px')
                                                    .addClass('form-control autotable_input_search')
                                                    .keyup(function(e){
                                                        if(e.keyCode == 13)
                                                        {
                                                            self.$search_button.click();
                                                        }
                                                    });
        },
    });
    
})(jQuery);