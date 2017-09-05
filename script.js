define(['jquery'], function ($) {
    var CustomWidget;
    CustomWidget = function () {
        var self = this,
            Modal = require('lib/components/base/modal'),
            _support_modal = null,
            user_account_id,
            open_modal = function (account_id) {
                self._support_modal = new Modal({
                    class_name: 'js_support_widget_action',
                    init: function ($modal_body) {
                        $modal_body
                            .trigger('modal:loaded')
                            .html("<iframe src='https://" + self.system().domain + "/_support/accounts/detail/" + self.user_account_id + "?compact=yes' class='_support-frame'></iframe>");
                        $("._support-frame").parent().addClass('_support-frame-modal');
                        $(".js_support_widget_action iframe").on("load", function () {
                            $(this).contents().find("#page_holder").css({left: "3px"});
                            $(this).contents().find("#page_holder .work-area").css({"padding-left": "0px"});
                            $(this).contents().find(".js-card-back-button").remove();
                        });
                        $modal_body
                            .trigger('modal:centrify');

                    },
                    destroy: function () {
                        $(".js_support_widget_action iframe").off("load");
                    }
                });
            };
        self.callbacks = {
            init: function () {
                return true;
            },
            render: function () {
                var w_code = self.get_settings().widget_code,
                    button = 'Account ID hasn\'t been found',
                    icon = '/upl/' + w_code + '/widget/images/not_found.png',
                    button_class = 'js-without-account';
                var params = {};
                var callback = function (template) {
                    var markup = template.render(params),
                        css = '<link type="text/css" rel="stylesheet" href="/upl/' + w_code + '/widget/style.css" >';
                    $(".card-widgets__elements").prepend(markup);
                    $(".js-ac-caption").prepend(css);
                };
                $('#_support_widget').remove();

                if (self.system().area == 'ccard' || self.system().area == 'lcard' || self.system().area == 'cucard') {
                    if ($(".linked-form__field__value-name_company input").val() != undefined) {
                        self.user_account_id = $(".linked-form__field__value-name_company input").val().split("|")[0];
                        if (self.user_account_id == parseInt(self.user_account_id)) {
                            button = 'Account: ' + self.user_account_id;
                            icon = '/upl/' + w_code + '/widget/images/person.png';
                            button_class = 'ac-form-button js-_support_open';
                        }
                    } else if (parseInt($('textarea[id=person_name]').val().replace ( /[^\d.]/g, '' )) > 0) {
                        self.user_account_id = parseInt($('textarea[name="lead[NAME]"]').val().replace ( /[^\d.]/g, '' ));
                        if (self.user_account_id == parseInt(self.user_account_id)) {
                            button = 'Account: ' + self.user_account_id;
                            icon = '/upl/' + w_code + '/widget/images/person.png';
                            button_class = 'ac-form-button js-_support_open';
                        }
                    }
                } else if (self.system().area == 'comcard') {
                    if ($("#person_name").html() != undefined) {
                        self.user_account_id = $("#person_name").html().split("|")[0];
                        if (self.user_account_id == parseInt(self.user_account_id)) {
                            button = 'Account: ' + self.user_account_id;
                            icon = '/upl/' + w_code + '/widget/images/person.png';
                            button_class = 'ac-form-button js-_support_open';
                        }
                    }
                }
                params = {account: button, icon: icon, button_class: button_class};
                self.render({
                    href: '/templates/template.twig',
                    base_path: self.params.path,
                    load: callback
                }, params);

                return true;
            },
            bind_actions: function () {
                $(document).on('click', '.js-_support_open', function (e) {
                    open_modal(self.user_account_id);
                });
                return true;
            },
            destroy: function () {
                $("#_support_widget").remove();
                $(document).off('click', '.js-_support_open');
                return true;
            },
            onSave: function () {
                return true;
            },
            settings: function () {
                return true;
            }
        };
        return this;
    };

    return CustomWidget;
});
