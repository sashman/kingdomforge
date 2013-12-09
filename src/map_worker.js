//NO USED FOR NOW

self.addEventListener('message', function(e) {
  var data = e.data;
  switch (data.cmd) {
    case 'shift':
      
      //console.log(Crafty('PlayerCharacter'));


      break;
    case 'stop':
      self.postMessage('WORKER STOPPED: ' + data.msg );
      console.log('WORKER STOPPED: ' + data.msg);
      self.close(); // Terminates the worker.
      break;
    default:
      self.postMessage('Unknown command: ' + data.msg);
      console.log('WORKER STOPPED: ' + data.msg);
  };
}, false);