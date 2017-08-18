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
////////////////////////////////// APP STARTS HERE ////////////////////////////

class Task {

	constructor(){

		this.tasklist    = ( localStorage['array'] || null ) ? JSON.parse(localStorage['array']) : [];

		this.taskObserver = new Observer;
		
		this.taskObserver.subscribe('send/array', evt => {
			() => { return this.tasklist; };
		});

		this.displayObserve = new Display(this.taskObserver);

	}


	// add
	add(id, title, project, time){

		this.tasklist.push({ id: id, title: title, project: project, time: time});
		this.update();

	}
 

	// edit
	edit(id, title, project, time){

		const _editItem   = this.tasklist.find(item => item.id === parseInt(id));  
		_editItem.title   = title;
		_editItem.project = project;
		_editItem.time    = time;
		this.update();

	}


	// delete
	delete(id){

		let _toRemove    = document.querySelector('.is-deleting');
    let _deleteItem  = this.tasklist
                          .map((item, idx) => ({ id: item.id, idx }))
                          .find( item => item.id == id );


    this.tasklist.splice(_deleteItem.idx, 1);
    _toRemove.remove();
    this.update();

	}


	// Update LocalStorage
	update(){
	
		//localStorage["array"] = JSON.stringify(this.tasklist);

		return this.tasklist;
	
	}


	// Display List on creation
	initialize(){

	}


}


class Display {

	constructor(observer){

		this.displayobserver = observer;
		this.totalItem = [];

		
		this.display();	


		this.context = document.getElementById('logger');
		this.el      = {
										form : this.context.querySelector('.js-task-form'),
										title : this.context.querySelector('.js-task-name'),
										project : this.context.querySelector('.js-task-project'),
										time : this.context.querySelector('.js-task-time'),
										submit : this.context.querySelector('.js-task-log'),
										list : this.context.querySelector('.js-task-list'),
										confirm : this.context.querySelector('.js-confirmation')
									 }


		
	}

	total(){
		
		if( this.totalItem.length > 0 ){
			let _total = this.totalItem.map( item => parseInt(item.time) || 0 ).reduce( (sum, value) => sum + value );

			document.querySelector('.js-task-total').innerHTML = _total;
		}
	}

	// show 
	display(){

		alert(this.displayobserver.publish('send/array'));
		/*this.displayobserver.update = item => {

			this.totalItem = item;
			let _items = item.map( item => {
				return `<div class='js-task-item'>
									<p>
										<span class='project'>${item.project} </span> 
										<span class='title'>${item.title}</span> 
										<span class='time'>${item.time}</span> 
										<span class='controls'>
											<a class='js-edit' data-id='${item.id}' data-title='${item.title}' data-project='${item.project}' data-time='${item.time}'>Edit</a>
											<a class='js-delete' data-id='${item.id}'>Delete</a>
										</span>
									</p> 
							  </div>`;
			}).reverse().join('');

			document.querySelector('.js-task-list').innerHTML = _items;
			this.editEvent();
			this.deleteEvent();
			this.total();

		}*/

	}


	// Edit Event
	editEvent(){

		let _editButton = document.querySelectorAll('.js-edit');
		
		_editButton.forEach( button => {
			button.addEventListener('click', event => {
				event.preventDefault();

				let _currentTarget = event.target;
				let _id            = _currentTarget.dataset.id;
				let _title         = _currentTarget.dataset.title;
				let _project       = _currentTarget.dataset.project;
				let _time          = _currentTarget.dataset.time;

				this.el.form.classList.add('is-editing');
      	this.el.title.focus();

      	this.el.form.dataset.id    = _id;
      	this.el.submit.textContent = this.el.submit.dataset.labelEdit;


      	this.el.title.value   = _title;
      	this.el.project.value = _project;
      	this.el.time.value    = _time;

      	let _children = this.el.list.children;

      	for( let item of _children ){

      		item.classList.remove('is-editing');

      	}

      	_currentTarget.parentElement.parentElement.parentElement.classList.add('is-editing');

			});

		});
		
	}


	// Delete Event
	deleteEvent(){

		let _deleteButton = document.querySelectorAll('.js-delete');

		_deleteButton.forEach( button => {
			button.addEventListener('click', event => {
				event.preventDefault();

				let _currentTarget = event.target;
				let _id            = _currentTarget.dataset.id;
				
				this.el.form.dataset.id = _id;

				this.el.confirm.classList.add('show');
				
				_currentTarget.parentElement.parentElement.parentElement.classList.add('is-deleting');

			});

		});

	}

}


class TaskAction {

	constructor(context){
		this.localStore  = window.localStorage;
		this.taskactor   = new Task;
		this.context     = document.getElementById(context);
		this.counter     = ( localStorage['lastIndex'] || null ) ? parseInt(localStorage['lastIndex']) + parseInt(1) : 100;
		this.el = { 
			form : this.context.querySelector('.js-task-form'),
			title : this.context.querySelector('.js-task-name'),
			project : this.context.querySelector('.js-task-project'),
			time : this.context.querySelector('.js-task-time'),
			submit : this.context.querySelector('.js-task-log'),
			confirm : this.context.querySelector('.js-confirmation'),
			buttonYes : this.context.querySelector('.js-button--yes'),
			buttonNo : this.context.querySelector('.js-button--no')
		}

		this.taskactor.initialize();

		this.el.submit.addEventListener('click', event => {

			event.preventDefault();

			if( this.el.form.classList.contains('is-editing') ){

				this.editTask( this.el.form.dataset.id, this.el.title.value, this.el.project.value, this.el.time.value );
				this.resetForm();

			} else {

				this.addTask( this.counter, this.el.title.value, this.el.project.value,  this.el.time.value );
				localStorage["lastIndex"] = this.counter;
				this.counter++;

				this.resetForm();

			}

		});


		this.el.buttonYes.addEventListener('click', event => {

			event.preventDefault();

			this.deleteTask( this.el.form.dataset.id );
			this.resetForm();

		});


		this.el.buttonNo.addEventListener('click', event => {

			event.preventDefault();
			this.resetForm();

		});


	}


	addTask(id = NaN, title = '', project = '', time = NaN){

		if( this.validate(title, project, time) === false ){
			return false;
		}

		this.taskactor.add(id, title, project, time);

	}

	editTask(id = NaN, title = '', project = '', time = NaN){

		if( this.validate(title, project, time) === false ){
			return false;
		}

		this.taskactor.edit(id, title, project, time);

	}

	deleteTask(id = NaN){

		this.taskactor.delete(id);

	}

	resetForm(){

		this.el.title.value = '';
		this.el.project.value = '';
		this.el.time.value = 1;
		this.el.form.classList.remove('is-editing');
		this.el.confirm.classList.remove('show');
		this.el.submit.textContent = this.el.submit.dataset.labelNormal;
		let _delete = document.querySelectorAll('.js-task-item');
		_delete.forEach( item => {
			item.classList.remove('is-deleting');
		});

	}

	validate(title, project, time){	

		let _message = '';

		if( title === '' ){
			_message += '<p>The task name must have a short description.</p>';
		}

		if( project === '' ){
			_message += '<p>The project name must have a value.</p>';
		}	

		if( isNaN(time) || time < 1 ){
			_message += '<p>The time must be at least 1 hour</p>';
		}


		document.querySelector('.js-error').classList.add('show');
		document.querySelector('.js-error').innerHTML = _message;
		if( _message !== '' ){ return false; }
		else { document.querySelector('.js-error').classList.remove('show'); }

	}

}

const app = new TaskAction('logger');

