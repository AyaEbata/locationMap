// OVER_QUERY_LIMITがぁ…
// 故にひとつずつ処理
var i = 0;
setTimeout(function timer() {
    mapAddList(i);
    youtubeAddList(i);
    if (i == i && i < locationList.list.length-1) {
        i++;
        setTimeout(timer, 50);
    }
}, 0);

function mapAddList(i) {
    var item = locationList.list[i];
    var address = item.key.replace(/ /g, "");

    $.ajax({
        url: 'https://maps.googleapis.com/maps/api/geocode/json',
        dataType: 'json',
        data: {
            address: address,
            sensor: 'false',
            language: 'ja'
        },
        success: function(json) {
            // console.log(json);
            if (json.status == 'OK') {
                item['lat'] = json.results[0].geometry.location.lat;
                item['lng'] = json.results[0].geometry.location.lng;
            } else {
                item['lat'] = 34.691279;
                item['lng'] = 135.183025;
            }
            console.log(item['lat']);
            console.log(item['lng']);
        },
        error: function() {
            console.log("error");
        }
    });
}

function youtubeAddList(i) {
    var item = locationList.list[i];
    var mtitle = item.mtitle.replace(/\'/g, '');
    var title = item.title;

    $.ajax({
        url: 'https://www.googleapis.com/youtube/v3/search',
        dataType: 'jsonp',
        data: {
            key: 'AIzaSyAZrQgK3oR5NgcGPC9uCBp-RWmbX7x8Jg8',
            q: mtitle + '|' + title,
            part: 'id'
        },
        success: function(json) {
            // console.log(json);
            if (json.items.length == 0) {
                item['videoId'] = '';
            } else if (json.items[0].id.videoId == undefined) {
                item['videoId'] = json.items[1].id.videoId;                
            } else {
                item['videoId'] = json.items[0].id.videoId;                
            }
            console.log(item['videoId']);
        },
        error: function() {
            console.log("error");
        }
    });
}

function initialize() {
    console.log(locationList);

    var canvas = document.getElementById('map-canvas');
    var latlng = new google.maps.LatLng(34.691279, 135.183025);
    var mapOptions = {
        zoom: 13,       // ズーム
        center: latlng  // 中心座標
    };
    var map = new google.maps.Map(canvas, mapOptions);  // 地図表示

    var n = 0;
    setTimeout(function timer2() {
        var item = locationList.list[n];
        marker(map, item.lat, item.lng, n);
        
        if (n == n && n < locationList.list.length - 1) {
            n++;
            setTimeout(timer2, 50);
        } else {
            $('#text').hide();
        }
    }, 0);
}

function marker(map, latitude, longitude, n) {
    var icon = {
        anchor: new google.maps.Point(15, 15),     // 画像の支点
        scaledSize: new google.maps.Size(30, 30),  // 画像の大きさ
        url: 'img/play.png'  // 画像指定
    };
    var marker = new google.maps.Marker({
        map: map,
        position: new google.maps.LatLng(latitude, longitude),
        icon: icon
    });

    onMarkerClick(map, marker, n);
}

function onMarkerClick(map, marker, n){
    google.maps.event.addListener(marker, 'click', function(event) {
        var html = '<iframe id="player" type="text/html" width="320" height="195" src="http://www.youtube.com/embed/' + locationList.list[n].videoId + '?enablejsapi=1&origin=http://example.com&autoplay=1" frameborder="0"></iframe>';
        var infoWindow = new google.maps.InfoWindow({
            content: '「' + locationList.list[n].title +  '」<br>　＠' + locationList.list[n].location + '<br>' + html
        });
        infoWindow.open(map, marker);
    });
}
