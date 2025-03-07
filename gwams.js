let xhr = new XMLHttpRequest();
xhr.open('GET', 'words.txt');
xhr.send();

rawdic = []

msg = function(type, payload) {
	self.postMessage([type, payload])
}

log = function(text) {
	msg(0, text)
}

xhr.onload = function() {
  if (xhr.status != 200) {
    log(`Error ${xhr.status}: ${xhr.statusText}`);
  } else {
    log(`Done, got ${xhr.response.length} bytes`);
	rawdic = xhr.responseText.split("\n")
	log(`Loaded ${rawdic.length} words into dic[]`)
  }
};

xhr.onprogress = function(event) {
  if (event.lengthComputable) {
    log(`Received ${event.loaded} of ${event.total} bytes`);
  } else {
    log(`Received ${event.loaded} bytes`);
  }

};

xhr.onerror = function() {
  log("🫠 Failed to load dictionary!");
};

