// Define Tasks
function Task(id, title, time){
    this.id    = id;
    this.title = title;
    this.time  = time;
}

function TaskList(Application){
    const _application = document.getElementById(Application);

    const _form        = _application.querySelector('.js-task-form');
    const _taskTitle   = _form.querySelector('.js-task');
    const _taskTime    = _form.querySelector('.js-time');
    const _submit      = _form.querySelector('.js-log');

    const _listWrapper = _application.querySelector('.js-list');

    let _ctr           = 100;
    let _total         = 0;

    this.tasksItems    = [];
    
    // Render Items
    const renderItems = deliveredTask => {
        
        let item, itemName, itemTime = {};

        const _editItem = this.tasksItems.find(item => item.id === deliveredTask.id);  

        if ( _editItem ) {
            item     = _listWrapper.querySelector(`[data-id="${deliveredTask.id}"]`);
            itemName = item.querySelector('p');
            itemTime = item.querySelector('time');
        } else {

            item       = document.createElement('div');
            itemName   = document.createElement('p');
            itemTime   = document.createElement('time');
            itemEdit   = document.createElement('a');
            itemDelete = document.createElement('a');

            itemEdit.setAttribute('class', 'js-edit');
            itemDelete.setAttribute('class', 'js-delete');

            item.append(itemName);
            item.append(itemTime);
            item.append(itemDelete);
            item.append(itemEdit);
            _listWrapper.append(item);

            itemEdit.addEventListener('click', event => {
                event.preventDefault();

                item.classList.add('is-editing');
                _form.classList.add('is-editing');
                _form.dataset.editing = deliveredTask.id;
                _taskTitle.focus();
                _taskTitle.value = deliveredTask.title;
                _taskTime.value = deliveredTask.time;
                _submit.textContent = _submit.dataset.labelAlt;
            });

            itemDelete.addEventListener('click', event => {
                event.preventDefault();
                item.classList.add('is-deleting');
                item.dataset.editing = deliveredTask.id;
                this.deleteItem(item.dataset.editing);

            });

        }

        item.dataset.id        = deliveredTask.id;
        itemName.textContent   = ( deliveredTask.title ) ? deliveredTask.title : 'Empty';
        itemTime.textContent   = ( deliveredTask.time ) ? deliveredTask.time : 0;
        itemEdit.textContent   = 'Edit';
        itemDelete.textContent = 'Delete';

        item.classList.remove('is-editing');
        _form.classList.remove('is-editing');
        _submit.textContent = _submit.dataset.label;

    };

    // Render Only;
    this.renderOnly = () => {
        let data = '';
        this.tasksItems.forEach(item => {
            data = `<div class='data-list'>
                        <p class='data-title'>${item.title}</p>
                        <time class='data-time'>${item.time}</time>
                        <a class='js-delete'>Delete</a>
                        <a class='js-edit' data-title='${item.title}' data-time='${item.time}' data-id='${item.id}'>Edit</> 
                    </div>`;
        });

        _listWrapper.innerHTML += data;
        this.editEvent();
    };

    this.editEvent = () => {
   
        let editButton = _listWrapper.querySelectorAll('.js-edit');
        for( items of editButton ){
            items.addEventListener('click', event => {
                event.preventDefault();

                let currentList = document.querySelector('.data-list');
                let currentTarget = event.target;

                currentList.classList.add('is-editing');
                _form.classList.add('is-editing');

                _form.dataset.editing = currentTarget.dataset.id;
                _taskTitle.focus();
                _taskTitle.value = currentTarget.dataset.title;
                _taskTime.value = currentTarget.dataset.time;
                _submit.textContent = _submit.dataset.labelAlt;
            });
        }
    }

    // Update Total 
    this.totalTime = () => {
        _total = this.tasksItems.map( item => parseInt(item.time) || 0 ).reduce( (sum, value) => sum + value );

        let totalWrapper = document.querySelector('.js-total');
        totalWrapper.textContent = _total; 
    };
    
    // Add Items
    this.addItem = () => {
        let addedItem = new Task( _ctr, _taskTitle.value, _taskTime.value );

        //renderItems(addedItem);
        this.tasksItems.push(addedItem); 
        _ctr++;   

        this.resetForm();
    };

    // Edit Items
    this.editItem = (id, title, time) => {
        const _editedTask = this.tasksItems.find(item => item.id === parseInt(id));
        _editedTask.title = title;
        _editedTask.time = time;
        
        renderItems(_editedTask);

        this.resetForm();

    };

    // Delete Items 
    this.deleteItem = id => {
        
        let toRemove = document.querySelector('.is-deleting');
        let _deleteItem = this.tasksItems
                              .map((item, idx) => ({ id: item.id, idx }))
                              .find( item => item.id == id );

        this.tasksItems.splice(_deleteItem.idx, 1);
        toRemove.remove();
    };

    //Reset Forms 
    this.resetForm = () => {
        
        _taskTitle.value = '';
        _taskTime.value = '';
    };

    _submit.addEventListener('click', event => {
        event.preventDefault();

        

        if( _form.classList.contains('is-editing') ) {
            this.editItem(_form.dataset.editing, _taskTitle.value, _taskTime.value);
        } else {
            this.addItem();
        }
        
        this.totalTime();
        this.renderOnly();
    });

}

// Instances
const Tasks = new Task(1, 'Sample', '8');
const App = new TaskList('logger');

// Events 

//------------
// Assignment
//------------
//
// 1. Remove clutter from the renderItem function
// 2. Convert renderItem function to 'renderItems' function
//    that renders all the items via a forEach loop and the this.tasks content
// 3. Update the add and edit function based on the render update
// 4. Style the final output