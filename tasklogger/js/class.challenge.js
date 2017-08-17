class Task {

	constructor(){
		this.localStore  = window.localStorage;
		this.observer = new Observer;
		this.storage = ( localStorage['array'] || null ) ? JSON.parse(localStorage['array']) : [];
		this.listWrapper = document.querySelector('.js-task-list');

		this.observer.subscribe('display/tasks', () => {
			this.displayList();
		});


		
	}

	// Add Items
	addItem(options = { id: NaN, title: '', project: '', time: NaN, observer: null }) {

		this.storage.push( options );

		this.observer.publish('display/tasks');

	}

	// Edit Items
	editItems(id, title, project, time){

    const _editItem = this.storage.find(item => item.id === parseInt(id));  
		_editItem.title = title;
		_editItem.project = project;
		_editItem.time = time;

		this.observer.publish('display/tasks', '');

	}


	// Delete Items
	deleteItems(){
		alert(this.storage);
	}	

	// Display Items 
	displayList(){
		

		this.listWrapper.innerHTML = '';
		//console.log( this.storage.map( item => { return item.title } ) );
		let _viewItems = this.storage.map( item => {
			return `<div class='task-item' data-id='${item.id}'>
								<p class='task-title'>${item.project} | ${item.title}</p>
								<time class='task-time'>${item.time}</time>
								<a class='js-delete' data-id='${item.id}'>Delete</a>
								<a class='js-edit' data-id='${item.id}' data-title='${item.title}' data-project='${item.project}' data-time='${item.time}'>Edit</a>
						  </div>`;
		}).reverse().join(''); 
		this.listWrapper.innerHTML = _viewItems;


		EventHandler.editEvent({ handle: '.js-edit', form: '.js-task-form', title: '.js-task-name', project: '.js-task-project', time: '.js-task-time', submit: '.js-task-log' });

		EventHandler.deleteEvent('.js-delete', this.storage);

	}



}

class ProcessTask {

	constructor(_context){

		this.context  = document.getElementById(_context);
		this.observer = new Observer; 

		this.el = {
			form : this.context.querySelector('.js-task-form'),
			taskTitle : this.context.querySelector('.js-task-name'),
			taskProject : this.context.querySelector('.js-task-project'),
			taskTime : this.context.querySelector('.js-task-time'),
			submit : this.context.querySelector('.js-task-log'),
		}

		this.task = new Task();
		this.counter = 100;

		this.observer.subscribe('add/task', () => { this.addTask() });
		this.observer.subscribe('edit/task', () => { this.editTask() });
		this.observer.subscribe('reset/form', () => { this.resetForm() });


		const _submit = this.el.submit;

		_submit.addEventListener( 'click', event => {
			event.preventDefault();
			
			if( this.el.form.classList.contains('is-editing') ){

				this.observer.publish('edit/task');
				this.observer.publish('reset/form');

			} else {

				this.observer.publish('add/task');
				this.observer.publish('reset/form');

			}

		});

	}

	// Ask Task to Add Item on List
	addTask(){
		this.task.addItem({ id: this.counter, title: this.el.taskTitle.value, project: this.el.taskProject.value, time: this.el.taskTime.value, observer: this.observer });
			this.counter++;
	}

	// Ask Task to Edit Item on List
	editTask(){
		this.task.editItems(this.el.form.dataset.id, this.el.taskTitle.value, this.el.taskProject.value, this.el.taskTime.value );
	}

	deleteTask(id, arr){
    //this.task.deleteItems(id, arr);
    alert();
	}

	resetForm(){

		this.el.taskTitle.value  = '';
		this.el.taskTime.value   = 1;
		this.el.taskProject.value = '';
    this.el.submit.textContent = this.el.submit.dataset.label;
    this.el.form.classList.remove('is-editing');

	}


}

class EventHandler {
	constructor(){
		super();
	}

	// Create Delete Event
	static deleteEvent(handle = '.js-delete', arr){

		let _deleteButton = document.querySelectorAll( handle );
		

		_deleteButton.forEach( items => {

			items.addEventListener('click', event => {

        event.preventDefault();

        let _currentTarget = event.target;
        let _currentTargetId = _currentTarget.dataset.id;



      });


		});


	}


	// Create Edit Event 
	static editEvent(options = { handle: '.js-edit', form: '.js-task-form', title: '.js-task-name', project: '.js-task-project', time: '.js-task-time', submit: '.js-task-log' }){

		let _editButton = document.querySelectorAll(options.handle);
		
		_editButton.forEach(item => {
			item.addEventListener('click', event => {
				event.preventDefault();

				let _form            = document.querySelector(options.form);
				let _title           = document.querySelector(options.title);
				let _project         = document.querySelector(options.project);
				let _time            = document.querySelector(options.time);
				let _submit          = document.querySelector(options.submit);

				let _currentTarget   = event.target;
      	let _currentID       = _currentTarget.dataset.id;
      	let _currentTitle    = _currentTarget.dataset.title;
      	let _currentProject  = _currentTarget.dataset.project;
      	let _currentTime     = _currentTarget.dataset.time;

      	_form.dataset.id = _currentID;
      	_form.classList.add('is-editing');
      	_title.focus();
      	_submit.textContent = _submit.dataset.labelAlt;


      	_title.value   = _currentTitle;
      	_project.value = _currentProject;
      	_time.value    = _currentTime;

      	let children = _currentTarget.parentElement.parentElement.children;

      	for( let item of children ){

      		item.classList.remove('is-editing');

      	}

      	_currentTarget.parentElement.classList.add('is-editing');

			});
		});

	}
}

const App = new ProcessTask('logger');


