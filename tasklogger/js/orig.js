// define task item Class
function Task (id, title, time) {
  this.id = id;
  this.title = title;
  this.time = time;
}

// define task list Class
function TaskList (context) {
  this.tasks = [];
  
  let _ctr = 0;
  
  // app wrapper
  const _context = document.getElementById(context);
  
  // task list
  const _list = _context.querySelector('.js-list');
  
  // form elements
  const _form = _context.querySelector('.js-task-form');
  const _taskTitle = _form.querySelector('.js-task');
  const _taskTime = _form.querySelector('.js-time');
  const _submit = _form.querySelector('.js-log');
  
  // render
  const renderItem = task => {
    let item, itemName, itemTime = {};
    
    const _item = this.tasks.find(item => item.id === task.id);    
    
    if ( _item ) {
      item = _list.querySelector(`[data-id="${task.id}"]`);
      itemName = item.querySelector('h2');
      itemTime = item.querySelector('time');
    } else {
      item = document.createElement('li');
      itemName = document.createElement('h2');
      itemTime = document.createElement('time');

      item.append(itemName);
      item.append(itemTime)
      _list.append(item);
      
      // edit task
      item.addEventListener('click', evt => {
        evt.preventDefault();
        
        item.classList.add('is-replacing');
        _form.classList.add('is-replacing');
        _form.dataset.replacing = task.id;
        
        _taskTitle.value = task.title;
        _taskTime.value = task.time;
        _submit.textContent = _submit.dataset.labelAlt;
      });
    }
    
    itemName.textContent = task.title;
    itemTime.textContent = task.time;
    item.dataset.id = task.id;
    
    item.classList.remove('is-replacing');
    _form.classList.remove('is-replacing');
    _submit.textContent = _submit.dataset.label;
  };

  // add
  this.addItem = () => {
    let task = new Task(_ctr, _taskTitle.value, _taskTime.value)
    renderItem(task);
    this.tasks.push(task);
    _ctr++;
    
    _taskTitle.value = '';
    _taskTime.value = '';
  };
  
  // edit
  this.editItem = (id, title, time) => {
    const _task = this.tasks.find(item => item.id === parseInt(id));
    _task.title = title;
    _task.time = time;
    
    renderItem(_task);
  };
  
  // delete
  this.deleteItem = id => {
    let toRemove = this.tasks.map((item, idx) => ({ id: item.id, idx }))
                          .find(item => item.id === id);
    
    this.tasks.splice(toRemove.idx, 1);
  };
  
  // click events
  // submit task
  _submit.addEventListener('click', evt => {
    evt.preventDefault();
    
    if( _form.classList.contains('is-replacing') ) {
      this.editItem(_form.dataset.replacing, _taskTitle.value, _taskTime.value);
    } else {
      this.addItem();
    }
  });
}

//-----
const App = new TaskList('logger');


//------------
// Assignment
//------------
//
// 1. Remove clutter from the renderItem function
// 2. Convert renderItem function to 'renderItems' function
//    that renders all the items via a forEach loop and the this.tasks content
// 3. Update the add and edit function based on the render update
// 4. Style the final output