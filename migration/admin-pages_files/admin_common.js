//setColorPicker
(function () {
	/**
	 * o.event      - event 목록
	 * o['default']    - default value
	 * o.change     - event callback function
	 *
	 * @param el
	 * @param o
	 */
	var colorPicker = function (el, o) {
		this.id = makeUniq(); //makeUniq();
		this.element = $(el);
		this.o = o;
		this.value;
		this.color;
		this.$container = {};
		this.MAX_RECENT_COLOR_COUNT = 7; // 최근 사용 컬러 표시 수
		this.defaults = {
			'value': '',
			'mode': 'input',
			'class': 'doz-colorpicker',
			'disable': false,
			'horizontal': true,
			'format': 'rgba',
			'container': 'body',
			'default_hex': '#000',
			'brand_color': '#000',
			'hooks': {},
		};
		this.options = $.extend(this.defaults, o);

		this.template = '<div class="colorpicker dropdown-menu">' +
			'<div class="colorpicker-saturation"><i><b></b></i></div>' +
			'<div class="color-wrap">' +
			'<div class="colorpicker-color"><div /></div>' +
			'</div>' +
			'<div class="hue-alpha-wrap">' +
			'<div class="colorpicker-hue"><i></i></div>';
		if (this.options.format != 'hex') { // alpha picker를 사용할 때
			this.template += '<div class="colorpicker-alpha"><i></i></div>';
		}
		this.template += '</div>' +
			'<div class="colorpicker-selectors"></div>' +
			'</div>';

		this.init();
	};

	colorPicker.prototype.init = function () {
		var that = this;

		that.options.value = that.getColorString(that.options.value);

		// 최근 사용 컬러
		var recentColor = localStorage.getItem('recentColor');
		var recentColorArray = [];
		if (recentColor) {
			try {
				recentColorArray = JSON.parse(recentColor);
			} catch (e) {
				// localStorage에 옳지 않은 값이 있을 경우 초기화
				localStorage.removeItem('recentColor');
			}
		}
		that.options.recent_color = recentColorArray;

		that.makeColorPicker();

		if (that.options.disable == true) {
			this.disable();
		}
	};


	colorPicker.prototype.getColorString = function (value) {
		if (this.options.default_hex == '' && value == '') {
			return '';
		} else {
			if (value == '')
				value = this.options.default_hex;
			var color = tinycolor(value);
			var alpha = color.getAlpha();
			// 투명도 5% 단위로 조절
			alpha = Math.floor(Math.round(alpha * 20)) / 20;
			color = color.setAlpha(alpha);
			if (alpha < 1) {
				return color.toRgbString();
			} else {
				return color.toHexString('hex');
			}
		}
	};

	colorPicker.prototype.stop = function (data) {
		var that = this;
		that.value = data;
		if (typeof that.o.stop == 'function')
			that.o.stop(data);

		if (data != that.brand_color) { // 브랜드 컬러와 동일할 경우 업데이트하지 않음
			var recentColor = localStorage.getItem('recentColor');
			var recentColorArray = [];
			if (!recentColor) { // localStorage에 최근 사용 컬러가 없을 경우 저장
				recentColorArray.unshift(data);
			} else {
				try {
					recentColorArray = JSON.parse(recentColor);
					// 기존에 중복된 컬러가 존재 시 제거
					if (recentColorArray.indexOf(data) != -1) {
						recentColorArray.splice(recentColorArray.indexOf(data), 1);
					}
					recentColorArray.unshift(data);
					if (recentColorArray.length > that.MAX_RECENT_COLOR_COUNT) {
						recentColorArray.pop();
					}
				} catch (e) { // localStorage에 옳지 않은 값이 있을 경우 초기화 후 최근 사용 컬러 저장
					localStorage.removeItem('recentColor');
					recentColorArray.unshift(data);
				}
			}
			var recentColorJson = JSON.stringify(recentColorArray);
			localStorage.setItem('recentColor', recentColorJson);
		}
	};


	colorPicker.prototype.change = function (data) {
		this.value = data;
		if (typeof this.o.change == 'function')
			this.o.change(data);
	};

	colorPicker.prototype.get = function () {
		return this.value;
	};

	colorPicker.prototype.create = function () {
		var that = this;
		if (typeof that.o.create == 'function')
			that.o.create({
				'$input': that.$container.find('input'),
				'$container': that.$container
			});
	};

	colorPicker.prototype.hideContainer = function () {
		this.$container.hide();
	};

	colorPicker.prototype.makeColorPicker = function () {
		var that = this;

		that.makeInputButton();

		that.$container = $('<div />').addClass(that.options['class']).attr('id', that.id).hide();
		var $picker_wrap = $('<div class="_picker_wrap"/>');
		var $input_wrap = $('<div class="input"><input type="text" class="dz-form-control" /></div>');
		var $input = $input_wrap.find('input');
		$input.off('keypress').on('keypress', function (e) {
			if (checkEnter(e)) {
				var _rgba = that.getColorString($(this).val());
				$(this).val(_rgba);
				that.stop(_rgba);
				that.options.value = _rgba;
				$picker_wrap.colorpicker('setValue', _rgba);
			}
		});

		that.options.value = that.options.value == '' ? that.options.default_hex : that.options.value;

		$input.val(that.getColorString(that.options.value));
		$picker_wrap
			.colorpicker({
				color: that.options.value,
				container: true,
				inline: true,
				horizontal: that.options.horizontal,
				template: that.template,
				format: that.options.format,
				sliders: {
					saturation: {
						maxLeft: 200,
						maxTop: 200,
						callLeft: 'setSaturation',
						callTop: 'setBrightness'
					},
					hue: {
						maxLeft: 0,
						maxTop: 200,
						callLeft: false,
						callTop: 'setHue'
					},
					alpha: {
						maxLeft: 0,
						maxTop: 200,
						callLeft: false,
						callTop: 'setAlpha'
					}
				},
				slidersHorz: {
					saturation: {
						maxLeft: 200,
						maxTop: 200,
						callLeft: 'setSaturation',
						callTop: 'setBrightness'
					},
					hue: {
						maxLeft: 161,
						maxTop: 0,
						callLeft: 'setHue',
						callTop: false
					},
					alpha: {
						maxLeft: 161,
						maxTop: 0,
						callLeft: 'setAlpha',
						callTop: false
					}
				}
			})
			.off('changeColor.colorpicker')
			.on('changeColor.colorpicker', function (e) {

				var $hue_slider = that.$container.find('.colorpicker-hue i');
				var $saturation = that.$container.find('.colorpicker-saturation');
				// hue slider가 우측 끝에 있을 떄 saturation 배경이 slider가 아니라 picker에 따라 변경되는 현상이 있어 saturation 배경 고정
				if ($hue_slider.css('left)') == '161px') $saturation.css('background-color', 'rgb(255, 0, 0)');

				// hooks - change Event
				if (that.options.hooks.change && typeof that.options.hooks.change == "function") {
					that.options.hooks.change(e);
				}

				var _color = that.getColorString(e.color.toString());
				if (that.options.default_hex == '' && (_color == 'rgba(0, 0, 0, 0)' || _color == 'rgba(0,0,0,0)' || _color == 'transparent')) {
					_color = '';
				} else if (that.options.format == 'hex') {
					_color = tinycolor(_color).setAlpha(1).toHexString();
				}

				that.change(_color);
				$input.val(_color);

				that.updateInputButton(_color);
				that.updatePreset();
			});

		$picker_wrap.append($input_wrap);
		that.$container
			.empty()
			.css('position', 'absolute')
			.append($picker_wrap);

		$(that.options.container).append(that.$container);


		var hideContainer = function () {
			var _rgba = '';
			if (that.options.default_hex == '' && $input.val() == '') {
				_rgba = '';
			} else {
				var _color = tinycolor($input.val());
				_rgba = _color.toString();
			}


			that.stop(_rgba);
			that.options.value = _rgba;
			$('body').data('colorpicker', 'N');
			that.$container.hide();
			$(window).off('resize.' + that.id);
			$(document).off('scroll.' + that.id);
			$('#cocoaModal, #cocoaSubModal').off('scroll.' + that.id);
			$(document).off('mousedown.' + that.id);
		};

		var setPosition = function () {
			var width = that.element.outerWidth();
			var offset = that.element.offset();

			var height = that.element.outerHeight();
			var window_height = $(window).height();
			var window_width = $(window).width();
			var window_scroll = $(window).scrollTop();
			var select_offset_t = offset.top - window_scroll; //절대적인 화면상의 좌표
			var select_offset_l = offset.left; //절대적인 화면상의 좌표
			var select_container_h = that.$container.outerHeight();
			var select_container_w = that.$container.outerWidth();

			var obj_h = Math.round(select_offset_t + height + select_container_h); //절대적 화면상의 좌표에서 설렉트박스의 높이와 옵션의 높이의 합( 옵션이 열렸을때 옵션의 맨 아래 좌표값)
			var obj_w = Math.round(select_offset_l + select_container_w); //절대적 화면상의 좌표에서 설렉트박스의 높이와 옵션의 높이의 합( 옵션이 열렸을때 옵션의 맨 아래 좌표값)
			if (window_height < obj_h) {
				if (offset.top > 350) {
					that.$container.css('top', select_container_h * (-1) + offset.top);
				} else {
					that.$container.css('top', offset.top + height);
				}
			} else {
				that.$container.css('top', offset.top + height);
			}

			var left = offset.left;
			if (window_width < obj_w) {
				if (offset.left > 350) {
					left = offset.left - (select_container_w - width);
				}
			}
			that.$container.css({
				'position': 'absolute',
				'z-index': 19000,
				'left': left
			});
		};

		var showContainer = function () {
			setPosition();
			if (that.options.default_hex == '' && that.options.value == '') {

			} else
				$picker_wrap.colorpicker('setValue', that.options.value);
			$(document).off('focusin.bs.modal');
			that.$container.show();
			//$input.focus();
			$('body').data('colorpicker', 'Y');
			$(window).off('resize.' + that.id);
			$(window).on('resize.' + that.id, function (e) {
				setPosition();
			});
			$('#cocoaModal, #cocoaSubModal').off('scroll.' + that.id);
			$('#cocoaModal, #cocoaSubModal').on('scroll.' + that.id, function (e) {
				setPosition();
			});
			$(document).off('scroll.' + that.id);
			$(document).on('scroll.' + that.id, function (e) {
				setPosition();
			});
			$(document).off('mousedown.' + that.id);
			$(document).on('mousedown.' + that.id + ' mousepress.' + that.id, function (e) {
				var $target = $(e.target);
				if ($target.closest(that.$container).length == 0) {
					cancelPropagation(e);
					e.preventDefault();
					hideContainer();
				}
			});
		};


		if (that.options.mode == 'input') {
			that.element.find('.color_pick').off('click').on('click', function () {
				if (!$(this).prop('disabled'))
					showContainer();
			});
			that.element.find('input').off('blur').on('blur', function () {
				var _val = $(this).val();
				if (_val == '')
					_val = that.options.default_hex;

				if (_val == '') {
					that.stop('');
					that.change('');
					that.options.value = '';
					$picker_wrap.colorpicker('setValue', 'transparent');
					$(this).val('');
				} else {
					var _rgba = that.getColorString(_val);
					$(this).val(_rgba);
					that.stop(_rgba);
					that.options.value = _rgba;
					$picker_wrap.colorpicker('setValue', _rgba);
				}
			});
			that.element.find('input').off('keypress').on('keypress', function (e) {
				if (checkEnter(e)) {
					var _rgba = that.getColorString($(this).val());
					$(this).val(_rgba);
					that.stop(_rgba);
					that.options.value = _rgba;
					$picker_wrap.colorpicker('setValue', _rgba);
				}
			});
		} else {
			that.element.off('click').on('click', function () {
				if (!$(this).prop('disabled'))
					showContainer();
			});
		}
		that.create();
	};

	colorPicker.prototype.setValue = function (value) {
		var that = this;
		var val = that.getColorString(value);
		that.options.value = val;
	};

	colorPicker.prototype.updateInputButton = function (value) {
		var that = this;
		if (that.options.mode == 'input') {
			that.element.find('input').val(value);
			that.element.find('.frame_box').css('background-color', value);
		} else if (that.options.mode == 'button' || that.options.mode == 'btn') {
			that.element.find('.frame_box').css('background-color', value);
		}
	};

	colorPicker.prototype.makeInputButton = function () {
		var that = this;

		if (that.options.mode == 'input') {
			var $color_picker_wrap = $('<div/>');
			var $color_picker_input = $('<input class="dz-form-control" type="text" maxlength="25">');
			var $color_picker_add_on = $('<div class="color_pick input-group-addon" style="left: auto; right: 0; z-index: 99"><span class="color"></span><i class="frame_box fr_20"></i></div>');
			$color_picker_input.val(that.options.value);
			$color_picker_add_on.find('i').css('background-color', that.options.value);
			$color_picker_wrap.append($color_picker_input);
			$color_picker_wrap.append($color_picker_add_on);
			that.element
				.empty()
				.css('position', 'relative')
				.append($color_picker_wrap);
		} else if (that.options.mode == 'button' || that.options.mode == 'btn') {
			var $color_picker_wrap = $('<div><span class="color"></span><i class="frame_box fr_20"></i></div>');
			$color_picker_wrap.find('.frame_box').css('background-color', that.options.value);
			that.element
				.addClass('color_pick color_pick_btn input-group-addon')
				.empty()
				.append($color_picker_wrap);
		}
	};

	colorPicker.prototype.updatePreset = function () {
		var that = this;

		// 최근 사용 컬러
		var recentColor = localStorage.getItem('recentColor');
		var recentColorArray = [];
		if (recentColor) {
			try {
				recentColorArray = JSON.parse(recentColor);
			} catch (e) {
				// localStorage에 옳지 않은 값이 있을 경우 초기화
				localStorage.removeItem('recentColor');
			}
		}
		that.options.recent_color = recentColorArray;

		// 최근 추가 색상 컨테이너 추가
		that.$container.find('.recent-color-wrap').remove();
		var $_picker_wrap = that.$container.find('._picker_wrap');
		var $colorpicker = that.$container.find('.colorpicker');
		var $recent_color_wrap = $('<div class="recent-color-wrap"/>');
		var $preset_color_array = [];
		$preset_color_array.push(that.options.brand_color); // 프리셋 컬러 첫 번째는 브랜드 컬러
		$preset_color_array = $preset_color_array.concat(that.options.recent_color);
		for (var i = 0; i < $preset_color_array.length; i++) {
			var $recent_color = $('<div class="colorpicker-preset"></div>');
			if (that.options.format == 'hex') { // alpha picker를 사용하지 않을 때 alpha 제거
				// 선택하지 않을 경우 alpha가 제거된 상태로 보여지더라도 localStorage 상에는 alpha 포함된 상태 그대로 있도록 css 컬러만 수정
				$recent_color.css('background-color', tinycolor($preset_color_array[i]).setAlpha(1));
			} else {
				$recent_color.css('background-color', $preset_color_array[i]);
			}
			// 프리셋 색상 클릭 이벤트
			$recent_color.click(function () {
				var value = $(this).css('background-color');
				// alpha picker를 사용하지 않을 때 alpha 제거
				// alpha가 제거된 color를 선택할 경우 localStorage에 alpha가 제거된 색상이 들어감
				if (that.options.format == 'hex') value = tinycolor(value).setAlpha(1).toHexString();
				var _rgba = that.getColorString(value);
				$(this).val(_rgba);
				that.change(_rgba);
				that.options.value = _rgba;
				$_picker_wrap.colorpicker('setValue', _rgba);
			});
			$recent_color_wrap.append($recent_color);
		}
		// colorpicker 안에 포함되어야 텍스트 위젯에서 인식
		$colorpicker.append($recent_color_wrap);
	};

	colorPicker.prototype.destroy = function () {
		this.element.data('setColorPicker', false);
	};
	colorPicker.prototype.disable = function () {
		this.element.prop("disabled", true);
		this.element.toggleClass('disabled', true);
		this.element.find('input').prop("disabled", true);
		this.element.find('input').toggleClass("disabled", true);
	};
	colorPicker.prototype.enable = function () {
		this.element.prop("disabled", false);
		this.element.toggleClass('disabled', false);
		this.element.find('input').prop("disabled", false);
		this.element.find('input').toggleClass("disabled", false);
	};

	function PLUGIN(o, v) {
		var obj = $(this);
		if (typeof o == 'string') {
			var data = obj.data('setColorPicker');
			if (!data) obj.data('setColorPicker', (data = new colorPicker(obj, o)));
			return data[o](v);
		} else if (typeof o == 'object') {
			var data = obj.data('setColorPicker');
			if (typeof data != 'undefined') {
				if (data !== false) {
					data.destroy();
				}
			}
			obj.data('setColorPicker', (data = new colorPicker(obj, o)));
		}
		return this;
	}

	$.fn.setColorPicker = PLUGIN;

})();

//setSpinner - 다국어 포함
(function () {
	/**
	 * o.event      - event 목록
	 * o['default']    - default value
	 * o.change     - event callback function

	 * @param el
	 * @param o
	 */
	var setSpinner = function (el, o) {
		this.element = $(el);
		this.o = o;
		this.value;
		this.prefix = '';
		this.precision = 0;
		this.step = 1;
		this.min = -1000;
		this.max = 1000;
		this.first = true;

		this.init();
	};

	setSpinner.prototype.init = function () {
		var that = this;

		this.o.value = typeof this.o.value == 'undefined' ? '0' : this.o.value;
		this.o.mode = typeof this.o.mode == 'undefined' ? '' : this.o.mode;


		switch (this.o.mode) {
			case 'shop_prod_thumb_width':
				this.readonly = false;
				this.prefix = 'px';
				this.precision = 0;
				this.step = 1;
				this.min = 10;
				this.max = 1000;
				break;
			case 'shop_prod_list_interval':
				this.readonly = false;
				this.prefix = 'px';
				this.precision = 0;
				this.step = 1;
				this.min = 0;
				this.max = 100;
				break;
			case 'grid_gutter':
				this.readonly = false;
				this.prefix = 'px';
				this.precision = 0;
				this.step = 1;
				this.min = 0;
				this.max = 30;
				break;
			case 'font_size':
				this.readonly = false;
				this.prefix = 'px';
				this.precision = 0;
				this.step = 1;
				this.min = 11;
				this.max = 144;
				break;
			case 'square_flag_size':
				this.readonly = false;
				this.prefix = 'px';
				this.precision = 0;
				this.step = 1;
				this.min = 5;
				this.max = 50;
				break;
			case 'circle_flag_size':
				this.readonly = false;
				this.prefix = 'px';
				this.precision = 0;
				this.step = 1;
				this.min = 5;
				this.max = 60;
				break;
			case 'date':
				this.readonly = false;
				this.prefix = getLocalizeString('설명_n일', '', '일');
				this.precision = 0;
				this.step = 1;
				this.min = 0;
				this.max = 365;
				break;
			case 'line_height':
				this.readonly = false;
				this.prefix = '';
				this.precision = 1;
				this.step = 0.1;
				this.min = 0;
				this.max = 4.0;
				break;
			case 'effect_time':
				this.readonly = false;
				this.prefix = '';
				this.precision = 1;
				this.step = 0.1;
				this.min = 0;
				this.max = 10.0;
				break;
			case 'effect_wait':
				this.readonly = false;
				this.prefix = '';
				this.precision = 0;
				this.step = 1;
				this.min = 0;
				this.max = 180;
				break;
			case 'indent':
				this.readonly = false;
				this.prefix = '';
				this.precision = 0;
				this.step = 1;
				this.min = -2;
				this.max = 3;
				break;
			case 'margin':
				this.readonly = false;
				this.prefix = 'px';
				this.precision = 0;
				this.step = 1;
				this.min = 0;
				this.max = 1000;
				break;
			case 'border_size_pixel':
				this.readonly = false;
				this.prefix = 'px';
				this.precision = 0;
				this.step = 1;
				this.min = 2;
				this.max = 1920;
				break;
			case 'interval':
				this.readonly = false;
				this.prefix = 'px';
				this.precision = 0;
				this.step = 1;
				this.min = -30;
				this.max = 1000;
				break;
			case 'border_size':
				this.readonly = false;
				this.prefix = '%';
				this.precision = 0;
				this.step = 1;
				this.min = 1;
				this.max = 100;
				break;
			case 'border':
				this.readonly = false;
				this.prefix = 'px';
				this.precision = 0;
				this.step = 1;
				this.min = 0;
				this.max = 10;
				break;
			case 'document_width':
				this.readonly = false;
				this.prefix = 'px';
				this.precision = 0;
				this.step = 4;
				this.min = 980;
				this.max = 1920;
				break;
			case 'map_zoom':
				this.readonly = false;
				this.prefix = '';
				this.precision = 0;
				this.step = 1;
				this.min = 0;
				this.max = 22;
				break;
			case 'radius':
			case 'round':
				this.readonly = false;
				this.prefix = 'px';
				this.precision = 0;
				this.step = 1;
				this.min = 0;
				this.max = 20;
				break;
			case 'logo':
				this.readonly = false;
				this.prefix = 'px';
				this.precision = 0;
				this.step = 1;
				this.min = 10;
				this.max = 1000;
				break;
			case 'section_height':
				this.readonly = false;
				this.prefix = 'px';
				this.precision = 0;
				this.step = 10;
				this.min = 40;
				this.max = 10000;
				break;
			case 'min_height':
				this.readonly = false;
				this.prefix = 'px';
				this.precision = 0;
				this.step = 10;
				this.min = 40;
				this.max = 10000;
				break;
			case 'icon_height':
				this.readonly = false;
				this.prefix = 'px';
				this.precision = 0;
				this.step = 1;
				this.min = 10;
				this.max = 1500;
				break;
			case 'answer_suggestion':
				this.readonly = false;
				this.prefix = '';
				this.precision = 0;
				this.step = 1;
				this.min = 1;
				this.max = 1000;
				break;
			case 'text_height':
				this.readonly = false;
				this.prefix = 'px';
				this.precision = 0;
				this.step = 1;
				this.min = 0;
				this.max = 10000;
				break;
			case 'side_width':
				this.readonly = false;
				this.prefix = 'px';
				this.precision = 0;
				this.step = 1;
				this.min = 100;
				this.max = 600;
				break;
			case 'letter_spacing':
				this.readonly = false;
				this.prefix = 'px';
				this.precision = 0;
				this.step = 1;
				this.min = -3;
				this.max = 5;
				break;
			case 'header_height':
				this.readonly = false;
				this.prefix = 'px';
				this.precision = 0;
				this.step = 1;
				this.min = 10;
				this.max = 200;
				break;
			case 'position':
				this.readonly = false;
				this.prefix = 'px';
				this.precision = 0;
				this.step = 1;
				this.min = -200;
				this.max = 200;
				break;
			case 'paging_width':
				this.readonly = false;
				this.prefix = 'px';
				this.precision = 0;
				this.step = 1;
				this.min = 8;
				this.max = 30;
				break;
			case 'paging_margin':
				this.readonly = false;
				this.prefix = 'px';
				this.precision = 0;
				this.step = 1;
				this.min = 0;
				this.max = 30;
				break;
			case 'paging_font_size':
				this.readonly = false;
				this.prefix = 'px';
				this.precision = 0;
				this.step = 1;
				this.min = 9;
				this.max = 30;
				break;
			case 'nav_font_size':
				this.readonly = false;
				this.prefix = 'px';
				this.precision = 0;
				this.step = 1;
				this.min = 9;
				this.max = 100;
				break;
			case 'nav_round':
				this.readonly = false;
				this.prefix = 'px';
				this.precision = 0;
				this.step = 1;
				this.min = 0;
				this.max = 80;
				break;
			case 'modal_width':
				this.readonly = false;
				this.prefix = 'px';
				this.precision = 0;
				this.step = 10;
				this.min = 300;
				this.max = 1000;
				break;
			case 'modal_height':
				this.readonly = false;
				this.prefix = 'px';
				this.precision = 0;
				this.step = 10;
				this.min = 0;
				this.max = 1000;
				break;
			case 'img_height':
				this.readonly = false;
				this.prefix = 'px';
				this.precision = 0;
				this.step = 1;
				this.min = -1;
				this.max = 10000;
				break;
			default:
				this.readonly = false;
				this.prefix = 'px';
				this.precision = 0;
				this.step = 1;
				this.min = 0;
				this.max = 1000;
				break;
		}

		// 최소 최대값 커스텀 가능하도록
		this.min = typeof this.o.min == 'undefined' ? this.min : this.o.min;
		this.max = typeof this.o.max == 'undefined' ? this.max : this.o.max;

		if (this.readonly) {
			this.spinner_input = $('<input type="hidden" data-spin="spinner" data-rule="quantity" class="dz-form-control" />');
			this.spinner_text = $('<div class="dz-form-control _spinner_text" />').text(this.o.value + this.prefix);
		} else {
			this.spinner_input = $('<input type="text" data-spin="spinner" data-rule="quantity" class="dz-form-control" />');
			this.spinner_text = $('<span />');
		}

		this.spinner_input.val(this.o.value);
		this.spinner_wrap = $('<div class="spinner"/>');
		this.spinner_btn = $('<a href="javascript:;" tabindex="-1" class="spin-up" data-spin="up"><i class="zmdi zmdi-caret-up"></i></a><a href="javascript:;" tabindex="-1" class="spin-down" data-spin="down"><i class="zmdi zmdi-caret-down"></i></a>');

		this.spinner_wrap
			.append(this.spinner_input)
			.append(this.spinner_text)
			.append(this.spinner_btn);

		this.element.empty();
		this.element.append(this.spinner_wrap);

		this.spinner_wrap
			.spinner({
				'step': that.step,
				'min': that.min,
				'max': that.max,
				'precision': that.precision
			})
			.spinner('create', function (e, newVal) {
				that.set(newVal);
			})
			.spinner('changed', function (e, newVal, oldVal) {
				//	if(!that.first)
				if (that.o.mode == 'text_height' || that.o.mode == 'line_height' || that.o.mode == 'modal_height') {
					if (newVal == 0) {
						newVal = 'auto';
					}
				}
				that.stop(newVal);
				that.first = false;
			})
			.spinner('changing', function (e, newVal, oldVal) {
				if (that.o.mode == 'text_height' || that.o.mode == 'line_height' || that.o.mode == 'modal_height') {
					if (newVal == 0) {
						newVal = 'auto';
					}
				}

				if (that.o.mode === 'img_height' && newVal < 1) {
					if (newVal < 0) that.change(oldVal);
					if (newVal === 0) that.change(1);
					return;
				}

				that.change(newVal);
			})
			.spinner('notChanging', function (e, newVal) {
				if (that.o.mode == 'text_height' || that.o.mode == 'line_height' || that.o.mode == 'modal_height') {
					if (newVal == 0) {
						newVal = 'auto';
					}
				}
				that.change(newVal);
			});

		that.set(that.o.value);


		if (typeof that.o.disable != 'undefined' && that.o.disable == true) {
			this.disable();
		} else {
			this.enable();
		}

	};

	setSpinner.prototype.stop = function (data) {
		this.set(data);
		if (typeof this.o.stop == 'function') {
			this.o.stop(data);
		}
	};
	setSpinner.prototype.disable = function () {
		this.element.prop("disabled", true);
		this.element.toggleClass('disabled', true);
		this.spinner_input.prop("disabled", true);
		this.spinner_wrap.toggleClass('disabled', true);
	};
	setSpinner.prototype.enable = function () {
		this.element.prop("disabled", false);
		this.element.toggleClass('disabled', false);
		this.spinner_input.prop("disabled", false);
		this.spinner_wrap.toggleClass('disabled', false);
	};


	setSpinner.prototype.change = function (data) {
		this.set(data);
		if (typeof this.o.change == 'function') {
			this.o.change(data);
		}
	};

	setSpinner.prototype.get = function () {
		return this.value;
	};

	setSpinner.prototype.set = function (value) {
		this.value = value;
		if (value === 'auto') {
			if (this.readonly)
				this.spinner_text.text(value);
			this.spinner_input.val(value);
		} else if (this.o.mode === 'img_height' && this.o.value === '') {
			this.spinner_input.val(value);
		} else {
			if (this.readonly)
				this.spinner_text.text(value + this.prefix);
			this.spinner_input.val(value + this.prefix);
		}
	};

	setSpinner.prototype.destroy = function () {
		this.element.data('setSpinner', false);
	};

	function PLUGIN(o) {
		var obj = $(this);
		if (typeof o == 'string') {
			var data = obj.data('setSpinner');
			if (!data) obj.data('setSpinner', (data = new setSpinner(obj, o)));
			return data[o]();
		} else if (typeof o == 'object') {
			var data = obj.data('setSpinner');
			if (typeof data != 'undefined') {
				if (data !== false) {
					data.destroy();
				}
			}
			obj.data('setSpinner', (data = new setSpinner(obj, o)));
		}
		return this;
	}

	$.fn.setSpinner = PLUGIN;

})();

//setResizable
(function () {
	var setResizable = function (el, o) {
		this.$element = $(el);
		this.default_option = {
			css_update: true,
			handle: 'news',
			max_width: null,
			min_width: null,
			max_height: null,
			min_height: null,
			containment: null
		};
		this.o = o;
		this.width;
		this.height;
		this.res = {
			start_x: null,
			start_y: null,
			gap_x: null,
			gap_y: null,
			width: null
		};
		this.drag_start = false;
		this.event_codes = [];
		this.init();

	};

	setResizable.prototype.getHandle = function (handle, code) {
		var $handle = $('<div class="doz_handle _doz_handle_' + code + ' ui-resizable-handle ui-resizable-' + handle + '" style="z-index: 90;"></div>');
		return $handle;
	};

	setResizable.prototype.createHandle = function (handle) {
		var uniq = makeUniq();
		this.event_codes.push(uniq);
		var that = this;
		var $handle = that.getHandle(handle, uniq);
		var $body = $('body');
		this.$element.append($handle);

		$handle.off('mousedown').on('mousedown', function (e) {
			$handle.toggleClass('active', true);
			that.$element.toggleClass('disable-selection', true);
			that.$element.toggleClass('mask', true);
			that.width = that.$element.outerWidth();
			that.height = that.$element.outerHeight();
			var start_x = e.clientX;
			var start_y = e.clientY;
			that.drag_start = true;
			var current_width = that.$element.outerWidth();
			var current_height = that.$element.outerHeight();
			that.res.start_x = start_x;
			that.res.start_y = start_y;
			that.res.width = that.width;
			that.res.height = that.height;
			that.start();
			$body.off('selectstart').on('selectstart', function (e2) {
				return false
			});
			$body.off('mousemove.' + uniq).on('mousemove.' + uniq, function (e2) {
				if (that.drag_start) {
					var current_x = e2.clientX;
					var current_y = e2.clientY;
					var width = current_width;
					var height = current_height;
					var gap_x = start_x - current_x;
					var gap_y = start_y - current_y;

					that.res.gap_x = gap_x;
					that.res.gap_y = gap_y;

					switch (handle) {
						case 'n':
							if (gap_y > 0) {
								height = current_height + Math.abs(gap_y);
							} else {
								height = current_height - Math.abs(gap_y);
							}
							break;
						case 'e':
							if (gap_x <= 0) {
								width = current_width + Math.abs(gap_x);
							} else {
								width = current_width - Math.abs(gap_x);
							}
							break;
						case 'w':
							if (gap_x > 0) {
								width = current_width + Math.abs(gap_x);
							} else {
								width = current_width - Math.abs(gap_x);
							}
							break;
						case 's':
							if (gap_y <= 0) {
								height = current_height + Math.abs(gap_y);
							} else {
								height = current_height - Math.abs(gap_y);
							}
							break;

						case 'se':

							if (gap_y <= 0) {
								height = current_height + Math.abs(gap_y);
							} else {
								height = current_height - Math.abs(gap_y);
							}
							if (gap_x <= 0) {
								width = current_width + Math.abs(gap_x);
							} else {
								width = current_width - Math.abs(gap_x);
							}

							break;
					}
					if (that.o.max_width != null && parseInt(that.o.max_width) > 0)
						if (width > that.o.max_width) width = that.o.max_width;
					if (that.o.min_width != null && parseInt(that.o.min_width) > 0)
						if (width < that.o.min_width) width = that.o.min_width;
					if (that.o.max_height != null && parseInt(that.o.max_height) > 0)
						if (height > that.o.max_height) height = that.o.max_height;
					if (that.o.min_height != null && parseInt(that.o.min_height) > 0)
						if (height < that.o.min_height) height = that.o.min_height;

					if (that.o.containment != null) {
						switch (that.o.containment) {
							case 'parent':
								var $parent = that.$element.parent();
								var parent_width = $parent.innerWidth();
								var parent_height = $parent.innerHeight();
								var position_x = that.$element.position().left;
								var position_y = that.$element.position().top;
								if (width > parent_width - position_x) width = parent_width - position_x;
								if (height > parent_height - position_y) height = parent_height - position_y;
								break;
						}
					}

					that.res.width = width;
					that.res.height = height;
					if (that.o.css_update) {
						switch (handle) {
							case 'n':
							case 's':
								that.$element.outerHeight(height);
								break;
							case 'w':
							case 'e':
								that.$element.outerWidth(width);
								break;
							case 'se':
								that.$element.outerHeight(height);
								that.$element.outerWidth(width);
								break;

						}
					}
					that.change();
				}
			});
			$body.off('mouseup.' + uniq).on('mouseup.' + uniq, function (e) {

				$body.off('selectstart');
				if (!that.drag_start) {
					cancelPropagation(e);
					return false;
				}
				$handle.toggleClass('active', false);
				that.$element.toggleClass('disable-selection', false);
				that.$element.toggleClass('mask', false);
				$body.off('mousemove.' + uniq);
				$body.off('mouseup.' + uniq);
				that.drag_start = false;
				that.stop();
			});
		});


	};

	setResizable.prototype.init = function () {
		var that = this;
		this.o = $.extend({}, this.default_option, this.o);

		var handle = [];
		for (var i = 0; i < that.o.handle.length; i++) {
			handle.push(that.o.handle.substring(i, i + 1));
		}
		if ($.inArray('e', handle) > -1 && $.inArray('s', handle) > -1) {
			handle.push('se');
		}

		$.each(handle, function (e, v) {
			that.createHandle(v);
		});
		that.create();


	};

	setResizable.prototype.stop = function () {
		if (typeof this.o.stop == 'function') {
			this.o.stop(this.res);
		}
	};
	setResizable.prototype.create = function () {
		if (typeof this.o.create == 'function') {
			this.o.create();
		}
	};
	setResizable.prototype.start = function () {
		if (typeof this.o.start == 'function') {
			this.o.start(this.res);
		}
	};
	setResizable.prototype.disable = function () {};
	setResizable.prototype.enable = function () {};


	setResizable.prototype.change = function () {
		if (typeof this.o.change == 'function') {
			this.o.change(this.res);
		}
	};

	setResizable.prototype.get = function () {
		return this.value;
	};

	setResizable.prototype.set = function (value) {
		this.res = $.extend(this.res, value);
	};

	setResizable.prototype.destroy = function () {
		this.$element.data('setResizable', false);
		var $body = $('body');
		var that = this;
		$.each(this.event_codes, function (e, code) {
			if (that.$element.length > 0)
				that.$element.find('._doz_handle_' + code).remove();
			$body.off('mousemove.' + code);
			$body.off('mouseup.' + code);
		});
	};

	function PLUGIN(o) {
		var obj = $(this);
		if (typeof o == 'string') {
			var data = obj.data('setResizable');
			if (!data) obj.data('setResizable', (data = new setResizable(obj, o)));
			return data[o]();
		} else if (typeof o == 'object') {
			var data = obj.data('setResizable');
			if (typeof data != 'undefined') {
				if (data !== false) {
					data.destroy();
				}
			}
			obj.data('setResizable', (data = new setResizable(obj, o)));
		}
		return this;
	}

	$.fn.setResizable = PLUGIN;

})();

//setLink - 다국어 포함
(function () {
	var setLink = function ($el, o) {
		var default_option = {
			'type_list': [], //1개만 사용시 타입선택 셀렉트박스 생성안됨
			'default': '',
			'data': {},
			'menu_list': [],
			'input_width': 230
		};
		this.element = $el;
		this.o = o;
		this.o = $.extend(default_option, this.o);

		this.disabled = false;

		this.init();
	};

	setLink.prototype.init = function () {
		this.element.empty();
		var that = this;
		var data = this.o.data;
		var api_data = MENU.getApiData();
		var target = that.o.target;

		var menu_list = this.o.menu_list;
		var type_list = this.o.type_list;
		var input_width = this.o.input_width;
		var menu_data = MENU.getCurrentMenu();
		var link_type_list_temp = [{
				'key': 'default',
				'value': getLocalizeString('설명_링크', '', '링크')
			},
			{
				'key': 'call',
				'value': getLocalizeString('설명_전화걸기', '', '전화걸기')
			},
			{
				'key': 'sms',
				'value': getLocalizeString('설명_문자발송', '', '문자발송')
			},
			{
				'key': 'link_email',
				'value': getLocalizeString('설명_이메일', '', '이메일')
			},
			{
				'key': 'file',
				'value': getLocalizeString('설명_파일첨부', '', '파일첨부')
			},
			{
				'key': 'video',
				'value': getLocalizeString('설명_동영상', '', '동영상')
			},
			{
				'key': 'sns_share',
				'value': getLocalizeString('설명_소셜공유', '', '소셜공유')
			},
			{
				'key': 'tooltip',
				'value': getLocalizeString('설명_말풍선', '', '말풍선')
			},
			{
				'key': 'custom',
				'value': getLocalizeString('설명_코드', '', '코드')
			},
			{
				'key': 'shopping',
				'value': getLocalizeString('설명_최신상품', '', '최신상품')
			},
		];
		if (menu_data.pos !== 'modal') { // 모달 메뉴에서는 모달, 즐겨찾기 예외 처리되야 함.
			link_type_list_temp.push({
				'key': 'modal',
				'value': getLocalizeString('설명_모달', '', '모달')
			})
		}

		let link_type_list = link_type_list_temp;

		// 단일메뉴 사용체크
		var is_single_menu = false;
		if (type_list.length > 0) {
			link_type_list = [];
			$.each(link_type_list_temp, function (e, _arr) {
				if ($.inArray(_arr.key, type_list) !== -1) {
					link_type_list.push(_arr);
				}
			});
		}
		if (link_type_list.length === 0) link_type_list = link_type_list_temp;
		if (link_type_list.length === 1) is_single_menu = true;

		// 특정 링크타입 제한 시 기존값이 포함된 링크타입이 아닐 경우 포함된 링크타입으로 초기화
		if (type_list.length > 0 && type_list.indexOf(data.link_type) === -1) {
			data.link_type = type_list[0];
		}

		// 코드 링크 외에 custom 필드 사용 시에 비어있는 경우 기본값 설정
		data.custom = data.link_type == 'video' && data.custom == '' ? {
			'video_url': ''
		} : data.custom;
		data.custom = data.link_type == 'tooltip' && data.custom == '' ? {
			'tooltip_title': ''
		} : data.custom;

		// 코드 링크 외에 custom 필드 사용 시에 data.custom이 JSON으로 넘어오지 않았을 경우 변환
		data.custom = data.link_type == 'video' && typeof data.custom == 'string' ? JSON.parse(data.custom) : data.custom;
		data.custom = data.link_type == 'tooltip' && typeof data.custom == 'string' ? JSON.parse(data.custom) : data.custom;

		var prod_list = '';
		var modal_list = '';
		var sns_share_type_list = [{
				'key': 'default',
				'value': getLocalizeString('설명_소셜공유창실행', '', '소셜 공유창 실행')
			},
			{
				'key': 'line',
				'value': 'Line'
			},
			{
				'key': 'facebook',
				'value': 'Facebook'
			},
			{
				'key': 'twitter',
				'value': 'Twitter'
			}
		];
		var $link_option_wrap = $('<div class="division-block _hide_link_option" style="display: table-caption; caption-side: bottom; min-width: 200px;"/>');
		if (target === 'footer') {
			var $social_icon_wrap = $('<div class="division-block form-select _social_icon_open width-1">' +
				'<div style="position: absolute; left: 0; top: 5px;" class="text-16 _social_icon"><i class="ii ii-facebook"></i></div>' +
				'<input type="text" class="dz-form-control width-1 no-padding" readonly>' +
				'</div>');

			var $link_type = $('<input type="text" class="dz-form-control width-2" readonly="">');
			var $link_type_wrap = $('<div class="division-block form-select width-2" />');
			$link_type_wrap.append($link_type).css('display', is_single_menu ? 'none' : 'table-cell');

			var $new_window = $('<label><input type="checkbox" value=""><span>' + getLocalizeString('설명_새창', '', '새창') + '</span></label>');
			var $new_window_wrap = $('<div class="checkbox checkbox-styled division-block _hide_link_input" />');
			$new_window_wrap.append($new_window);

			var $social_delete = $('<a href="javascript:;" class="text-16 _social_delete"><i class="btl bt-times-circle"></i></a>');
			var $social_delete_wrap = $('<div class="division-block text-right vertical-middle no-padding" />');
			$social_delete_wrap.append($social_delete);

			var $social_first_line = $('<div style="margin-bottom: 8px;" />');
			$social_first_line.append($social_icon_wrap);
			$social_first_line.append($link_type_wrap);
			$social_first_line.append($new_window_wrap);
			$social_first_line.append($social_delete_wrap);
			this.element.append($social_first_line);

			var $link_input = $('<input class="dz-form-control" type="text" placeholder="' + getLocalizeString('설명_URL입력', '', 'URL 입력') + '">');
			var $link_input_wrap = $('<div class="division-block _hide_link_input" />');
			$link_input_wrap.append($link_input);
			var $delete_link = $('<i class="zmdi zmdi-close _delete_link"></i>');
			$link_input_wrap.append($delete_link);
			this.element.append($link_input_wrap);

			var $call_input = $('<input class="dz-form-control" type="text" placeholder="' + getLocalizeString('설명_전화번호입력', '', '전화번호 입력') + '">');
			var $call_input_wrap = $('<div class="division-block _hide_link_input" />');
			$call_input_wrap.append($call_input);
			this.element.append($call_input_wrap);

			var $file_input = $('<div class="bt bt-round holder"><span>' + getLocalizeString('타이틀_파일업로드', '', '파일 업로드') + '</span><input class="dz-form-control" type="file"></div>');
			var $file_name = $('<span class="margin-left-lg text-ellipses" />');
			var $delete_file = $('<a href="javascript:;" class="bt bt-round holder text-gray" style="margin-left: 5px;">' + getLocalizeString('버튼_삭제', '', '삭제') + '</a>');
			var $file_input_wrap = $('<div class="division-block _hide_link_input" />');
			$file_input_wrap.append($file_input);
			$file_input_wrap.append($delete_file);
			$file_input_wrap.append($file_name);
			this.element.append($file_input_wrap);

			var $video_input = $('<input class="dz-form-control" type="text" placeholder="Youtube/Vimeo ' + getLocalizeString('설명_동영상입력', '', '동영상 입력') + '">');
			var $video_input_wrap = $('<div class="division-block _hide_link_input" />');
			$video_input_wrap.append($video_input);
			this.element.append($video_input_wrap);

			var $video_loop = $('<div class="checkbox checkbox-styled"><label><input type="checkbox"><span>' + getLocalizeString('설명_반복재생', '', '반복 재생') + '</span></label></div>');
			var $video_hide_title = $('<div class="checkbox checkbox-styled"><label><input type="checkbox"><span>' + getLocalizeString('설명_제목감추기', '', '제목 감추기') + '</span></label></div>');
			var $video_setting_wrap = $('<div class="division-block _hide_link_option"/>');
			$video_setting_wrap.append($video_loop);
			$video_setting_wrap.append($video_hide_title);
			$link_option_wrap.append($video_setting_wrap);

			if (SITE_COUNTRY_CODE !== TAIWAN_COUNTRY_CODE) {
				sns_share_type_list = [{
						'key': 'default',
						'value': getLocalizeString('설명_소셜공유창실행', '', '소셜 공유창 실행')
					},
					{
						'key': 'kakaotalk',
						'value': getLocalizeString('설명_카카오톡', '', '카카오톡')
					},
					{
						'key': 'line',
						'value': getLocalizeString('설명_라인', '', '라인')
					},
					{
						'key': 'band',
						'value': getLocalizeString('설명_밴드', '', '밴드')
					},
					{
						'key': 'naver',
						'value': getLocalizeString('설명_네이버', '', '네이버')
					},
					{
						'key': 'facebook',
						'value': 'Facebook'
					},
					{
						'key': 'twitter',
						'value': 'Twitter'
					}
				];
			}


			var $sns_share_type = $('<input type="text" class="dz-form-control" readonly="">');
			var $sns_share_type_wrap = $('<div class="division-block form-select _hide_link_input no-padding" />');
			$sns_share_type_wrap.append($sns_share_type);
			/*var $sns_share_alarm = $('<p class="help-block _hide_link_input _sns_share_alarm">카카오의 정책변경으로 인해 카카오톡 링크 사용을 원할 경우 <span class="text-danger">환경설정 > 소셜 로그인/API 설정</span>에서 카카오 링크 API 값을 입력해 주셔야 합니다.</p>');
			$sns_share_type_wrap.append($sns_share_alarm);*/
			this.element.append($sns_share_type_wrap);

			var $custom_input = $('<input class="dz-form-control" type="text" placeholder="' + getLocalizeString('설명_코드입력', '', '코드 입력') + '">');
			var $custom_input_wrap = $('<div class="division-block _hide_link_input" />');
			$custom_input_wrap.append($custom_input);
			this.element.append($custom_input_wrap);

			var $custom_help = $('<p class="help-block _hide_link_option">' + getLocalizeString('설명_입력한코드삽입', '', "입력한 코드는 &lt;a href=\"<span class=\"text-danger\">여기</span>\"&gt;에 삽입됩니다.") + '  <a href="javascript:;" class="text-gray" role="button" data-toggle="popover" tabindex="0" data-placement="auto" data-trigger="focus" data-html="true" title="" data-content="' + getLocalizeString('설명_각종JavaScript삽입CSS코드삽입', '', '<p>각종 JavaScript를 삽입하거나 CSS(Style) 코드를 삽입할 수 있습니다.</p><p>따옴표 안에 삽입되기 때문에 따옴표를 포함한 코드 입력시 따옴표가 열리고 닫히는 것을 고려하여 작성해 주셔야 합니다. (예: href=&quot;입력한 코드&quot;)</p>') + '" data-original-title="' + getLocalizeString('설명_링크타입코드', '', '링크타입 - 코드') + '"><i class="btm bt-question-circle"></i></a></p>');
			$custom_help.find('[data-toggle="popover"]').popover({
				container: 'body'
			});
			$link_option_wrap.append($custom_help);

			var $email_input = $('<input class="dz-form-control" type="text" placeholder="' + getLocalizeString('설명_이메일입력', '', '이메일 입력') + '">');
			var $email_input_wrap = $('<div class="division-block _hide_link_input" />');
			$email_input_wrap.append($email_input);
			this.element.append($email_input_wrap);

			var $shopping_link = $('<input type="text" class="dz-form-control" readonly="">');
			var $shopping_link_wrap = $('<div class="division-block form-select _hide_link_input" />').css('display', 'table-cell');
			$shopping_link_wrap.append($shopping_link);
			this.element.append($shopping_link_wrap);

			var $shopping_help_wrap = $('<div class="division-block _hide_link_option" />');
			var $shopping_link_hint = $('<p class="help-block _hide_link_option _shopping_link_hint">' + getLocalizeString('설명_지정한카테고리의최신상품상세페이지로이동합니다', '', '지정한 카테고리의 최신 상품 상세페이지로 이동합니다.') + '</p>');
			$shopping_help_wrap.append($shopping_link_hint);
			var $shopping_link_alarm = $('<p class="help-block _hide_link_option _shopping_link_alarm text-danger">' + getLocalizeString('설명_사이트내쇼핑위젯이없습니다', '', '사이트 내 쇼핑 위젯이 없어 링크가 동작하지 않습니다. 쇼핑 위젯을 추가해주세요.') + '</p>');
			$shopping_help_wrap.append($shopping_link_alarm);
			$link_option_wrap.append($shopping_help_wrap);

			var $modal_link = $('<input type="text" class="dz-form-control" readonly="">');
			var $modal_link_wrap = $('<div class="division-block form-select _hide_link_input" />').css('display', 'table-cell');
			var $modal_alarm = $('<p class="help-block _hide_link_option _modal_alarm ">' + getLocalizeString('설명_모달메뉴생성후링크타입연결해주세요', '', '모달 메뉴를 생성 및 디자인 후, 링크 타입으로 연결해주세요.') + '</p>');
			$modal_link_wrap.append($modal_link);
			$link_option_wrap.append($modal_alarm);
			this.element.append($modal_link_wrap);

			//선택창을 사용하지 않는 경우 공간 맞춤을 위한 더미 남겨둠
			var $dummy_wrap = $('<div class="division-block _hide_link_input" />').css('visibility', 'hidden');
			this.element.append($dummy_wrap);

			var $tooltip_link_input = $('<input class="dz-form-control " type="text"><p class="help-block">' + getLocalizeString('설명_링크', '', '링크') + '</p>');
			var $tooltip_link_input_wrap = $('<div class="division-block _hide_link_input" />').css('display', 'table-cell');
			$tooltip_link_input_wrap.append($tooltip_link_input).css('display', 'table-cell');
			this.element.append($tooltip_link_input_wrap);
			var $tooltip_input = $('<input class="dz-form-control " type="text" placeholder="' + getLocalizeString('설명_문구', '', '문구') + '">');
			var $tooltip_input_wrap = $('<div class="division-block _hide_link_input" />').css('display', 'table-cell');
			$tooltip_input_wrap.append($tooltip_input).css('display', 'table-cell');
			this.element.append($tooltip_input_wrap);
			var tooltip_position_list = [{
					'key': 'top',
					'value': getLocalizeString('설명_위', '', 'top')
				},
				{
					'key': 'bottom',
					'value': getLocalizeString('설명_아래', '', '아래')
				},
				{
					'key': 'left',
					'value': getLocalizeString('설명_왼쪽', '', '왼쪽')
				},
				{
					'key': 'right',
					'value': getLocalizeString('설명_오른쪽', '', '오른쪽')
				}
			];
			var $tooltip_position = $('<input type="text" class="dz-form-control" readonly="">');
			var $tooltip_position_wrap = $('<div class="division-block form-select _hide_link_input width-2" />').css('display', 'table-cell');
			$tooltip_position_wrap.append($tooltip_position).css('display', 'table-cell');
			this.element.append($tooltip_position_wrap);
			var $tooltip_new_window_wrap = $('<div class="checkbox checkbox-styled division-block _hide_link_input" />');
			var $tooltip_new_window = $('<label><input type="checkbox" value=""><span>' + getLocalizeString('설명_새창', '', '새창') + '</span></label>');
			$tooltip_new_window_wrap.append($tooltip_new_window);
			this.element.append($tooltip_new_window_wrap);

			var $hide_link_input = this.element.find('._hide_link_input');
			var $hide_link_option = $link_option_wrap.find('._hide_link_option');
		} else {
			var $link_type = $('<input type="text" class="dz-form-control width-2" readonly="">');
			var $link_type_wrap = $('<div class="division-block form-select width-2 link_type" />');
			$link_type_wrap.append($link_type).css('display', is_single_menu ? 'none' : 'table-cell');

			this.element.append($link_type_wrap);
			var $link_input = $('<input class="dz-form-control" type="text">');
			var $link_input_wrap = $('<div class="division-block _hide_link_input link_input" />');
			$link_input_wrap.append($link_input).css('display', 'table-cell');
			var $delete_link = $('<i class="zmdi zmdi-close _delete_link"></i>');
			$link_input_wrap.append($delete_link);
			this.element.append($link_input_wrap);

			var $call_input = $('<input class="dz-form-control " type="text">');
			var $call_input_wrap = $('<div class="division-block _hide_link_input call_input" />').css('display', 'table-cell');
			$call_input_wrap.append($call_input);
			this.element.append($call_input_wrap);

			var $file_input = $('<div class="bt bt-round holder" data-toggle="tooltip" data-placement="bottom" data-original-title="' + getLocalizeString('설명_최대nMB첨부가능', 100, '최대 100MB 첨부가능') + '"><span>' + getLocalizeString('타이틀_파일업로드', '', '파일 업로드') + '</span><input class="dz-form-control" type="file"></div>');
			var $file_name = $('<span class="margin-left-lg text-ellipses" />');
			var $delete_file = $('<a href="javascript:;" class="bt bt-round holder text-gray" style="margin-left: 5px;">' + getLocalizeString('버튼_삭제', '', '삭제') + '</a>');
			var $file_input_wrap = $('<div class="division-block _hide_link_input file_input" />').css('display', 'table-cell');
			$file_input_wrap.append($file_input);
			$file_input_wrap.append($delete_file);
			$file_input_wrap.append($file_name);
			this.element.append($file_input_wrap);

			var $video_input = $('<input class="dz-form-control" type="text">');
			var $video_input_wrap = $('<div class="division-block _hide_link_input video_input" />').css('display', 'table-cell');
			$video_input_wrap.append($video_input);
			this.element.append($video_input_wrap);

			var $video_loop = $('<div class="checkbox checkbox-styled division-block video_loop"><label class="help-block"><input type="checkbox"><span>' + getLocalizeString('설명_반복재생', '', '반복 재생') + '</span></label></div>');
			var $video_hide_title = $('<div class="checkbox checkbox-styled division-block video_hide_title"><label class="help-block"><input type="checkbox"><span>' + getLocalizeString('설명_제목감추기', '', '제목 감추기') + '</span></label></div>');
			var $video_setting_wrap = $('<div class="division-block _hide_link_option video_setting" />');
			$video_setting_wrap.append($video_loop);
			$video_setting_wrap.append($video_hide_title);
			$link_option_wrap.append($video_setting_wrap);

			if (SITE_COUNTRY_CODE !== TAIWAN_COUNTRY_CODE) {
				sns_share_type_list = [{
						'key': 'default',
						'value': getLocalizeString('설명_소셜공유창실행', '', '소셜 공유창 실행')
					},
					{
						'key': 'kakaotalk',
						'value': getLocalizeString('설명_카카오톡', '', '카카오톡')
					},
					{
						'key': 'line',
						'value': getLocalizeString('설명_라인', '', '라인')
					},
					{
						'key': 'band',
						'value': getLocalizeString('설명_밴드', '', '밴드')
					},
					{
						'key': 'naver',
						'value': getLocalizeString('설명_네이버', '', '네이버')
					},
					{
						'key': 'facebook',
						'value': 'Facebook'
					},
					{
						'key': 'twitter',
						'value': 'Twitter'
					}
				];
			}

			var $sns_share_type = $('<input type="text" class="dz-form-control" readonly="">');
			var $sns_share_type_wrap = $('<div class="division-block form-select _hide_link_input" />');
			$sns_share_type_wrap.append($sns_share_type).css('display', 'table-cell');
			this.element.append($sns_share_type_wrap);
			var $sns_share_alarm = $('<p class="help-block _hide_link_option _sns_share_alarm">' + getLocalizeString('설명_카카오톡링크사용API값입력', '', "카카오의 정책변경으로 인해 카카오톡 링크 사용을 원할 경우 <span class=\"text-danger\">환경설정 > 소셜 로그인/API 설정</span>에서 카카오 링크 API 값을 입력해 주셔야 합니다.") + '</p>');
			$link_option_wrap.append($sns_share_alarm);

			var $custom_input = $('<input class="dz-form-control" type="text">');
			var $custom_input_wrap = $('<div class="division-block _hide_link_input custom_input" />').css('display', 'table-cell');
			$custom_input_wrap.append($custom_input);
			this.element.append($custom_input_wrap);

			var $custom_help = $('<p class="help-block _hide_link_option">' + getLocalizeString('설명_입력한코드삽입', '', "입력한 코드는 &lt;a href=\"<span class=\"text-danger\">여기</span>\"&gt;에 삽입됩니다.") + '  <a href="javascript:;" class="text-gray" role="button" data-toggle="popover" tabindex="0" data-placement="auto" data-trigger="focus" data-html="true" title="" data-content="' + getLocalizeString('설명_각종JavaScript삽입CSS코드삽입', '', "<p>각종 JavaScript를 삽입하거나 CSS(Style) 코드를 삽입할 수 있습니다.</p><p>따옴표 안에 삽입되기 때문에 따옴표를 포함한 코드 입력시 따옴표가 열리고 닫히는 것을 고려하여 작성해 주셔야 합니다. (예: href=&quot;입력한 코드&quot;)</p>") + '" data-original-title="' + getLocalizeString('설명_링크타입코드', '', '링크타입 - 코드') + '"><i class="btm bt-question-circle"></i></a></p>');
			$custom_help.find('[data-toggle="popover"]').popover({
				container: 'body'
			});
			$link_option_wrap.append($custom_help);

			var $email_input = $('<input class="dz-form-control" type="text">');
			var $email_input_wrap = $('<div class="division-block _hide_link_input email_input" />').css('display', 'table-cell');
			$email_input_wrap.append($email_input);
			this.element.append($email_input_wrap);

			var $shopping_link = $('<input type="text" class="dz-form-control" readonly="">');
			var $shopping_link_wrap = $('<div class="division-block form-select _hide_link_input" />').css('display', 'table-cell');
			$shopping_link_wrap.append($shopping_link);
			this.element.append($shopping_link_wrap);

			var $shopping_help_wrap = $('<div class="division-block _hide_link_option" />');
			var $shopping_link_hint = $('<p class="help-block _shopping_link_hint">' + getLocalizeString('설명_지정한카테고리의최신상품상세페이지로이동합니다', '', '지정한 카테고리의 최신 상품 상세페이지로 이동합니다.') + '</p>');
			$shopping_help_wrap.append($shopping_link_hint);
			var $shopping_link_alarm = $('<p class="help-block _hide_link_option _shopping_link_alarm text-danger">' + getLocalizeString('설명_사이트내쇼핑위젯이없습니다', '', '사이트 내 쇼핑 위젯이 없어 링크가 동작하지 않습니다. 쇼핑 위젯을 추가해주세요.') + '</p>');
			$shopping_help_wrap.append($shopping_link_alarm);
			$link_option_wrap.append($shopping_help_wrap);

			var $modal_link = $('<input type="text" class="dz-form-control" readonly="">');
			var $modal_link_wrap = $('<div class="division-block form-select _hide_link_input" />').css('display', 'table-cell');
			var $modal_alarm = $('<p class="help-block _hide_link_option _modal_alarm">' + getLocalizeString('설명_모달메뉴생성후링크타입연결해주세요', '', '모달 메뉴를 생성 및 디자인 후, 링크 타입으로 연결해주세요.') + '</p>');
			$modal_link_wrap.append($modal_link);
			$link_option_wrap.append($modal_alarm);
			this.element.append($modal_link_wrap);

			//선택창을 사용하지 않는 경우 공간 맞춤을 위한 더미 남겨둠
			var $dummy_wrap = $('<div class="division-block _hide_link_input" />').css('visibility', 'hidden');
			this.element.append($dummy_wrap);

			var $new_window_wrap = $('<div class="checkbox checkbox-styled division-block _hide_link_option new_window_wrap " />');
			var $new_window = $('<label class="help-block"><input type="checkbox" value=""><span>' + getLocalizeString('설명_새창', '', '새창') + '</span></label>');

			if (is_single_menu) $new_window_wrap.css('display', 'table-row');

			$new_window_wrap.append($new_window);
			$link_option_wrap.append($new_window_wrap);

			var $fix_url_wrap = $('<div class="checkbox checkbox-styled division-block _hide_link_option" />');
			var $fix_url = $('<label style="padding-top: 0;"><input type="checkbox" value=""><span>' + getLocalizeString('설명_URL유지', '', 'URL 유지') + ' <a href="javascript:;" class="text-gray" role="button" data-toggle="popover" tabindex="0" data-placement="top" data-trigger="focus" data-html="true" title="" data-content="' + getLocalizeString('설명_URL유지설명', '', '링크 이동 후에도 현재 메뉴의 URL을 유지합니다.') + '" data-original-title="' + getLocalizeString('설명_URL유지', '', 'URL 유지') + '"><i class="btm bt-question-circle"></i></a></span></label>');
			$fix_url_wrap.append($fix_url);
			$link_option_wrap.append($fix_url_wrap);


			var tooltip_position_list = [{
					'key': 'top',
					'value': getLocalizeString('설명_위', '', '위')
				},
				{
					'key': 'bottom',
					'value': getLocalizeString('설명_아래', '', '아래')
				},
				{
					'key': 'left',
					'value': getLocalizeString('설명_왼쪽', '', '왼쪽')
				},
				{
					'key': 'right',
					'value': getLocalizeString('설명_오른쪽', '', '오른쪽')
				}
			];
			var $tooltip_position = $('<input type="text" class="dz-form-control" readonly="">');
			var $tooltip_position_wrap = $('<div class="division-block form-select _hide_link_input width-2 tooltip_position" />').css('display', 'table-cell');
			$tooltip_position_wrap.append($tooltip_position).css('display', 'table-cell');
			this.element.append($tooltip_position_wrap);
			var $tooltip_input = $('<input class="dz-form-control " type="text" placeholder="' + getLocalizeString('설명_문구', '', '문구') + '">');
			var $tooltip_input_wrap = $('<div class="division-block _hide_link_input tooltip_input" />').css('display', 'table-cell');
			$tooltip_input_wrap.append($tooltip_input).css('display', 'table-cell');
			this.element.append($tooltip_input_wrap);
			var $tooltip_new_window_wrap = $('<div class="checkbox checkbox-styled division-block _hide_link_input tooltip_new_window" />');
			var $tooltip_new_window = $('<label class="help-block"><input type="checkbox" value=""><span>' + getLocalizeString('설명_새창', '', '새창') + '</span></label>');
			$tooltip_new_window_wrap.append($tooltip_new_window);
			this.element.append($tooltip_new_window_wrap);
			$tooltip_new_window_wrap.append($tooltip_new_window).css({
				'display': 'table-caption',
				'caption-side': 'bottom'
			});
			var $tooltip_link_input = $('<input class="dz-form-control " type="text" placeholder="' + getLocalizeString('설명_링크', '', '링크') + '">');
			var $tooltip_link_input_wrap = $('<div class="division-block _hide_link_input tooltip_link_input" />').css('display', 'table-cell');
			$tooltip_link_input_wrap.append($tooltip_link_input).css({
				'display': 'table-caption',
				'caption-side': 'bottom',
				'margin-top': '7px'
			});
			this.element.append($tooltip_link_input_wrap);

			var $hide_link_input = this.element.find('._hide_link_input');
			var $hide_link_option = $link_option_wrap.find('._hide_link_option');
		}
		this.element.append($link_option_wrap);


		var changeLinkType = function (type) {
			if (target === 'footer') {
				$social_delete.css('margin-left', '61px');
			}
			$hide_link_input.hide();
			$hide_link_option.hide();
			switch (type) {
				case 'call':
				case 'sms':
					$call_input.setInput({
						'event': ['blur'],
						'default': data.callnum,
						'change': function (res) {
							if (res != data.callnum) {
								var tmp = {
									'callnum': res
								};
								data = $.extend(data, tmp);
								that.change(data);
							}
						}
					}).check_callnum();
					$call_input_wrap.css('display', 'block');
					break;
				case 'file':
					if (data.file_code != '') {
						$delete_file.show();
						$file_name.show();
					} else {
						$delete_file.hide();
						$file_name.hide();
					}

					var switchFile = function (data) {
						if (typeof data.file_code !== 'undefined' && data.file_code !== '') {
							$delete_file.show();
							$file_name.show();
							$file_name.text(data.file_name);
							$file_input.find('span').text(getLocalizeString('버튼_파일변경', '', '파일 변경'));
						} else {
							$delete_file.hide();
							$file_name.hide();
							$file_name.text('');
							$file_input.find('span').text(getLocalizeString('타이틀_파일업로드', '', '파일 업로드'));
						}
					};
					switchFile(data);

					$delete_file.off('click').on('click', function () {
						var tmp = {
							'file_code': '',
							'file_name': '',
							'file_size': ''
						};
						switchFile(tmp);
						data = $.extend(data, tmp);
						that.change(data);
					});

					var default_option = {
						dataType: 'json',
						singleFileUploads: false,
						limitMultiFileUploads: 20,
						formData: {
							temp: 'N'
						},
						dropZone: null,
						start: function (e, data) {
							dozProgress.start();
							// TODO site 에서는 preloader 변수가 아직 없음
							//$preloader.show();
						},
						progress: function (e, data) {
							dozProgress.increase(data.loaded);
							// Calculate the completion percentage of the upload
							var progress = parseInt(data.loaded / data.total * 100, 10);
							if (progress == 100) {
								//	data.context.removeClass('working');
							}
						},
						done: function (e, data) {
							dozProgress.done();
							if (typeof callback != 'undefined' && typeof callback == 'function') {
								callback('success', data.result.files, data.result);
							} else
								return data.result.files;
						},
						fail: function (e, data) {
							dozProgress.done();
							if (typeof callback != 'undefined' && typeof callback == 'function') {
								callback('error');
							} else
								return 'error';
						}
					};

					//FILE_UPLOAD_OPTION 의 최대 크기를 따름
					var maxFileSize = 104857600; //100mb
					$file_input.find('input').attr('accept', '*');
					$file_input.find('input').on('change', function () {
						if (this.files[0].size >= maxFileSize) {
							alert(getLocalizeString('설명_업로드할수있는최대용량초과', '', '업로드할 수 있는 최대용량을 초과하였습니다'));
							$(this).val('');
						}
					});
					$file_input.fileupload({
						url: '/admin/ajax/upload_file.cm',
						dataType: 'json',
						singleFileUploads: false,
						limitMultiFileUploads: 20,
						formData: {
							'target': that.o.target,
							'target_code': that.o.target_code
						},
						dropZone: null,
						maxFileSize: maxFileSize,
						start: function (e, data) {
							dozProgress.start();
						},
						progress: function (e, data) {
							dozProgress.increase(data.loaded);
						},
						done: function (e, res) {
							dozProgress.done();
							$.each(res.result.files, function (index, file) {
								if (file.error != null) {
									alert(file.error);
								} else {
									var tmp = {
										'file_code': file.code,
										'file_name': file.org_name,
										'file_size': file.size
									};
									switchFile(tmp);
									data = $.extend(data, tmp);
									that.change(data);
								}
							});
						},
						fail: function (e, data) {
							dozProgress.done();
							alert('error');
						}
					});

					$file_input_wrap.show();
					break;
				case 'link_email':
					$email_input.setInput({
						'event': ['blur'],
						'default': data.link_email,
						'change': function (res) {
							if (res != data.link_email) {
								var tmp = {
									'link_email': res
								};
								data = $.extend(data, tmp);
								that.change(data);
							}
						}
					}).check_email();
					$email_input_wrap.css('display', 'block');
					break;
				case 'video':
					//동영상 링크일 때는 custom 필드 사용
					$video_input.setInput({
						'event': ['blur'],
						'default': function () {
							if (data.link_type != 'video') { // 비디오 링크가 아닐 때 비디오 input에선 기본값을 보이지 않음
								return '';
							}
							return data.custom.video_url;
						},
						'change': function (res) {
							if (res != data.custom.video_url) {
								var tmp = {
									'video_url': res
								};
								data.custom = $.extend(data.custom, tmp);
								that.change(data);
							}
						}
					});
					$video_loop.setCheck({
						value: function () {
							if (data.link_type != 'video') {
								return false;
							}
							return data.custom.loop == 'Y';
						},
						change: function (res) {
							var tmp = {
								'loop': res ? 'Y' : 'N'
							};
							data.custom = $.extend(data.custom, tmp);
							that.change(data);
						}
					});

					$video_hide_title.setCheck({
						value: function () {
							if (data.link_type != 'video') {
								return false;
							}
							return data.custom.hide_title == 'Y';
						},
						change: function (res) {
							var tmp = {
								'hide_title': res ? 'Y' : 'N'
							};
							data.custom = $.extend(data.custom, tmp);
							that.change(data);
						}
					});
					$custom_input.setInput({
						'event': ['blur'],
						'default': function () {
							if (data.link_type != 'custom') { // 코드 외에 custom 필드를 사용할 때 코드 input에선 기본값을 보이지 않음
								return '';
							}
							return data.custom;
						},
						'change': function (res) {
							if (res != data.custom) {
								var tmp = {
									'custom': res
								};
								data = $.extend(data, tmp);
								that.change(data);
							}
						}
					});
					$video_input_wrap.css('display', 'block');
					$video_setting_wrap.show();
					break;
				case 'tooltip':
					data.link = data.link == null ? '' : data.link;
					var link_text = data.use_link_code == 'Y' ? data.link.replace("/", "") : data.link;
					$tooltip_link_input.setInput({
						'event': ['blur'],
						'default': link_text,
						'change': function (res) {
							if (!link_code) {
								if (res != data.link) {
									var tmp = {
										'link': res,
										'link_url': res,
										'link_code': '',
										'use_link_code': 'N',
										'link_type': 'tooltip'
									};
									data = $.extend(data, tmp);
									that.change(data);
								}
							}
						}
					});

					$tooltip_input.setInput({
						'event': ['blur'],
						'default': function () {
							if (data.link_type != 'tooltip') {
								return '';
							}
							return data.custom.tooltip_title;
						},
						'change': function (res) {
							if (res != data.custom.tooltip_title) {
								var tmp = {
									'tooltip_title': res
								};
								data.custom = $.extend(data.custom, tmp);
								that.change(data);
							}
						}
					});

					$tooltip_position.setSelectBox({
						'option': tooltip_position_list,
						'default': data.link_type == 'tooltip' ? data.custom.tooltip_position : 'top',
						'set': {
							'width': 150,
							'use_custom_value': 'N'
						},
						change: function (res) {
							if (res.key != data.custom.tooltip_position) {
								var tmp = {
									'tooltip_position': res.key
								};
								data.custom = $.extend(data.custom, tmp);
								that.change(data);
							}
						}
					});

					$tooltip_new_window.setCheck({
						value: function () {
							if (data.link_type != 'tooltip') {
								return false;
							}
							return data.custom.tooltip_new_window == 'Y';
						},
						change: function (res) {
							var tmp = {
								'tooltip_new_window': res ? 'Y' : 'N'
							};
							data.custom = $.extend(data.custom, tmp);
							that.change(data);
						}
					});
					$custom_input.setInput({
						'event': ['blur'],
						'default': function () {
							if (data.link_type != 'custom') { // 코드 외에 custom 필드를 사용할 때 코드 input에선 기본값을 보이지 않음
								return '';
							}
							return data.custom;
						},
						'change': function (res) {
							if (res != data.custom) {
								var tmp = {
									'custom': res
								};
								data = $.extend(data, tmp);
								that.change(data);
							}
						}
					});
					$tooltip_input_wrap.show();
					$tooltip_position_wrap.show();
					$tooltip_link_input_wrap.show();
					$tooltip_new_window_wrap.show();
					break;
				case 'sns_share': // sms와 혼동 방지
					//소셜공유 링크일 때는 custom 필드 사용
					data.custom = data.custom ? data.custom : {
						'sns_share_type': 'default'
					};
					data.custom = typeof data.custom == 'string' ? JSON.parse(data.custom) : data.custom;
					// 지원하지 않는 링크타입으로 설정된 경우 초기화
					var is_valid_share_type = false;
					$.each(sns_share_type_list, function (k, v) {
						if (v.key === data.custom.sns_share_type) is_valid_share_type = true;
					});
					if (!is_valid_share_type) data.custom.sns_share_type = 'default';
					$sns_share_type.setSelectBox({
						'option': sns_share_type_list,
						'default': data.custom.sns_share_type,
						'set': {
							'width': 150,
							'use_custom_value': 'N',
							'max_height': 300
						},
						change: function (res) {
							if (res.key != data.custom.sns_share_type) {
								if (res.key == 'kakaotalk' && (api_data.use_kakao_share != 'Y' || api_data.kakao_javascript_key.trim() == '')) {
									alert('카카오 링크 API 키가 등록되어 있지 않습니다.');
								} else {
									var tmp = {
										'sns_share_type': res.key
									};
									data.custom = $.extend(data.custom, tmp);
									that.change(data);
								}
							}
						}
					});
					$custom_input.setInput({
						'event': ['blur'],
						'default': function () {
							if (data.link_type != 'custom') { // 코드 외에 custom 필드를 사용할 때 코드 input에선 기본값을 보이지 않음
								return '';
							}
							return data.custom;
						},
						'change': function (res) {
							if (res != data.custom) {
								var tmp = {
									'custom': res
								};
								data = $.extend(data, tmp);
								that.change(data);
							}
						}
					});
					$sns_share_type_wrap.show();
					$dummy_wrap.show();

					// 카카오 안내 추가
					if ((api_data.use_kakao_share != 'Y' || api_data.kakao_javascript_key.trim() == '') && target !== 'footer' && SITE_COUNTRY_CODE !== TAIWAN_COUNTRY_CODE) {
						$sns_share_alarm.show();
					}
					break;
				case 'custom':
					$custom_input.setInput({
						'event': ['blur'],
						'default': function () {
							if (data.link_type != 'custom') { // 코드 외에 custom 필드를 사용할 때 코드 input에선 기본값을 보이지 않음
								return '';
							}
							return data.custom;
						},
						'change': function (res) {
							if (res != data.custom) {
								var tmp = {
									'custom': res
								};
								data = $.extend(data, tmp);
								that.change(data);
							}
						}
					});
					$custom_input_wrap.css('display', 'block');
					$custom_help.show();
					break;
				case 'shopping':
					data.custom = data.custom ? data.custom : {
						'shopping_code': ''
					};
					data.custom = typeof data.custom == 'string' ? JSON.parse(data.custom) : data.custom;
					if (prod_list === '') prod_list = MENU.getShoppingLinkDropdown();
					var unit_data = MENU.getUnitData();
					var use_shopping = unit_data.use_shopping;
					var shopping_code = data.custom.shopping_code ? data.custom.shopping_code : '';
					var valid_shopping_code = false;
					// 기존에 선택했던 기획전이나 카테고리가 존재하지 않을 경우 전체 카테고리로 변경
					$.each(prod_list, function (k, v) {
						if (v.key === shopping_code) {
							valid_shopping_code = true;
							return false;
						}
					});
					if (!valid_shopping_code) shopping_code = '';
					$shopping_link.setSelectBox({
						'option': prod_list,
						'default': shopping_code,
						'set': {
							'width': 230,
							use_custom_value: 'Y'
						},
						change: function (res) {
							if (res.key !== data.custom.shopping_code) {
								var tmp = {
									'shopping_code': res.key
								};
								data.custom = $.extend(data.custom, tmp);
								that.change(data);
							}
						}
					});
					if (use_shopping === 'N') {
						$shopping_link.attr('disabled', true);
					} else {
						$shopping_link.attr('disabled', false);
					}
					$shopping_link_wrap.css('display', 'block');
					$shopping_help_wrap.show();
					$shopping_link_hint.css('display', 'block');
					if (use_shopping === 'N') $shopping_link_alarm.show();
					if (target === 'footer') {
						$new_window_wrap.css('display', 'table-cell');
						$social_delete.css('margin-left', '0px');
					} else {
						$new_window_wrap.show();
						if (target === 'menu') {
							// URL 유지 옵션은 메뉴 설정에서만 가능해야 함
							$fix_url.setCheck({
								value: function () {
									return data.custom.fix_url === 'Y';
								},
								change: function (res) {
									var tmp = {
										'fix_url': res ? 'Y' : 'N'
									};
									data.custom = $.extend(data.custom, tmp);
									that.change(data);
								}
							});
							$fix_url_wrap.show();
						}
					}
					break;
				case 'modal':
					data.custom = data.custom ? data.custom : {
						'modal_code': ''
					};
					data.custom = typeof data.custom == 'string' ? JSON.parse(data.custom) : data.custom;
					var modal_code = data.custom.modal_code ? data.custom.modal_code : '';
					if (modal_list === '') modal_list = MENU.getModalLinkDropdown();
					if (modal_list.length == 0) {
						$modal_link_wrap.removeClass('form-select');
						$modal_link_wrap.find('input').attr('placeholder', getLocalizeString('설명_모달메뉴가없습니다', '', '모달 메뉴가 없습니다.'));
						$modal_alarm.show();
					} else {
						$modal_alarm.hide();
						if (modal_code === '') data.custom.modal_code = modal_list[0].key;
					}

					$modal_link_wrap.show();

					$modal_link.setSelectBox({
						'option': modal_list,
						'default': modal_code,
						'set': {
							'width': 230,
							use_custom_value: 'Y'
						},
						'change': function (res) {
							if (res.key !== data.custom.modal_code) {
								var tmp = {
									'modal_code': res.key
								};
								data.custom = $.extend(data.custom, tmp);
								that.change(data);
							}
						},
						eventOriginTarget: that.element,
					});
					break;

				default:
					var link_code_exist = false;
					if (data.use_link_code == 'Y') {
						$.each(menu_list, function (e, _link_data) {
							if (_link_data.key == data.link_code) {
								link_code_exist = true;
								return false;
							}
						});
						if (!link_code_exist) {
							var tmp = {
								'link': '',
								'link_url': '',
								'link_code': '',
								'use_link_code': 'N',
								'link_type': 'default'
							};
							data = $.extend(data, tmp);
							that.change(data);
						}

					}
					var link_code = data.use_link_code == 'Y';
					$delete_link[data.use_link_code == 'Y' ? 'show' : 'hide']();
					$delete_link.off('click').on('click', function () {
						$link_input.setSelectBox('set', '');
						$link_input.setInput('set', '');
						$link_input.setInput('setEnable');
						$delete_link.hide();
						$link_input.prop('readonly', false);
						link_code = false;
						var tmp = {
							'link': '',
							'link_url': '',
							'link_code': '',
							'use_link_code': 'N',
							'link_type': 'default'
						};
						data = $.extend(data, tmp);
						that.change(data);
					});

					$link_input.setSelectBox({
						'option': menu_list,
						'default': data.use_link_code == 'Y' ? data.link_code : 'not',
						'set': {
							'width': input_width,
							'use_custom_value': 'Y'
						},
						change: function (res) {
							if (res.key != data.link_code) {
								link_code = true;
								$link_input.setInput('setDisable');
								$link_input.prop('readonly', true);
								$delete_link.show();
								var tmp = {
									'link': $(res.value).text(),
									'link_url': $(res.value).text(),
									'link_code': res.key,
									'use_link_code': 'Y',
									'link_type': 'default'
								};
								data = $.extend(data, tmp);
								that.change(data);
							}
						}
					});

					if (link_code) {
						$link_input.setInput('setDisable');
					}
					data.link = data.link == null ? '' : data.link;
					var link_text = data.use_link_code == 'Y' ? data.link.replace("/", "") : data.link;
					$link_input.setInput({
						'event': ['blur', 'no_enter'],
						'default': link_text,
						'change': function (res) {
							if (!link_code) {
								if (res != data.link) {
									$link_input.prop('readonly', false);
									$delete_link.hide();
									var tmp = {
										'link': res,
										'link_url': res,
										'link_code': '',
										'use_link_code': 'N',
										'link_type': 'default'
									};
									data = $.extend(data, tmp);
									that.change(data);
								}
							}
						}
					});
					$link_input_wrap.show();
					if (target === 'footer') {
						$new_window_wrap.css('display', 'table-cell');
						$social_delete.css('margin-left', '0px');
					} else {
						$new_window_wrap.show();
					}
					break;
			}
		};

		changeLinkType(data.link_type);

		//단일 메뉴시 처리
		if (is_single_menu) {
			changeLinkType(link_type_list[0].key);
		} else { //다중메뉴시 셀렉트박스 처리
			$link_type.setSelectBox({
				'option': link_type_list,
				'default': data.link_type,
				'set': {
					'width': 120,
					'use_custom_value': 'N',
					'max_height': 300
				},
				change: function (res) {
					if (res.key != data.link_type) {
						changeLinkType(res.key);
						var tmp = {
							'link_type': res.key
						};
						switch (res.key) { // link_type 변경 시 custom 필드 초기화
							case 'sns_share':
							case 'video':
							case 'custom':
								tmp = {
									'link_type': res.key,
									'custom': ''
								};
								break;
							case 'tooltip':
								var custom_tmp = {
									'tooltip_position': 'top',
									'tooltip_title': '',
									'tooltip_new_window': 'N'
								};
								tmp = {
									'link_type': res.key,
									'custom': custom_tmp
								};
								break;
							default:
								break;
						}
						data = $.extend(data, tmp);
						that.change(data);
					}
				}
			});
		}

		$new_window.setCheck({
			value: function () {
				if (target === 'footer' && typeof data.link_type === 'undefined') {
					// 푸터 설정에서 link_type이 없을 때는 과거 SNS 바로가기 때 등록된 데이터로 새 창 true
					return true;
				}
				return data.new_window == 'Y';
			},
			change: function (res) {
				var tmp = {
					'new_window': res ? 'Y' : 'N'
				};
				data = $.extend(data, tmp);
				that.change(data);
			}
		});
	};

	setLink.prototype.change = function (data) {
		this.o.change(data);
	};

	setLink.prototype.get = function () {
		return this.element.val();
	};

	setLink.prototype.set = function (value) {
		return this.element.val(value);
	};

	setLink.prototype.setDisable = function () {
		this.disabled = true;
		this.element.prop("disabled", true);
		this.element.toggleClass('disabled', true);
	};
	setLink.prototype.setEnable = function () {
		this.disabled = false;
		this.element.prop("disabled", false);
		this.element.toggleClass('disabled', false);
	};

	setLink.prototype.disable = function () {
		this.disabled = true;
		this.element.prop("disabled", true);
		this.element.toggleClass('disabled', true);
	};
	setLink.prototype.enable = function () {
		this.disabled = false;
		this.element.prop("disabled", false);
		this.element.toggleClass('disabled', false);
	};

	setLink.prototype.destroy = function () {
		this.element.data('setInput', false);
	};

	function PLUGIN(o, d) {
		var $obj = $(this);
		if (typeof o == 'string') {
			var data = $obj.data('setLink');
			if (!data) $obj.data('setLink', (data = new setLink($obj, o)));
			return data[o](d);
		} else if (typeof o == 'object') {
			var data = $obj.data('setLink');
			if (typeof data != 'undefined') {
				if (data !== false) {
					data.destroy();
				}
			}
			$obj.data('setLink', (data = new setLink($obj, o)));
		}
		return this;
	}
	$.fn.setLink = PLUGIN;
})();


/**
 * 빈 링크 여부 체크
 * @param data		link_type을 포함하는 메뉴, 갤러리 또는 위젯
 * @return {boolean}	빈 링크거나 링크 타입이 옳지 않으면 true
 */
function checkEmptyLink(data) {
	var is_empty_link = false;
	var _data = data;
	if (typeof _data.link_type === 'undefined') {
		is_empty_link = true;
	} else {
		var _callnum = _data.callnum || '';
		var _file_code = _data.file_code || '';
		var _file_name = _data.file_name || '';
		var _link_email = _data.link_email || '';
		var _custom = _data.custom || '';
		var _link_code = _data.link_code || '';
		//	메뉴는 link_url, 다른 위젯은 link 사용
		var _link = _data.link || '';
		var _link_url = _data.link_url || '';
		switch (_data.link_type) {
			//TODO 모달도 처리되어야 함(현재는 메뉴에서 모달 링크 설정을 할 수 없어서 영향은 없는 듯)
			case 'call':
			case 'sms':
				if (!_callnum) is_empty_link = true;
				break;
			case 'file':
				if (!_file_code || !_file_name) {
					is_empty_link = true;
				} else if (typeof _data.file_size !== 'undefined') { // 메뉴의 경우 file_size가 저장되어 있지 않아서 넘겨줄 때만 체크
					if (_data.file_size <= 0) is_empty_link = true;
				}
				break;
			case 'link_email':
				if (!_link_email) is_empty_link = true;
				break;
			case 'video':
				if (!_custom) {
					is_empty_link = true;
				} else {
					if (typeof _custom === 'string') _custom = JSON.parse(data.custom);
					if (typeof _custom['video_url'] === 'undefined' || !_custom['video_url']) {
						is_empty_link = true;
					}
				}
				break;
			case 'tooltip':
				if (!_custom) {
					is_empty_link = true;
				} else {
					if (typeof _custom === 'string') _custom = JSON.parse(data.custom);
					if (typeof _custom['tooltip_title'] === 'undefined' || !_custom['tooltip_title']) {
						is_empty_link = true;
					}
				}
				break;
			case 'custom':
				if (!_custom) is_empty_link = true;
				break;
			case 'sns_share':
			case 'shopping':
				// 쇼핑 메뉴가 없으면 유효하지 않은 링크
				if (MENU) {
					var unit_data = MENU.getUnitData();
					var use_shopping = unit_data.use_shopping;
					if (use_shopping === 'N') is_empty_link = true;
				}
				break;
			case 'default':
			case '': // 17년 이전 default
				if (_data.use_link_code === 'Y') {
					if (!_link_code) {
						is_empty_link = true;
					}
				} else if (!_link && !_link_url) {
					is_empty_link = true;
				}
				break;
			default: // link_type이 옳지 않을 경우
				is_empty_link = true;
		}
	}
	return is_empty_link;
}


//imageEditor
(function () {
	var imageEditor = function (el, o) {
		var that = this;
		var default_option = {
			'url': '',
			'upload_option': {
				'url': '/admin/ajax/upload_image.cm',
				'mode': 'extra',
				'target': '',
				'target_code': ''
			}
		};
		this.aviary = {};
		this.element = $(el);
		this.$dummy_img = {};
		this.option = o;
		this.option = $.extend(default_option, this.option);

		this.init();
		this.element.off('click.imageEditor').on('click.imageEditor', function () {
			that.open();
		});
	};
	imageEditor.prototype.open = function () {
		var that = this;

		var url = that.option.url;
		that.$dummy_img = $('<img />').attr({
			'src': url,
			'id': makeUniq()
		});
		that.$dummy_img.css({
			'position': 'absolute',
			'left': '-99999px'
		});
		$('body').append(that.$dummy_img);
		that.aviary.launch({
			'image': that.$dummy_img[0].id,
			'hiresUrl': url,
			'url': url
		});
	};

	imageEditor.prototype.destroy = function () {
		this.element.off('click.imageEditor');
		this.option = {
			'url': ''
		};
		this.element.data('imageEditor', false);
	};


	imageEditor.prototype.set = function (url) {
		this.option.url = url;
	};

	imageEditor.prototype.init = function () {
		var that = this;
		if (isBlank(that.option.url))
			return;

		that.aviary = new Aviary.Feather({
			'apiKey': ADOBE_AVIARY_KEY,
			'authenticationURL': '/auth/aviary_auth.cm',
			'language': 'ko',
			'hiresWidth': 2000,
			'hiresHeight': 2000,
			'onSaveButtonClicked': function () {
				//  Important Signature’s must be unique for each editor.saveHiRes() call.
				//  See Authentication section.

				that.aviary.saveHiRes();
				return false;
			},
			'onSaveHiRes': function (imageID, newURL) {
				$.ajax({
					'type': 'POST',
					'data': {
						'external_url': newURL,
						'external': 'Y',
						'target': that.option.upload_option.target,
						'target_code': that.option.upload_option.target_code
					},
					'url': (that.option.upload_option.url),
					'dataType': 'json',
					'async': false,
					'cache': false,
					'success': function (result) {
						//that.$dummy_img.remove();
						if (typeof that.option['change'] == 'function') {
							that.option['change'](result.files);
						}

						that.aviary.close();
					}
				});

			},
			'onError': function (errorObj) {
				if (typeof that.option['error'] == 'function') {
					that.option['error'](errorObj);
				}
			}
		});
	};

	function PLUGIN(o, d) {
		var obj = $(this);
		if (typeof o == 'string') {
			var data = obj.data('imageEditor');
			if (!data) obj.data('imageEditor', (data = new imageEditor(obj, o)));
			return data[o](d);
		} else if (typeof o == 'object') {
			var data = obj.data('imageEditor');
			if (typeof data != 'undefined') {
				if (data !== false) {
					data.destroy();
				}
			}
			obj.data('imageEditor', (data = new imageEditor(obj, o)));
		}
		return this;
	}
	$.fn.imageEditor = PLUGIN;
})();

const clickBoGnbSiteManageToggle = function (menu_name, use_menu) {
	mixpanel.track('click_bo_gnb_sitemanage_toggle', {
		'site_code': SITE_CODE,
		menu_name,
		use_menu
	});
}