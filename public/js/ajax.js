function ajaxRequest(url, method, data, callback) {
        $.ajax({
            url: url,
            type: method,
            data: data,
            success: function(data, textStatus, request) {
                callback(null, data);
            },
            error: function(e) {
                callback(e);
            }
        })
}
