// Define Tasks
function Task(id, title, time){
    this.id = id;
    this.title = title;
    this.time = time;
}

function TaskList(Application){
    const _application = document.getElementById(Application);
    const _listWrapper = document.querySelector('.js-list');
    this.tasksItems = [];
    
    // Render Items
    this.renderItems = () => {
        
        this.tasksItems.forEach( items => console.log(items.title) );
        this.tasksItems.forEach( items => {
            let listItem = `<div>${items.title} | ${items.time}</div>`;
            _listWrapper.innerHTML += listItem;
        });

        
    };
    
    // Add Items
    this.addItem = ( temp_id, temp_title, temp_time) => {
        let addedItem = new Task( temp_id, temp_title, temp_time );
        this.renderItems(addedItem);
        this.tasksItems.push(addedItem);    
    };
    
}

// Instances
const Tasks = new Task(1, 'Sample', '8');
const App = new TaskList('logger');
App.addItem(100,'100 Poems for Stella', 2);
App.addItem(200,'Kita Kita', 2);

//------------
// Assignment
//------------
//
// 1. Remove clutter from the renderItem function
// 2. Convert renderItem function to 'renderItems' function
//    that renders all the items via a forEach loop and the this.tasks content
// 3. Update the add and edit function based on the render update
// 4. Style the final output