
  let private_room = document.querySelectorAll('.privateChatRoom');

  //private_room.forEach((item) => {
    private_room[0].addEventListener('submit', (e)=>{
      e.preventDefault();
      e.stopPropagation();
      let anothersocket_id = e.target.querySelector('.to-private').value;
      let msg = e.target.querySelector('.input-private').value;

      socket.emit('private message', {id: anothersocket_id, msg:msg});
      console.log('submit: ', anothersocket_id, msg);
    });

socket.on('private message', (from_id, msg)=>{
  let node = document.querySelectorAll('.messages-private')[0];
  let fullmsg = "from: "+ from_id + ": " + msg;

  appendToPrivateMsg(node, fullmsg)
})

function appendToPrivateMsg(node, msg){
  let li = document.createElement('li');
  li.textContent = msg;

  node.appendChild(li);
}
