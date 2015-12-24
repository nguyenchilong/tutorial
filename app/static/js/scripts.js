/**
 * Created by longnc on 12/2/15.
 */

$.fn.serializeObject = function() {
    var o = {}, a = this.serializeArray();
    $.each(a, function() {
        if (o[this.name]) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = this.value || '';
        }
    });
    return o;
};
/* ========================================== end my plugin ========================================================= */
$(function (e) {
    //var _baseUrl = $('#_baseUrl').val(), _port = $('#_port').val(), socket = io.connect(_baseUrl+':'+_port);
    // call data tables plugin run
    $("table.listOrders").DataTable({
        dom: "Zlfrtip",
        caption: {},
        //scrollY: "700px",
        scrollCollapse: true,
        paging: false,
        columnDefs: [{
            type: "salary-grade",
            targets: -1
        }],
        info: false,
        searching: false,
        colResize: {
            /*
            tableWidthFixed: false,
            rtl: true,
            exclude: [0,1,2],
            handleWidth: 10,
            resizeCallback: function(column) {
                alert("Column Resized");
            }
            */
        }
    });

    // handler for action in pos system call to server process
    $("body").on("click", ".btnSet", function(){
        $(".modal-settings").modal({ show : true, keyboard : false, backdrop : "static" });
    });

    $("body").on("click", ".showProfile", function(){
        var _ele = $(this).parents("tr.lines");
        $.ajax({
            url: "/profiles",
            type: "POST",
            data: {
                token: $("#_token").val(),
                userid: _ele.attr("rel"),
                apiUrl: $('#apiUrl').val(),
                jsonTmp: _ele.find("td.tdImg").find('div.jsonPopup').text()
            },
            dataType: 'JSON',
            //async: false,
            beforeSend: function() {$(".loadingBox").show();},
            success: function(response) {
                var _items = response.orders, _info = (JSON.parse(response.info) || []);
                console.log(_info.EmailAddress);
                $('.picProfile img').attr('src', _info.ProfilePictureSource);
                $('#pemail').text(_info.EmailAddress);
                $('#pphone').text(_info.PhoneNumber);
                $('#fullname').text(_info.FirstName);
                if(_items.length > 0){
                    var html = '<table class="ordersPopup display" cellspacing="0" width="100%">';
                    html += '<thead><tr><th>Outlet Info</th><th>Order Info</th><th>Order Details</th></tr><tbody>';
                    for(var i = 0; i < _items.length; i++){
                        var _item = _items[i];
                        html += '<tr>';
                        html += '   <td>';
                        html += '       <b>'+_item.OutletName+'</b><br/>';
                        html += '       <label>'+_item.OutletAddress+'</label>';
                        html += '   </td>';
                        html += '<td>';
                        html += '   Status: <b>'+_item.StatusName+'</b><br/>';
                        html += '   Ordered: <b>'+_item.OrderDate+'</b><br/>';
                        html += '   Price: <b>'+_item.TransactionValue+'</b>';
                        html += '</td>';
                        if(_item.details != undefined && _item.details.length > 0) {
                            var _itemDetails = '';
                            for(var d = 0; d < _item.details.length; d++) {
                                var _detail = _item.details[d], _lao = '', _isLast = (d == (_item.details.length - 1) ? ' itemLast' : '');
                                _itemDetails += '<div class="itemOrder'+_isLast+'">';
                                _itemDetails += '<p class="rowProfiles">Menu: <b>'+_detail.MenuName+'</b> | <b><i class="fa fa-money"></i>&nbsp;'+_detail.Price+'</b> | <b>'+_detail.Quantity+'</b></p>';
                                _itemDetails += '<p class="rowProfiles">Plucode: <b>'+_detail.PLUCODE+'</b></p>';
                                if(_detail.Addon != '' || _detail.Addon != undefined){
                                    var _addon = (JSON.parse(_detail.Addon) || []);
                                    if(_addon.length > 0){
                                        for(var a = 0; a< _addon.length; a++){
                                            _lao += '<b>'+_addon[a].addonName+'</b> | ';
                                            _lao += '<b><i class="fa fa-money"></i>&nbsp;'+_addon[a].addonPrice+'</b> - ';
                                        }
                                        _lao = _lao.substr(0, _lao.length - 3)
                                    }
                                }
                                _itemDetails += '<p class="rowProfiles">Addon: '+_lao+'</p>';
                                _itemDetails += '<p class="rowProfiles">Variant: <b>'+_detail.VariantName+'</b> | <i class="fa fa-money"></i>&nbsp;<b>'+_detail.VariantPrice+'</b></p>';
                                _itemDetails += '</div>';
                            }
                            html += '<td>'+_itemDetails+'</td>';
                        } else {html += '<td>&nbsp;</td>';}
                        html += '</tr>';
                    }
                    html += '</tbody></table>';
                    $('#listOrders').empty().html(html);
                    // datatables refresh
                    $("table.ordersPopup").DataTable({
                        dom: "Zlfrtip",
                        scrollCollapse: true,
                        paging: false,
                        autoWidth: false,
                        columnDefs: [{width: "30%", targets: [0,1]}, {width: "40%", targets: 2}],
                        info: false,
                        searching: false
                    });
                    $(".loadingBox").hide();
                    $(".modalProfiles").modal({show: true, keyboard: false, backdrop: "static"});
                }
            }
        }).error(function(data, err, e, o){
            $(".loadingBox").hide();
            console.log(err);
        });

    });

    // submit setting form
    $("body").on("click", ".btnSubmit", function() {
        /*var params = JSON.stringify($("form#formSettings").serializeObject());
        socket.emit('refreshOrders', params);
        socket.on('delayRefresh', function(data){
            console.log(data.msg);
        });
        */
    });



    // auto submit form with time set in setting form ==================================================================
    var _rt = $('#refreshTime').val(), _ttl = (parseInt(_rt) || 15) * 1000;
    setTimeout(function(){console.log('Refresh List Orders After '+_ttl+'s'); $("form#formSettings").submit();}, _ttl);
// end function ready ===========================================
});


