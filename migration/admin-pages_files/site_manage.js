var SITE_MANAGE = function(){
	var type;
	var url_prefix = '/admin/ajax/site_manage/';
	var init = function(t){
		type = t;
		url_prefix = '/admin/ajax/site_manage/';
		if(type == 'main'){
			url_prefix = '/ajax/site_manage/';
		}else if(type=='site'){
			url_prefix = '/admin/ajax/site_manage/';
		}
	}; 
	var openDeleteSite = function(site_code){
		if(IS_MAIN) init('main');
		$.cocoaDialog.close();
		$.ajax({
			type : 'POST',
			data : {code : site_code},
			url : (url_prefix+'dialog_delete_site.cm'),
			dataType : 'json',
			async : false,
			cache : false,
			success : function(res){
				if(res.msg == 'SUCCESS'){
					var $html = $(res.html);
					$html.find('._confirm').on('click', function(){
						if (!$("#chk_agree").is(":checked")) return alert('사이트 삭제 정책 동의에 체크해 주셔야 삭제를 진행할 수 있습니다.');
						const passwd = $("#passwd").val();
						if(!passwd) return alert('비밀번호를 입력해주세요.');
						deleteSite(site_code, res.delete_key, passwd);
					});
					$.cocoaDialog.open({'type' : 'modal_site_delete', 'custom_popup' : $html});
				}else if(res.msg === 'site_deleted'){
					alert('삭제된 사이트입니다.');
					location.reload();
				}else
					alert(res.msg);
			}
		});
	};

	var deleteSiteFlag=false;
	var deleteSite = function(site_code, token, passwd){
		if (deleteSiteFlag) { alert(getLocalizeString("설명_버튼은1번만눌러주세요", "", "버튼은 1번만 눌러주세요")); return false; }
		deleteSiteFlag=true;
		$(".se-pre-con ._loader_text").text(
				getLocalizeString(
						"",
						"",
						"사이트를 삭제 중입니다. 잠시만 기다려주세요."
				)
		);
		$(".se-pre-con").css("display", "");
		$.ajax({
			type : 'POST',
			data : {'code' : site_code, 'token':token, 'passwd':passwd},
			url : (url_prefix+'delete_site.cm'),
			dataType : 'json',
			cache : false,
			success : function(result){
				$(".se-pre-con").css("display", "none");
				$(".se-pre-con ._loader_text").text(
						getLocalizeString(
								"사이트를구성중입니다",
								"",
								"사이트를 구성 중입니다. 잠시만 기다려주세요."
						)
				);
				deleteSiteFlag=false;
				if(result.msg == 'SUCCESS'){
					location.reload();
				} else if (result.msg === 'FREE_24HOURS_LIMIT') {
					var $html = $(result.html);
					$.cocoaDialog.close();
					$.cocoaDialog.open({'type': 'global_del', 'custom_popup': $html});
        } else if(result.msg === 'site_deleted'){
					alert('삭제된 사이트입니다.');
					location.reload();
				}else {
					alert(result.msg);
					$.cocoaDialog.close();
				}
			}
		});
	};

	var openAddUnit = function(site_code){
		$.ajax({
			type : 'POST',
			data : {'site_code' : site_code},
			url : (url_prefix+'dialog_add_unit.cm'),
			dataType : 'json',
			cache : false,
			success : function(res){
				if(res.msg == 'SUCCESS'){
					var $html = $(res.html);
					$html.find('._confirm').on('click',function(){
						addUnit();
					});
					$.cocoaDialog.open({'type': 'global_add', 'custom_popup': $html});
          (function () {
            const cocoaModalModifyByID = document.querySelector('#cocoaModal');
            cocoaModalModifyByID.style.display= "flex";
            cocoaModalModifyByID.style.justifyContent= "center";
          })();
				}else{
					alert(res.msg);
				}
			}
		});

	};

	var addUnit_flag=false;
	var addUnit = function(){
		$('.se-pre-con').css("display","");
		if (addUnit_flag) { alert(getLocalizeString("설명_버튼은1번만눌러주세요", "", "버튼은 1번만 눌러주세요")); return false; }
		var $f = $('#add_unit_form');
		var data = $f.serializeObject();
		addUnit_flag=true;
		$.ajax({
			type : 'POST',
			data : data,
			url : (url_prefix+'add_unit.cm'),
			dataType : 'json',
			cache : false,
			success : function(result){
				addUnit_flag=false;
				if(result.msg == 'SUCCESS'){
					location.reload();
				}else{
					alert(result.msg);
				}
				$('.se-pre-con').css("display","none");
			}
		});
	};

	var openDeleteUnit = function(site_code,unit_code){
		$.cocoaDialog.close();
		$.ajax({
			type : 'POST',
			data : {'site_code' : site_code, 'unit_code' : unit_code},
			url : (url_prefix+'dialog_delete_unit.cm'),
			dataType : 'json',
			async : false,
			cache : false,
			success : function(res){
				if(res.msg == 'SUCCESS'){
					var $html = $(res.html);
					$html.find('._confirm').on('click', function(){
						deleteUnit(site_code, unit_code, res.delete_key);
					});
					$.cocoaDialog.open({'type' : 'global_del', 'custom_popup' : $html});
				}else
					alert(res.msg);
			}
		});

	};
	
	var deleteUnit = function(site_code, unit_code, token){
		$.ajax({
			type : 'POST',
			data : {'site_code' : site_code, 'unit_code' : unit_code, 'token':token},
			url : (url_prefix+'delete_unit.cm'),
			dataType : 'json',
			async : false,
			cache : false,
			success : function(result){
				if(result.msg == 'SUCCESS'){
					if(result.move_default_unit){
						window.location.href='http://'+result.default_unit_domain+'/admin/'
					}else{
						location.reload();
					}
				}else{
					alert(result.msg);
				}
			}
		});
	};
  
  return {
		'init' : function(t){
			init(t);
		},
		'openAddUnit' : function(s){
			openAddUnit(s);
		},
		'openDeleteSite' : function(site_code){
			openDeleteSite(site_code);
		},
		'openDeleteUnit' : function(s,u){
			openDeleteUnit(s,u);
		},
	}
}();