/*
The MIT License(MIT)

Copyright(c) 2007-2017 microting

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

function applyTooltipsToTrumbowygToolbars() {
  $('.trumbowyg-bold-button').attr('data-toggle', 'tooltip');
  $('.trumbowyg-bold-button').attr('data-placement', 'top');
  $('.trumbowyg-bold-button').data('toggle', 'tooltip');
  $('.trumbowyg-bold-button').data('placement', 'top');
  $('.trumbowyg-italic-button').attr('data-toggle', 'tooltip');
  $('.trumbowyg-italic-button').attr('data-placement', 'top');
  $('.trumbowyg-italic-button').data('toggle', 'tooltip');
  $('.trumbowyg-italic-button').data('placement', 'top');
  $('.trumbowyg-underline-button').attr('data-toggle', 'tooltip');
  $('.trumbowyg-underline-button').attr('data-placement', 'top');
  $('.trumbowyg-underline-button').data('toggle', 'tooltip');
  $('.trumbowyg-underline-button').data('placement', 'top');
}


function t(constant_name, default_constant) {
  var result = default_constant;

  if (typeof mt_i18n_hash !== 'undefined') {
    if (typeof mt_i18n_hash[constant_name] !== 'undefined') {
      result = mt_i18n_hash[constant_name];
    }
  }

  return result;
}

var iModalLevel = 0;

$(document).ready(function () {


  // moment.locale(moment.locale(), {
  //   week: {
  //     dow: 1
  //   } // Monday is the first day of the week
  // });

  // $(document).on('shown.lightbox', function (event) {
  //   iModalLevel = ($('.modal').length + $('.lightbox:visible').length);
  //   $("#lightboxOverlay").css('z-index', iModalLevel * 1000);
  //   $("#lightbox").css('z-index', iModalLevel * 1000);

  //   mtDebug('Number of remaining after show ' + iModalLevel);

  // });
  // $(document).on('hidden.lightbox', function (event) {
  //   iModalLevel = ($('.modal').length + $('.lightbox:visible').length);

  //   $('.popover').each(function (index) {
  //     $('[aria-describedby=' + $(this).attr('id') + ']').popover('destroy');
  //   });

  //   $('.tooltip').each(function (index) {
  //     $('[aria-describedby=' + $(this).attr('id') + ']').tooltip('destroy');
  //   });

  //   mtDebug('Number of remaining after hide ' + iModalLevel);

  // });

  // $(document).on('show.bs.modal', '.modal', function (event) {});
  // $(document).on('shown.bs.modal', '.modal', function (event) {
  //   $('.bootbox-close-button').removeClass('bootbox-close-button');
  //   iModalLevel = ($('.modal').length + $('.lightbox:visible').length);
  //   $(event.target).css('z-index', iModalLevel * 1000);

  //   setTimeout(function () {
  //     if (typeof $('.mt-quick-submit.in > .modal-dialog > .modal-content > .modal-footer > .mt-submit-button') !== 'undefined') {
  //       $('.mt-quick-submit.in').removeAttr('tabindex');

  //       $('.mt-quick-submit.in > .modal-dialog > .modal-content > .modal-footer > .mt-submit-button')
  //         .not('.btn-danger')
  //         .attr('tabindex', 1);

  //       $('.mt-quick-submit.in > .modal-dialog > .modal-content > .modal-footer > .mt-submit-button')
  //         .not('.btn-danger')
  //         .focus();

  //     }
  //   });

  //   mtDebug('Number of remaining after show ' + iModalLevel);
  //   applyTooltipsToTrumbowygToolbars();
  // });

  // function applyTooltipsToTrumbowygToolbars() {
  //   $('.trumbowyg-bold-button').attr('data-toggle', 'tooltip');
  //   $('.trumbowyg-bold-button').attr('data-placement', 'top');
  //   $('.trumbowyg-bold-button').data('toggle', 'tooltip');
  //   $('.trumbowyg-bold-button').data('placement', 'top');
  //   $('.trumbowyg-bold-button').tooltip();
  //   $('.trumbowyg-italic-button').attr('data-toggle', 'tooltip');
  //   $('.trumbowyg-italic-button').attr('data-placement', 'top');
  //   $('.trumbowyg-italic-button').data('toggle', 'tooltip');
  //   $('.trumbowyg-italic-button').data('placement', 'top');
  //   $('.trumbowyg-italic-button').tooltip();
  //   $('.trumbowyg-underline-button').attr('data-toggle', 'tooltip');
  //   $('.trumbowyg-underline-button').attr('data-placement', 'top');
  //   $('.trumbowyg-underline-button').data('toggle', 'tooltip');
  //   $('.trumbowyg-underline-button').data('placement', 'top');
  //   $('.trumbowyg-underline-button').tooltip();
  // }

  // $(document).on('hide.bs.modal', '.modal', function (event) {

  //   $('.popover').each(function (index) {
  //     $('[aria-describedby=' + $(this).attr('id') + ']').popover('destroy');
  //   });

  //   $('.tooltip').each(function (index) {
  //     $('[aria-describedby=' + $(this).attr('id') + ']').tooltip('destroy');
  //   });

  // });
  // $(document).on('hidden.bs.modal', '.modal', function (event) {
  //   iModalLevel = ($('.modal').length + $('.lightbox:visible').length);
  //   if (iModalLevel > 0) {
  //     $('body').css('padding-right', '15px');
  //     $('body').addClass('modal-open');
  //   }

  //   mtDebug('Number of remaining after hide ' + iModalLevel);
  // });

  // $('body').on('click', ':button[data-bootbox-confirm]', function (event) {

  //   var e = event || window.event;
  //   var target = e.target || e.srcElement;

  //   var target_button = $(target);
  //   if (!target_button.is("button")) {
  //     target_button = target_button.parent(":button[data-bootbox-confirm]");
  //   }

  //   mtShowBootBox({
  //     'bootbox-additional-classes': target_button.data("bootbox-additional-classes"),
  //     'bootbox-cancel-label': target_button.data("bootbox-cancel-label"),
  //     'bootbox-confirm': target_button.data("bootbox-confirm"),
  //     'bootbox-confirm-label': target_button.data("bootbox-confirm-label"),
  //     'bootbox-title': target_button.data("bootbox-title"),
  //     'escapable': true,
  //     'oncancel': target_button.data("oncancel"),
  //     'onsuccess': target_button.data("onsuccess"),
  //     'dangerous-action': (target_button.hasClass("dangerous-action") || target_button.hasClass("btn-danger"))
  //   })
  // });

  // $('#submit_form').click(function (event) {
  //   var e = event || window.event;
  //   var target = e.target || e.srcElement;

  //   $('#' + $(target).data('form-id')).submit();

  // });

  // $('#submit_form_edit').click(function () {
  //   $('form').submit();
  // });

  // $(function () {
  //   $('[data-toggle="tooltip"]').tooltip()
  // });

  // $(document).ajaxError(function (event, jqxhr, settings, exception) {
  //   if (jqxhr.status == 401) {
  //     window.location.reload();
  //   }
  // });

});


function mtShowBootBox(options) {

  var iThisLevel = (iModalLevel + 1);
  var generatedDialog = null;

  var successClasses = "btn-ar";
  if (options["dangerous-action"]) {
    successClasses += " btn-danger";
  } else {
    successClasses += " btn-success mt-submit-button";
  }

  var cancelLabel = t("cancel", "Cancel");
  if (typeof options["bootbox-cancel-label"] !== 'undefined') {
    cancelLabel = options["bootbox-cancel-label"];
  }
  var cancel = {
    label: cancelLabel,
    className: "btn-ar btn-default",
    callback: function (event) {
      mtDebug("CANCEL PRESSED!");

      if (typeof options["oncancel"] !== 'undefined') {
        eval(options["oncancel"]);
      }
    }
  };

  var successLabel = t("ok", "OK");
  if (typeof options["bootbox-confirm-label"] !== 'undefined') {
    successLabel = options["bootbox-confirm-label"];
  }
  var success = {
    label: successLabel,
    className: successClasses,
    callback: function () {
      if (typeof options["onsuccess"] !== 'undefined') {
        eval(options["onsuccess"]);
      }
    }
  };

  var buttons = {};

  if (options["dangerous-action"]) {
    buttons = {
      success: success,
      cancel: cancel
    };
  } else {
    buttons = {
      cancel: cancel,
      success: success
    };
  }

  var bootboxOptions = {
    closeButton: false,
    animate: false
  };

  if (typeof options["bootbox-title"] !== 'undefined') {
    mtDebug(options["bootbox-title"]);
    var title = options["bootbox-title"].match(/^eval\((.*)\);*$/);
    if (title === null) {
      bootboxOptions['title'] = options["bootbox-title"];
    } else {
      bootboxOptions['title'] = eval(title[1]);
    }
  }

  if (typeof options["escapable"] !== 'undefined' && options["escapable"] === true) {
    bootboxOptions['onEscape'] = function () {
      mtDebug("ESCAPE PRESSED!");

      if (typeof options["oncancel"] !== 'undefined') {
        eval(options["oncancel"]);
      }
    };
  }

  bootboxOptions['className'] = 'mt-modal-level-' + iThisLevel + ' ';
  if (typeof options["bootbox-additional-classes"] !== 'undefined') {
    bootboxOptions['className'] += options["bootbox-additional-classes"];
  }

  var message = options["bootbox-confirm"].match(/^load\((.*)\);*$/);
  if (message === null) {
    bootboxOptions['buttons'] = buttons;

    message = options["bootbox-confirm"].match(/^eval\((.*)\);*$/);
    if (message === null) {
      bootboxOptions['message'] = options["bootbox-confirm"];
      generatedDialog = bootbox.dialog(bootboxOptions);
    } else {
      bootboxOptions['message'] = eval(message[1]);
      generatedDialog = bootbox.dialog(bootboxOptions);
    }
  } else {
    bootboxOptions['buttons'] = buttons;
    $.get(message[1], function (html_content) {
      bootboxOptions['className'] += ' mt-has-html-content';
      bootboxOptions['message'] = html_content;
      generatedDialog = bootbox.dialog(bootboxOptions);
    });
  }

  return generatedDialog;
}

function applyTrumbowygToElement(jqeTargetElement) {
  jqeTargetElement.val(jqeTargetElement.val()
    .replace(/\r\n|\n|\r/g, "<br>"));

  jQuery.trumbowyg.langs.en = {
    close: ""
  };

  jqeTargetElement.trumbowyg({
    prefix: 'trumbowyg-',
    fullscreenable: false,
    semantic: false,
    btns: ['bold', 'italic', 'underline'],
    closable: jqeTargetElement.hasClass('trumbowyg-closable'),
    tagsToRemove: ['a', 'h1', 'h2', 'h3', 'h4'],
    inlineElementsSelector: 'b, i, u',
    resetCss: true,
    removeformatPasted: true,
  });


  if (jqeTargetElement[0].disabled == true) {
    jqeTargetElement[0].disabled = false;
  }

  jqeTargetElement.closest("form").submit(function () {

    jqeTargetElement.val(jqeTargetElement.val()
      .replace(/<div>|<p>/g, "<br>")
      .replace(/<\/div>|<\/p>/g, "")
      .replace(/(<(!DOCTYPE|abbr|acronym|address|applet|area|article|aside|audio|base|basefont|bdi|bdo|big|blockquote|body|button|canvas|caption|center|cite|code|col|colgroup|command|datalist|dd|del|details|dfn|dir|dl|dt|em|embed|fieldset|figcaption|figure|font|footer|form|frame|frameset|h1|h2|h3|h4|h5|h6|head|header|hgroup|hr|html|iframe|img|input|ins|kbd|keygen|label|legend|li|link|map|mark|menu|meta|meter|nav|noframes|noscript|object|ol|optgroup|option|output|p|param|pre|progress|q|rp|rt|ruby|s|samp|script|section|select|small|source|span|strike|strong|style|sub|summary|sup|table|tbody|td|textarea|tfoot|th|thead|time|title|tr|track|tt|ul|var|video|wbr)[0-9a-zA-Z\=\'\"\-\:\;\.\,\s\(\)\#\>]*>)|(<\/(!DOCTYPE|abbr|acronym|address|applet|area|article|aside|audio|base|basefont|bdi|bdo|big|blockquote|body|button|canvas|caption|center|cite|code|col|colgroup|command|datalist|dd|del|details|dfn|dir|dl|dt|em|embed|fieldset|figcaption|figure|font|footer|form|frame|frameset|h1|h2|h3|h4|h5|h6|head|header|hgroup|hr|html|iframe|img|input|ins|kbd|keygen|label|legend|li|link|map|mark|menu|meta|meter|nav|noframes|noscript|object|ol|optgroup|option|output|p|param|pre|progress|q|rp|rt|ruby|s|samp|script|section|select|small|source|span|strike|strong|style|sub|summary|sup|table|tbody|td|textarea|tfoot|th|thead|time|title|tr|track|tt|ul|var|video|wbr)>)/g, ""));
  });
}

function success_message(message) {
  $(function () {
    new PNotify({
      title: 'Success',
      text: message,
      type: 'success',
      nonblock: {
        nonblock: true,
        nonblock_opacity: .2
      },
      delay: 1000,
      hide: true,
      history: false
    });
  });
}

function error_message(message) {
  $(function () {
    new PNotify({
      title: 'Error',
      text: message,
      type: 'error',
      nonblock: {
        nonblock: true,
        nonblock_opacity: .2
      },
      delay: 5000,
      hide: true,
      history: false
    });
  });
}

function show_notification(data) {
  if (data.error) {
    error_message(data.error);
  } else {
    success_message(data.message);
  }
}

function html_safe(str) {
  if (str === null) return str;

  if (typeof str === 'undefined') {
    return str;
  } else {
    return str.toString().replace(/'/g, "\\&apos;").replace(/"/g, "\\&quot;");
  }
}

function mtDebug(message) {
  console.log(message + ' ');
  console.trace();
}
