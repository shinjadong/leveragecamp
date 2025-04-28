// 결제 비밀번호 관련
const PAYMENT_PASSWORD = (function(){
  /*
  * 비밀번호가 등록되어 있는지 확인하기
  * PAYMENT_PASSWORD.hasOwnPaymentPassword(type:string);
  * */
  const hasOwnPaymentPassword = (type="",site_location='main',access_location="imweb_main",site_code="",session_uid="")=>{
    const data = {
      access_location: access_location,
      site_code : site_code,
    };
    $.ajax({
      type: "POST",
      url: "/payment/payment_password/check_payment_password_exist.cm",
      data:data,
      dataType: "JSON",
      success: function (res) {
        switch (type) {
          case "auth":
            if(res.msg === "No Registered Payment Password"){
              if(access_location === "imweb_main"){
                if(confirm('등록된 결제비밀번호가 없습니다. 결제비밀번호를 등록하시겠습니까?')){
                  PAYMENT_PASSWORD.addOpenPopupPaymentPassWord(data);
                }
              } else {
                if(res.permission === "owner"){
                  if(confirm('등록된 결제비밀번호가 없습니다. 결제비밀번호를 등록하시겠습니까?')){
                    PAYMENT_PASSWORD.addOpenPopupPaymentPassWord(data);
                  }
                } else {
                  PAYMENT_PASSWORD.openPopUp(330,500,'/payment/payment_password/add_payment_password/manager_add_payment_error.cm',site_code,'site_admin');
                }  
              }
            } else if(res.msg === "SUCCESS") {
              //등록된 비밀번호가 있는 경우
              $.ajax({
                type: "POST",
                url: "/payment/payment_password/verify_fail_count.cm",
                data: data,
                dataType: "JSON",
                success: function (res) {
                  if (res.msg === 'SUCCESS') {
                    PAYMENT_PASSWORD.authOpenPopupPaymentPassWord();
                    return;
                  } else if(res.msg === 'Fail count over') {
                    if(access_location === "imweb_main"){
                      PAYMENT_PASSWORD.openPopUp(330,500,'/payment/payment_password/auth_by_password/over_count.cm?site_code='+site_code+'&access_location='+access_location,site_code,access_location);
                    } else {
                      if(res.permission === "owner"){
                        alert('10회 입력 오류 입니다. 비밀번호를 재설정합니다.');
                        PAYMENT_PASSWORD.openResetPaymentPasswordModal(session_uid,site_code,access_location);
                      } else {
                        PAYMENT_PASSWORD.openPopUp(330,500,'/payment/payment_password/auth_by_password/manager_over_count.cm',site_code,access_location);
                      }
                    }
                    return false;
                  } else {
                    alert('일시적인 오류 입니다.')
                  }
                },
                error : function (res){
                  console.log('error');
                  return false;
                }
              })
            } else {
              console.log(res.msg);
              alert("잘못된 접근입니다.");
            }
            break;
          case 'register':
            if(res.msg === "No Registered Payment Password"){
              if(access_location === "imweb_main"){
                if(confirm('등록된 결제비밀번호가 없습니다. 결제비밀번호를 등록하시겠습니까?')){
                  PAYMENT_PASSWORD.addOpenPopupPaymentPassWord(data);
                } else {
                  location.reload();
                }
              } else {
                if(res.permission === "owner"){
                  if(confirm('등록된 결제비밀번호가 없습니다. 결제비밀번호를 등록하시겠습니까?')){
                    PAYMENT_PASSWORD.addOpenPopupPaymentPassWord(data);
                  } else {
                    location.reload();
                  }
                } else {
                  PAYMENT_PASSWORD.openPopUp(330,500,'/payment/payment_password/add_payment_password/manager_add_payment_error.cm',site_code,'site_admin');
                }
              }
            } else if(res.msg === "SUCCESS") {
              if(site_location === "admin") {
                ADMIN_ADD_CARD.setValueQueryString();
              } else if(site_location === "my_page"){
                location.reload();
              }
            } else {
              console.log(res.msg);
              alert("잘못된 접근입니다.");
            }
          break;
        }
      },
      error : function (res){
        console.log(res);
      }
    })

  }
  /*
  * 사용자가 입력한 값 유지하기
  * */
  const setQueryValueFormInput = () =>{
    if(typeof site_info !== 'undefined'){
      const term = $("input[name=rdo_term_kind]:checked").val();
      const android = $("input[name=chk_android]:checked").val();
      const ios = $("input[name=chk_ios]:checked").val();
      const ios_period = $("input[name=ios_period]:checked").val();
      const dream = $("input[name=chk_auth_service_dream_security]:checked").val();
      const mobilians = $("input[name=chk_auth_service_mobilians]:checked").val();
      const inicis = $("input[name=chk_auth_service_inicis]:checked").val();
      const combination = $("input[name=chk_auth_service_combination]:checked").val();
      const data_url = `term=${term}&android=${android}&ios=${ios}&ios_period=${ios_period}&dream=${dream}&mobilians=${mobilians}&inicis=${inicis}&combination=${combination}`
      $("#reloadedValueCheck").attr("method","post");
      $("#reloadedValueCheck").attr("action","/price?payment&"+site_info.upgrade_version+"&"+data_url);
      $("#reloadedValueCheck > input[name=site_code]").val(site_info.site_code);
      $("#reloadedValueCheck > input[name=version]").val(site_info.upgrade_version);
    }
  }
  /*
  * 팝업창이 닫혔는지 확인하기
  * */
  const checkClosedChildPopupAndReload = (url, options) =>{
    PAYMENT_PASSWORD.setQueryValueFormInput();
    let child_popup = window.open(url,'popup',options);
    if(!child_popup || child_popup === null){
      alert('팝업 차단을 해제해주세요')
    } else {
      let check_popup_closed_interval = window.setInterval(function() {
        try {
          if( child_popup == null || child_popup.closed ) {
            window.clearInterval(check_popup_closed_interval);
            child_popup = null;
            window.location.reload();
          }
        } catch (e) { }
      }, 1000);  
    }
  }
  /*
  * 비밀번호 인증 팝업창 열기
  * */
  const authOpenPopupPaymentPassWord = () =>{
    const width = '330';
    const height = '500';
    const top = Math.ceil(( window.screen.height - height )/2);
    const left = Math.ceil(( window.screen.width - width )/2);
    const options = 'top='+ top +', left='+ left +', width='+ width +', height='+ height +', status=no, menubar=no, toolbar=no, resizable=no, ';
    window.open('/payment/payment_password/auth_by_password/index.cm','popup', options);
  }
  /*
  * 비밀번호 등록 팝업창 열기
  * data = [access_location,site_code] 필수 값
  * */
  const addOpenPopupPaymentPassWord = (data)=>{
    const access_location = data.access_location;
    const site_code = data.site_code;
    const width = '330';
    const height = '500';
    const top = Math.ceil(( window.screen.height - height )/2);
    const left = Math.ceil(( window.screen.width - width )/2);
    const options = 'top='+ top +', left='+ left +', width='+ width +', height='+ height +', status=no, menubar=no, toolbar=no, resizable=no, ';
    PAYMENT_PASSWORD.openPopUp(width,height,'/payment/payment_password/add_payment_password/index.cm',site_code,access_location);
  }
  /*
  * 비밀번호 변경하기
  * */
  const changePassWord = () =>{
    const width = '330';
    const height = '531';
    const top = Math.ceil(( window.screen.height - height )/2);
    const left = Math.ceil(( window.screen.width - width )/2);
    const options = 'top='+ top +', left='+ left +', width='+ width +', height='+ height +', status=no, menubar=no, toolbar=no, resizable=no, ';
    checkClosedChildPopupAndReload('/payment/payment_password/change_payment_password/check_previous_password.cm', options);
  }
  /*
  * 이메일로 비밀번호 초기화
  * */
  const openResetPaymentPasswordModal = (session_id='',site_code='',access_location='') =>{
    const width = '330';
    const height = '486';
    const top = Math.ceil(( window.screen.height - height )/2);
    const left = Math.ceil(( window.screen.width - width )/2);
    const options = 'top='+ top +', left='+ left +', width='+ width +', height='+ height +', status=no, menubar=no, toolbar=no, resizable=no, ';
    checkClosedChildPopupAndReload('/payment/payment_password/reset_payment_password/index.cm?sessionKey='+session_id +'&site_code=' + site_code+'&access_location='+ access_location ,options);
  }

  const openPopUp = (props_width=330,props_height=500,url="/payment",site_code="", access_location="") =>{
    const data = {
      'site_code' : site_code,
      'access_location' : access_location,
    }
    const width = props_width;
    const height = props_height;
    const top = Math.ceil(( window.screen.height - height )/2);
    const left = Math.ceil(( window.screen.width - width )/2);
    const options = 'top='+ top +', left='+ left +', width='+ width +', height='+ height +', status=no, menubar=no, toolbar=no, resizable=no, ';
    $.ajax({
      type: "POST",
      url: "/payment/payment_password/verify_fail_count.cm",
      data: data,
      dataType: "JSON",
      success: function (res) {
        if (res.msg === 'SUCCESS') {
          return true;
        } else {
          url = '/payment/payment_password/error.cm';
          return false;
        }
      },
      error : function (res){
        url = '/payment/payment_password/error.cm';
        console.log('error');
        return false;
      }
    })
    checkClosedChildPopupAndReload(url, options);
  }
  /**
   * Usage : PAYMENT_PASSWORD.openModal(url='',data='',width,modal_type,call_back)
   * */
  const openModal = (url='',data='',width,modal_type='default',call_back) =>{
    $.ajax({
      type: "POST",
      url: url,
      data: data,
      dataType: "JSON",
      success: function (res) {

        $.cocoaDialog.open({ type: modal_type, custom_popup: res.html, pc_width: width },function(){
          if(width < 300){
            const modal_dialog = document.querySelector('.modal-dialog');
            modal_dialog.style.width = width;
          }
          if(typeof call_back === 'function'){
            call_back;
          }
        });
      },
      error : function (res){
        console.log(res);
      }
    })
  }
  
  return {
    hasOwnPaymentPassword: function (type,site_location,access_location,site_code,session_uid) {
      hasOwnPaymentPassword(type,site_location,access_location,site_code,session_uid);
    },
    setQueryValueFormInput: function () {
      setQueryValueFormInput();
    },
    authOpenPopupPaymentPassWord: function () {
      authOpenPopupPaymentPassWord();
    },
    addOpenPopupPaymentPassWord: function (data) {
      addOpenPopupPaymentPassWord(data);
    },
    changePassWord: function () {
      changePassWord();
    },
    openResetPaymentPasswordModal: function (session_id,site_code,access_location) {
      openResetPaymentPasswordModal(session_id,site_code,access_location);
    },
    openModal: function (url,data,width,call_back,modal_type) {
      openModal(url,data,width,call_back,modal_type);
    },
    openPopUp: function (props_width,props_height,url,site_code,access_location) {
      openPopUp(props_width,props_height,url,site_code,access_location);
    },
  }
})();


const PAYMENT_KEYPAD = (function(){
  const cb_keyPad = (click_flag,submitPassWordArray,click_target_array,return_array)=>{
    const _input_view_items = document.querySelectorAll('._input_view_container > div');
    click_target_array = [...event.currentTarget.classList];
    if(typeof _input_view_items !== 'undefined' && typeof click_flag !== 'undefined'){
      _input_view_items[click_flag].classList.remove('tw-bg-line-500');
      _input_view_items[click_flag].classList.add('tw-bg-primary-500');
      submitPassWordArray.push(click_target_array[click_target_array.length-1].split('Secure__')[1]);
      if(click_flag >3){
        click_flag = 0;
        submitPassWordArray = [];
      } else {
        ++click_flag;
      }
      return_array['click_flag'] = click_flag;
      return_array['submitPassWordArray'] = submitPassWordArray;
    }
  }

  /**
   * click_flag : boolean;
   * submitPassWordArray : Array;
   * type : string;
   * is_change_popup : boolean; default = false
   * access_location : string
   * site_code : string
   * */
  const ImwebKeyPad = function(click_flag,submitPassWordArray,type,is_change_popup,access_location="",site_code=""){
    hideAlertMsg();
    let click_target_array = [];
    let return_array = [];
    if( click_flag >4){
      return false;
    } else if(click_flag === 4){
      cb_keyPad(click_flag,submitPassWordArray,click_target_array,return_array);
      submitPassWord(click_flag,submitPassWordArray,type,is_change_popup,access_location,site_code);
      return return_array;
    } else {
      if( click_flag > 2 ){
        openAlphabetKeyPad();
      } else {
        openNumberKeyPad();
      }
      cb_keyPad(click_flag,submitPassWordArray,click_target_array,return_array);
      return return_array;
    }
  }
  const openAlphabetKeyPad = ()=>{
    const key_pad_number = document.querySelector('#key_pad_number');
    const key_pad_alphabet = document.querySelector('#key_pad_alphabet');
    key_pad_number.classList.add('tw-hidden');
    key_pad_alphabet.classList.remove('tw-hidden');
  }
  const openNumberKeyPad = ()=>{
    const key_pad_number = document.querySelector('#key_pad_number');
    const key_pad_alphabet = document.querySelector('#key_pad_alphabet');
    key_pad_number.classList.remove('tw-hidden');
    key_pad_alphabet.classList.add('tw-hidden');
  }
  const deleteOneItem = (click_flag,submitPassWordArray)=>{
    const return_array = [];
    const _input_view_items = document.querySelectorAll('._input_view_container > div');
    if(click_flag === 0 || !click_flag){
      return false;
    } else {
      if(click_flag > 4 ){
        openAlphabetKeyPad();
      } else {
        openNumberKeyPad();
      }
      click_flag--;
      submitPassWordArray.pop();
      _input_view_items[click_flag].classList.add('tw-bg-line-500');
      _input_view_items[click_flag].classList.remove('tw-bg-primary-500');
      return_array['click_flag'] = click_flag;
      return_array['submitPassWordArray'] = submitPassWordArray;
      return return_array;
    }
  }
  const deleteAllItem = (click_flag) =>{
    const _input_view_items = document.querySelectorAll('._input_view_container > div');
    if(click_flag === 0){
      return false;
    } else {
      openNumberKeyPad();
      _input_view_items.forEach(el =>{
        el.classList.add('tw-bg-line-500');
        el.classList.remove('tw-bg-primary-500');
      })
    }
  }
  const showAlertMsg = (alert_text) =>{
    const _password__alert_img = document.querySelector('._password__alert-container > img');
    const _password__alert_msg = document.querySelector('._password__alert-msg');
    _password__alert_img.classList.remove('tw-hidden');
    _password__alert_msg.classList.add('tw-text-danger-500');
    _password__alert_msg.innerHTML = alert_text;
  }
  const hideAlertMsg = () =>{
    const _password__alert_img = document.querySelector('._password__alert-container > img');
    const _password__alert_msg = document.querySelector('._password__alert-msg');
    _password__alert_img.classList.add('tw-hidden');
    _password__alert_msg.classList.remove('tw-text-danger-500');
    _password__alert_msg.innerText = '숫자 4자, 알파벳 1자를 입력해주세요.';
  }
  const submitPassWord = (click_flag, submitPassWordArray,type="",is_change_popup=false,access_location="",site_code="") =>{
    const data = {
      'payment_password' : Object.assign({}, submitPassWordArray),
      'access_location': access_location,
      'site_code': site_code,
      'request_type': type,
    }
    let back_url = undefined;
    let popup_url = undefined;
    let last_step = undefined;
    switch (type){
      case "register_first" :
        back_url = "/payment/payment_password/receive_decrypt_password.cm";
        popup_url = `/payment/payment_password/add_payment_password/password_confirm.cm?site_code=${site_code}&access_location=${access_location}`;
        break;
      case "register_confirm" :
        back_url = "/payment/payment_password/receive_decrypt_password.cm";
        popup_url = `/payment/payment_password/add_payment_password/password_confirm.cm?site_code=${site_code}&access_location=${access_location}`;
        last_step = true;
        break;
      case "auth_payment" :
        back_url = "/payment/payment_password/receive_decrypt_password.cm";
        popup_url = `/payment/payment_password/add_payment_password/password_confirm.cm?site_code=${site_code}&access_location=${access_location}`;
        last_step = true;
        break;
      case "auth_modify" :
        back_url = "/payment/payment_password/receive_decrypt_password.cm";
        popup_url = `/payment/payment_password/change_payment_password/change_password.cm?site_code=${site_code}&access_location=${access_location}`;
        break;
      default :
        back_url = "/payment/payment_password/receive_decrypt_password.cm";
        popup_url = `/payment/payment_password/add_payment_password/password_confirm.cm?site_code=${site_code}&access_location=${access_location}`;
    }
    $.ajax({
      type: "POST",
      url: back_url,
      data: data,
      async: false,
      dataType: "JSON",
      success: function (res) {
        switch (type){
          case "register_first" :
            console.log(res);
            if(res.msg === "SUCCESS"){
              PAYMENT_PASSWORD.openPopUp(330, 500, popup_url);
            } else if(res.msg === "Validation ERROR"){
              if(submitPassWordArray[0] === submitPassWordArray[1] && submitPassWordArray[1] === submitPassWordArray[2] && submitPassWordArray[2] === submitPassWordArray[3]){
                showAlertMsg("동일한 숫자 4자리는 사용할 수 없습니다.");
              } else {
                showAlertMsg("연속된 숫자 4자리는 사용할 수 없습니다.");  
              }
              PAYMENT_KEYPAD.deleteAllItem(click_flag);
            } else if(res.msg === "Two different keypad ERROR"){
              alert("다른 곳에서 비밀번호 입력을 시도하고 있습니다.");
              self.close();
            } else {
              showAlertMsg("일시적인 오류 입니다. 다시 시도 해주세요.");
              PAYMENT_KEYPAD.deleteAllItem(click_flag);
              console.log(res.msg);
            }
            break;
          case "register_confirm" :
            if(res.msg === "SUCCESS"){
              PAYMENT_KEYPAD.openResultModal(res.msg, type);
            } else if(res.msg === "Two different keypad ERROR"){
              alert("다른 곳에서 비밀번호 입력을 시도하고 있습니다.");
              self.close();
            } else {
              const password__alert_img = document.querySelector('._password__alert-container > img');
              const password__alert_msg = document.querySelector('._password__alert-msg');
              password__alert_msg.classList.add('tw-text-danger-500');
              password__alert_img.classList.remove('tw-hidden');
              password__alert_msg.innerText = "입력한 결제비밀번호가 다릅니다."
              PAYMENT_KEYPAD.deleteAllItem(click_flag);
            }
            break;
          case "auth_payment" :
            if(res.msg === "SUCCESS"){
              const payment_submit_form = window.opener.document.querySelector('#payment_submit_form');
              payment_submit_form.submit();
              self.close();
            } else if(res.msg === "Two different keypad ERROR") {
              alert("다른 곳에서 비밀번호 입력을 시도하고 있습니다.");
              self.close();
            } else if(res.msg === "No Registered Payment Password"){
              alert("등록된 결제비밀번호가 존재하지 않습니다.");
              self.close();
            } else if(res.msg === "Wrong password ERROR") {
              if(res.count === 10){
                PAYMENT_KEYPAD.deleteAllItem(click_flag);
                if(access_location === "imweb_main"){
                  PAYMENT_PASSWORD.openPopUp(330,500,'/payment/payment_password/auth_by_password/over_count.cm?site_code='+site_code+'&access_location='+access_location,site_code,access_location);
                } else {
                  if(res.permission === "owner"){
                    PAYMENT_PASSWORD.openPopUp(330,500,'/payment/payment_password/auth_by_password/over_count.cm?site_code='+site_code+'&access_location='+access_location,site_code,access_location);
                  } else {
                    PAYMENT_PASSWORD.openPopUp(330,500,'/payment/payment_password/auth_by_password/manager_over_count.cm?site_code='+site_code+'&access_location='+access_location,site_code,access_location);
                  }
                }
                return;
              }
              const password__alert_img = document.querySelector('._password__alert-container > img');
              const password__alert_msg = document.querySelector('._password__alert-msg');
              password__alert_msg.classList.add('tw-text-danger-500');
              password__alert_img.classList.remove('tw-hidden');
              password__alert_msg.innerText = "비밀번호를 잘못 입력하셨습니다. (" + res.count + "/10)"
              PAYMENT_KEYPAD.deleteAllItem(click_flag);
            } else if (res.msg === "Wrong password Too many times ERROR"){
              PAYMENT_PASSWORD.openPopUp(330,500,'/payment/payment_password/auth_by_password/over_count.cm?site_code='+site_code+'&access_location='+access_location,site_code,access_location);
            } else {
              console.log(res);
            }
            break;
          case "auth_modify" :
            console.log(res);
            if(res.msg === "SUCCESS"){
              PAYMENT_PASSWORD.openPopUp(330,500,popup_url);
              PAYMENT_KEYPAD.deleteAllItem(click_flag);
            } else if(res.msg === "Two different keypad ERROR"){
              alert("다른 곳에서 비밀번호 입력을 시도하고 있습니다.");
              self.close();
            } else if(res.msg === "No Registered Payment Password"){
              alert("등록된 결제비밀번호가 존재하지 않습니다.");
              self.close();
            } else if(res.msg === "Wrong password Too many times ERROR"){
              PAYMENT_PASSWORD.openPopUp(330,500,'/payment/payment_password/auth_by_password/over_count.cm?site_code='+site_code+'&access_location='+access_location,site_code,access_location);
            } else if (res.count === 10){
              PAYMENT_KEYPAD.deleteAllItem(click_flag);
              if(access_location === "imweb_main"){
                PAYMENT_PASSWORD.openPopUp(330,500,'/payment/payment_password/auth_by_password/over_count.cm?site_code='+site_code+'&access_location='+access_location,site_code,access_location);
              } else {
                if(res.permission === "owner"){
                  PAYMENT_PASSWORD.openPopUp(330,500,'/payment/payment_password/auth_by_password/over_count.cm?site_code='+site_code+'&access_location='+access_location,site_code,access_location);
                } else {
                  PAYMENT_PASSWORD.openPopUp(330,500,'/payment/payment_password/auth_by_password/manager_over_count.cm');
                }
              }
              return;
            } else {
              const password__alert_img = document.querySelector('._password__alert-container > img');
              const password__alert_msg = document.querySelector('._password__alert-msg');
              password__alert_msg.classList.add('tw-text-danger-500');
              password__alert_img.classList.remove('tw-hidden');
              password__alert_msg.innerText = "비밀번호를 잘못 입력하셨습니다. (" + res.count + "/10)"
              PAYMENT_KEYPAD.deleteAllItem(click_flag);
            }
            break;
          default :
            self.close();
        }
      },
      error: function(res){
        showAlertMsg("잠시 후 다시 시도해주세요.");
        return PAYMENT_KEYPAD.deleteAllItem(click_flag);
      }
    })
  }

  /**
   * msg : string // ajax에 대한 response message입니다.
   * type : string // 함수가 호출되는 파일에서 전달되는 인자 값입니다.
   * */
  const openResultModal = (msg, type)=>{
    $('button').attr("disabled", true);
    const data = {
      'type': type,
      'msg': msg,
    }
    $.ajax({
      type: "POST",
      url: "/payment/payment_password/auth_result_modal/response_modal.cm",
      data: data,
      dataType: "JSON",
      success: function (res) {
        $.cocoaDialog.open({type : 'response' , custom_popup : res.html, pc_width: 375 }, function(){
        })
      },
      error : function (res){
        console.log(res);
      },
      complete: function(){
        $('button').attr("disabled", false);
      }
    })
  }

  return {
    ImwebKeyPad: function (click_flag,submitPassWordArray,type,is_change_popup,access_location,site_code) {
      return ImwebKeyPad(click_flag,submitPassWordArray,type,is_change_popup,access_location,site_code);
    },
    deleteOneItem: function (click_flag,submitPassWordArray) {
      return deleteOneItem(click_flag,submitPassWordArray);
    },
    openResultModal : function(msg, type){
      openResultModal(msg, type);
    },
    deleteAllItem : function(click_flag){
      return deleteAllItem(click_flag);
    },
  }
})();

const PAYMENT_PASSWORD_COMMON = (function(){
  /*
  * Usage: PAYMENT_PASSWORD_COMMON.getAccessLocation()
  * return : string ::=> "site_admin" / "imweb_main"
  * */
  const getAccessLocation = ()=>{
    const is_admin = document.querySelector("#dashboard_loader") ? true : false;
    const access_location = is_admin ? "site_admin" : "imweb_main";  
    return access_location;
  }
  /*
  * Usage : PAYMENT_PASSWORD_COMMON.verificationElement(target,target_value) 
  * */
  const verificationElement = (target,target_value) =>{
    const value = target ? target_value : "";
    return value
  }
  return {
    getAccessLocation: function () {
      return getAccessLocation();
    },
    verificationElement: function (target,target_value) {
      return verificationElement(target,target_value);
    },  
  }
})();