const Observer = (function ( id ) {
  const context = ( typeof id === 'undefined' )? document : id;
  const topics = {};
  const hOP = topics.hasOwnProperty;

  return {
    subscribe (topic, listener) {
      // Create the topic's object if not yet created
      if(!hOP.call(topics, topic)) topics[topic] = [];

      // Add the listener to queue
      var index = topics[topic].push(listener) -1;

      // Provide handle back for removal of topic
      return {
        remove () {
          delete topics[topic][index];
        }
      };
    },
    publish (topic, info) {
      // If the topic doesn't exist, or there's no listeners in queue, just leave
      if(!hOP.call(topics, topic)) return;

      // Cycle through topics queue, fire!
      topics[topic].forEach(function (item) {
        item(info != undefined ? info : {});
      });
    }
  };
});

///////////////////

class mySubject {
	constructor(){
		this.subjectContent = document.querySelector('.js-subject');
		this.value = '';
		this.subjectObserver = new Observer;
		

		this.subjectObserver.subscribe('update/text', (classer) => {
			this.keyUp(classer);
		});

		this.subjectObserver.publish('update/text', '.observer1');



		this.myObserver1 = new myObserver1(this.subjectObserver);
		this.myObserver2 = new myObserver2(this.subjectObserver);

		

	}

	updateBox(classSelector){
		document.querySelector(classSelector).innerHTML = this.value;
	}

	keyUp(classer){
		this.subjectContent.addEventListener('keyup', evt => {
			this.value = this.subjectContent.value;
			this.updateBox(classer);
		});	
	}


}

class myObserver1 {
	constructor(observer){
		this.observer = observer;

		this.observer.publish('update/text', '.observer2');
	}

}

class myObserver2 {
	constructor(observer){
		this.observer = observer;

		this.observer.publish('update/text', '.observer3');
	}
}

const app = new mySubject;