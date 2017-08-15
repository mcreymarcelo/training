class Task {

	constructor(id, title, time){

		this.id    = id;
		this.title = title;
		this.time  = time;

	}

}

class TaskList {

	constructor(application){

		this.localStore       = window.localStorage;

		this.application = document.getElementById(application);
    this.form        = this.application.querySelector('.js-task-form');
    this.taskTitle   = this.form.querySelector('.js-task');
    this.taskTime    = this.form.querySelector('.js-time');
    this.submit      = this.form.querySelector('.js-log');
    const _submit    = this.submit;

    this.listWrapper = this.application.querySelector('.js-list');
    this.sourceTitle = this.form.querySelector('.js-task');
    this.sourceTime  = this.form.querySelector('.js-time');

		this.taskItems   = ( localStorage['array'] || null ) ? JSON.parse(localStorage['array']) : [];
		this.temp        = [];
		this.idCtr       = 100;
		this.total       = 0;


		_submit.addEventListener('click', event => {

			if( this.form.classList.contains('is-editing') ){

				this.editItems(this.form.dataset.id, this.sourceTitle.value, this.sourceTime.value);

			} else {

				this.addItem(this.idCtr,this.sourceTitle.value, this.sourceTime.value);

			}

			this.displayList();

		});

	}


	// Add Items
	addItem(id, title, time) {

		let addedItems = new Task(id, title, time);


		this.taskItems.push(addedItems);
		this.idCtr++;
		this.resetForm();

	}


	// Edit Items
	editItems(id, title, time){

		const _editedTask = this.taskItems.find(item => item.id === parseInt(id));
    _editedTask.title = title;
    _editedTask.time  = time;


    this.updateItems(_editedTask);
    this.resetForm();

	}


	// Delete Items
	deleteItems(id){

		let toRemove    = document.querySelector('.is-deleting');
    let _deleteItem = this.taskItems
                          .map((item, idx) => ({ id: item.id, idx }))
                          .find( item => item.id == id );


    this.taskItems.splice(_deleteItem.idx, 1);
    this.totalHours();
    toRemove.remove();

    this.updateLocalVariable();

	}	


	// Update Task List
	updateItems(deliveredTasks){

		const _editItem      = this.taskItems.find(item => item.id === deliveredTasks.id);  
		this.taskItems.title = _editItem.title;
		this.taskItems.time = _editItem.time;

	}

	// Compute for total hours in the task list
	totalHours(){

		if( this.taskItems.length > 0 ){ 

      this.total = this.taskItems.map( item => parseInt(item.time) || 0 ).reduce( (sum, value) => sum + value );

    } else {

      this.total = 0; 

    }

    let totalWrapper       = document.querySelector('.js-total');
    totalWrapper.innerHTML = this.total; 

    this.localStore = this.taskItems;

	}

	// Display Items
	displayList(){

		this.listWrapper.innerHTML = '';

		let viewItems = this.taskItems.map(item => {
			return `<div class="task-item" data-id="${item.id}">
								<p class="task-title">${item.title}</p>
								<time class="task-time">${item.time}</time>
								<a class="js-delete" data-id="${item.id}">Delete</a>
								<a class="js-edit" data-id="${item.id}" data-title="${item.title}" data-time="${item.time}">Edit</a>
							</div>`;
		}).reverse().join('');


		this.listWrapper.innerHTML += viewItems;
		this.totalHours();
		this.editEvent();
		this.deleteEvent();
		this.updateLocalVariable();

	}


	// Reset Form Values
	resetForm(title = '', value = '') {

		this.sourceTitle.value  = title;
		this.sourceTime.value   = value;
    this.submit.textContent = this.submit.dataset.label;
    this.form.classList.remove('is-editing');

	}


	// Update LocalStorage base on current Task Item value
	updateLocalVariable(){

		localStorage["array"] = JSON.stringify(this.taskItems);

	}



	// Edit Event
	editEvent(id, title, time){

		let editButton = this.listWrapper.querySelectorAll('.js-edit');


    for( let items of editButton ){

      items.addEventListener('click', event => {

      	event.preventDefault();


      	let currentTarget = event.target;
      	let currentID     = currentTarget.dataset.id;
      	let currentTitle  = currentTarget.dataset.title;
      	let currentTime   = currentTarget.dataset.time;


      	this.form.dataset.id = currentID;
      	this.form.classList.add('is-editing');
      	this.sourceTitle.focus();
      	this.submit.textContent = this.submit.dataset.labelAlt;


      	this.sourceTitle.value = currentTitle;
      	this.sourceTime.value  = currentTime;

      	let children = currentTarget.parentElement.parentElement.children;

      	for( let item of children ){

      		item.classList.remove('is-editing');

      	}

      	currentTarget.parentElement.classList.add('is-editing');

      });

    }

	}


	//Delete Event
	deleteEvent(id){

		let deleteButton = this.listWrapper.querySelectorAll('.js-delete');

		for( let items of deleteButton) {

			items.addEventListener('click', event => {

        event.preventDefault();

        let currentTarget = event.target;

        currentTarget.parentElement.classList.add('is-deleting');
        this.deleteItems(currentTarget.parentElement.dataset.id);

      });

		}


	}


}

const Tasks = new Task(1, 'Sample', '8');
const App = new TaskList('logger');
App.displayList();