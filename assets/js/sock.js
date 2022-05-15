function getRandom (list) {
    return list[Math.floor((Math.random()*list.length))];
}
// escape
function escape(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
}

function previewFile(input){
    var file = $("input[type=file]").get(0).files[0];
    if(file){
      var reader = new FileReader();

      reader.onload = function(){
          $('#imageArea').val(reader.result);
      }

      reader.readAsDataURL(file);
    }
}

$(document).ready(function () {
    var username = 'None';
    var loginAudio = new Audio('/assets/sound/userConnect.wav');
    var msgAudio = new Audio('/assets/sound/incomingMsg.wav');
    socket = io();
    $('#join').click(function(){
        var user = $('#username').val();
        if(user.trim().length > 0){
            $('#myName').text(user);
            $('#loginPage').hide();
            $('#chatPage').show();
            username = user;
            socket.emit('login',username);
        }else{
            alert('Please enter username');
        }
    });
    $('#send').click(function () {
        var image = $('#imageArea').val();
        var message = escape($('#message').val().substr(0, 500));
        if (image != 'none') {
            socket.emit('image', username, image);
            var imageContent = "<span class=\"d-flex justify-content-end\">You</span><div class=\"d-flex justify-content-end\"><img class=\"border\" src='" + image + "' style='width:100px;height:100px;'></div>";
            $('#contentMessage').append(imageContent);
            $("#contentMessage").scrollTop($("#contentMessage")[0].scrollHeight)
        } else {
            if (message.trim().length === 0) {
                alert("Write something...");
                return false;
            }
            var contentHtml = "<span class=\"d-flex justify-content-end\">You</span><div class=\"d-flex justify-content-end\"><div class=\"min-150 p-2 border rounded bg-light text-black\">"+message+"</div></div>";
            $('#contentMessage').append(contentHtml);
            $("#contentMessage").scrollTop($("#contentMessage")[0].scrollHeight)
            $('#message').val('');
            socket.emit('message', username, message);
        }
        
        
    })
    socket.on('message', function (username, msg) {
        var contentHtml = "<span class=\"d-flex justify-content-start\">"+username+"</span><div class=\"d-flex justify-content-start\"><div class=\"min-150 p-2 border rounded text-black bg-light\">"+msg+"</div></div>";
        $('#contentMessage').append(contentHtml);
        $("#contentMessage").scrollTop($("#contentMessage")[0].scrollHeight)
        msgAudio.play();
        
    });
    socket.on('image', function (username, image) {
        var imageContent = "<span class=\"d-flex justify-content-start\">"+username+"</span><div class=\"d-flex justify-content-start\"><img class=\"border\" src='" + image + "' style='width:100px;height:100px;'></div>";
        $('#contentMessage').append(imageContent);
        $("#contentMessage").scrollTop($("#contentMessage")[0].scrollHeight)
        msgAudio.play();
    })
    socket.on('login', function(msg) {
        var contentHtml = "<span class=\"d-flex text-success justify-content-start\">System</span><div class=\"d-flex justify-content-start\"><div class=\"min-150 p-2 border rounded text-black bg-light\">New user "+msg+" connected !!</div></div>";
        $('#contentMessage').append(contentHtml);
        $("#contentMessage").scrollTop($("#contentMessage")[0].scrollHeight)
        loginAudio.play();
        
    });
    
    socket.on('logout', function(msg) {
        if(msg != 'None'){
            var contentHtml = "<span class=\"d-flex text-success justify-content-start\">System</span><div class=\"d-flex justify-content-start\"><div class=\"min-150 p-2 border rounded text-black bg-light\">"+msg+"</div></div>";
            $('#contentMessage').append(contentHtml);
            $("#contentMessage").scrollTop($("#contentMessage")[0].scrollHeight)
        }
        
        
    });
});