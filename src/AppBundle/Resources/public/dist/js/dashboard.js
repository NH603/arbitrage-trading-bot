$( document ).ready(function() {
    getAjaxData();

    setInterval(function(){
        if(running === true) {
            $.post(Routing.generate('isRunning', {}), function (data) {
                if(data === 'ko'){
                    running = false;
                    stopRunning();
                }
            });
        }

        getAjaxData();
    }, interval * 1000);


    $("#start-btn").on( 'click', function (e) {
        e.preventDefault();
        var form = document.getElementById("trading-form");
        if(form.checkValidity()){
            var thresholdUsd = $("#threshold-usd").val();
            var orderValueBtc = $("#order-value-btc").val();
            var tradingTimeMinutes = $("#trading-time-minutes").val();
            var addOrSubToOrderUsd = $("#add-or-sub-to-order-usd").val();
            var maxOpenOrders = $("#max-open-orders").val();

            $.post( Routing.generate('startTrading', {thresholdUsd: thresholdUsd, orderValueBtc:orderValueBtc, tradingTimeMinutes:tradingTimeMinutes, addOrSubToOrderUsd:addOrSubToOrderUsd, maxOpenOrders:maxOpenOrders}), function( data ) {
                if(data.running === true) {
                    $("#start-btn").removeClass('btn-primary').addClass('btn-default');
                    $("#stop-btn").removeClass('btn-default').addClass('btn-danger');
                    $("#trading-since").html("Trading start time: " + data.startDate);
                    $("#max-open-orders").prop('disabled', true);
                    $("#trading-time-minutes").prop('disabled', true);

                    running = true;
                }
            });
        } else{
            form.reportValidity();
        }
    });

    $("#stop-btn").on( 'click', function (e) {
        e.preventDefault();
        $.post( Routing.generate('stopTrading', {}), function( data ) {
            if(data.running === false) {

                stopRunning();

                running = false;
            }
        });
    });

    $("#increase-threshold-usd").on('click', function (e) {
        var thresholdUsd = $("#threshold-usd").val();
        if(!thresholdUsd || isNaN(thresholdUsd)){
            thresholdUsd = 0;
        }
        thresholdUsd ++;
        $("#threshold-usd").val(thresholdUsd);
        postTradeParameters();
    });

    $("#decrease-threshold-usd").on('click', function (e) {
        var thresholdUsd = $("#threshold-usd").val();
        if(!thresholdUsd || isNaN(thresholdUsd)){
            thresholdUsd = 0;
        }
        thresholdUsd --;
        if(thresholdUsd <= 1){
            thresholdUsd = 1;
        }
        $("#threshold-usd").val(thresholdUsd);
        postTradeParameters();
    });

    $("#increase-order-value-btc").on('click', function (e) {
        var orderValueBtc = $("#order-value-btc").val();
        if(!orderValueBtc || isNaN(orderValueBtc)){
            orderValueBtc = 0;
        }
        orderValueBtc  = (parseFloat(orderValueBtc) + 0.001);
        $("#order-value-btc").val(orderValueBtc);
        postTradeParameters();
    });

    $("#decrease-order-value-btc").on('click', function (e) {
        var orderValueBtc = $("#order-value-btc").val();
        if(!orderValueBtc || isNaN(orderValueBtc)){
            orderValueBtc = 0;
        }
        orderValueBtc  = (parseFloat(orderValueBtc) - 0.001);
        if(orderValueBtc <= 0.001){
            orderValueBtc = 0.001;
        }
        $("#order-value-btc").val(orderValueBtc);
        postTradeParameters();
    });

    $("#increase-add-or-sub-to-order-usd").on('click', function (e) {
        var addOrSubToOrderUsd = $("#add-or-sub-to-order-usd").val();
        if(!addOrSubToOrderUsd || isNaN(addOrSubToOrderUsd)){
            addOrSubToOrderUsd = 0;
        }
        addOrSubToOrderUsd ++;
        $("#add-or-sub-to-order-usd").val(addOrSubToOrderUsd);
        postTradeParameters();
    });

    $("#decrease-add-or-sub-to-order-usd").on('click', function (e) {
        var addOrSubToOrderUsd = $("#add-or-sub-to-order-usd").val();
        if(!addOrSubToOrderUsd || isNaN(addOrSubToOrderUsd)){
            addOrSubToOrderUsd = 0;
        }
        addOrSubToOrderUsd --;
        if(addOrSubToOrderUsd <= 0){
            addOrSubToOrderUsd = 0;
        }
        $("#add-or-sub-to-order-usd").val(addOrSubToOrderUsd);
        postTradeParameters();
    });

    $("#threshold-usd, #order-value-btc, #add-or-sub-to-order-usd").on('change', function (e) {
        if(running === true) {
            postTradeParameters();
        }
    });
});

function postTradeParameters() {
    var thresholdUsd = $("#threshold-usd").val();
    var orderValueBtc = $("#order-value-btc").val();
    var addOrSubToOrderUsd = $("#add-or-sub-to-order-usd").val();
    $.post(Routing.generate('changeTradeParameters', {thresholdUsd:thresholdUsd, orderValueBtc:orderValueBtc, addOrSubToOrderUsd:addOrSubToOrderUsd}), function (data) {
        $("#threshold-usd").val(data.thresholdUsd);
        $("#order-value-btc").val(data.orderValueBtc)
        $("#add-or-sub-to-order-usd").val(data.addOrSubToOrderUsd)
    });
}

function stopRunning(){
    $("#start-btn").removeClass('btn-default').addClass('btn-primary');
    $("#stop-btn").removeClass('btn-danger').addClass('btn-default');
    $("#trading-since").html("");
    $("#trading-time-minutes").prop('disabled', false);
    $("#max-open-orders").prop('disabled', false);
}

function getAjaxData(){
    $.post(Routing.generate('balance', {}), function (data) {
        $("#balance-table").html(data);
    });

    $.post(Routing.generate('ticker', {}), function (data) {
        $("#ticker-table").html(data);
    });

    $.post(Routing.generate('difference', {}), function (data) {
        $("#difference-table").html(data);
    });

    $.post(Routing.generate('orderPair', {}), function (data) {
        $("#order-pair-table").html(data);
    });
}
