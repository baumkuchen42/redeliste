function update_user_state(data, userid){
    for(var x in data){
        var channel = data[x];
        var found = false;
        for(var y in data[x]["current_list"]){
            var user = data[x]["current_list"][y];
            if (user == userid ) { //todo: comparing the names is stupid, but sending all the ids is too...
               found = true;
            }
         }
         if (found) {
            document.getElementById(channel.channel_id).innerText = "Lower "+ channel.name;
            is_channel_hand_up[channel.channel_id] = true;
            found = false;
         } else {
             document.getElementById(channel.channel_id).innerText = "Raise "+ channel.name;
             is_channel_hand_up[channel.channel_id] = false;
         }
     }
}

function add_user_button(socket, id, name){
    document.getElementById(id).addEventListener("click", function(){
        if(is_channel_hand_up[id]){
            // The hand is up  -> we should lower it 
            socket.emit('lower_hand_event', {channel_id: id, });
            is_channel_hand_up[id] = false;
            document.getElementById(id).innerText = "Raise " +name;
            // TODO: maybe wait for confirmation
        }
        else{
            // The hand is down -> we should raise it
            socket.emit('raise_hand_event', {channel_id: id});
            is_channel_hand_up[id] = true;
            document.getElementById(id).innerText = "Lower "+name;
            // TODO: maybe wait for confirmation
        }
        return false;
    });
}

function update_channel_lists(data){
    console.log(data);
    for(var x in data){
        var channel = data[x];
        var sel = "#channel_" + channel.channel_id + " div.list-container" ;
        var ele = document.querySelector(sel);
        ele.innerHTML = '';
        var ol = document.createElement("ol"); 
        for(var y in data[x]["current_list"]){
            var user = data[x]["current_list"][y];
            var li = document.createElement("li"); 
            li.appendChild(document.createTextNode(user));
            if(data[x]["current_id_list"]){
                var span = document.createElement("span"); 
                span.classList.add("close");
                span.setAttribute("channel_id", data[x]["channel_id"]);
                span.setAttribute("user_id", data[x]["current_id_list"][y]);
                span.onclick = function(event) { remove_raise(event.target.getAttribute("user_id"), event.target.getAttribute("channel_id")); };
                span.innerText = "X";
                li.appendChild(span);
            }
            ol.appendChild(li);
        }
        ele.appendChild(ol);
    }
}

function remove_raise(id, channel_id){
    socket.emit('remove_raise', {user_id: id, channel_id: channel_id});
}