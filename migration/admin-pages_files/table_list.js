var TABLE_LIST = function(){


	var that, table_obj, selected_class, thead, tbody, all_check, all_chk_len, default_header, select_header,
		select_cnt_obj, mobile_header;

	var check_idx;

	var init = function(obj){
		that = this;
		table_obj = obj;
		check_idx = [];
		selected_class = 'selected';
		thead = table_obj.find('._thead');
		tbody = table_obj.find('._tbody');
		default_header = $('#default_header');
		select_header = $('#select_header');
		mobile_header = $('#mobile_header');
		select_cnt_obj = $('#select_cnt');
		all_check = table_obj.find('._all_check');
		all_chk_len = tbody.find('input:checkbox').length;
	};

	var checkAction = function(callback){
		var item = [];
		tbody.find('input:checkbox:checked').each(function() {
			item.push($(this).val());
		});
		return callback(item);
	};

	var checkActionWithIsDeleteAuthLog = function(callback){
		var item = [];
		tbody.find('input:checkbox:checked').each(function() {
			item.push( {
				'member_code': $(this).val(),
				'delete_old_auth_log': $(this).data('deleteOldAuthLog') ? true : false
			} );
		});
		return callback(JSON.stringify(item));
	};

	var checkActionWithBoardCode = function(callback){
		var item = [];
		var item2 = [];
		tbody.find('input:checkbox:checked').each(function() {
			item.push($(this).val());
			item2.push($(this).attr('data-board_code'));
		});
		return callback(item, item2);
	};


	var checkItem = function(callback){
		tbody = table_obj.find('._tbody');
		var chk_len = tbody.find('input:checkbox:checked').length;
		check_idx = [];
		tbody.find('input:checkbox:checked').each(function(){
			check_idx.push($(this).data('idx'));
		});
		if(chk_len>0){
			select_header.show();
			default_header.hide();
			mobile_header.hide();
		}else{
			select_header.hide();
			default_header.show();
			mobile_header.show();
		}
		select_cnt_obj.text(chk_len);
		if(all_chk_len != chk_len)
			all_check.prop('checked',false);

		if(typeof callback == 'function'){
			callback(check_idx);
		}
	};

	var getCheckIdx = function(){
		return 	check_idx;
	};
	var allCheckToggle = function(callback){
		if(all_check.prop('checked')){
			allCheckItem(callback);
		}else{
			cancelCheckItem(callback);
		}
	};
	var allCheckItem = function(callback){
		table_obj.find('input:checkbox').prop('checked',true);
		all_check.prop('checked',true);
		checkItem(callback);
	};
	var cancelCheckItem = function(callback){
		table_obj.find('input:checkbox').prop('checked',false);
		all_check.prop('checked',false);
		checkItem(callback);
	};

	return {
		init: function(obj) {
			init(obj);
		},
		checkItem: function(callback){
			checkItem(callback);
		},
		allCheckItem : function(callback){
			allCheckItem(callback);
		},
		allCheckToggle : function(callback){
			allCheckToggle(callback);
		},
		cancelCheckItem : function(callback){
			cancelCheckItem(callback);
		},
		checkAction : function(callback){
			return checkAction(callback);
		},
		checkActionWithIsDeleteAuthLog : function(callback){
			return checkActionWithIsDeleteAuthLog(callback);
		},
		checkActionWithBoardCode : function(callback){
			return checkActionWithBoardCode(callback);
		},
		pushItem : function(callback){
			return pushItem(callback);
		},
		getCheckIdx : function(){
			return getCheckIdx();
		}
	};


}();