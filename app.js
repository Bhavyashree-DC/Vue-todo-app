const dateFormatOptions = {
  weekday: "long",
  month: "long",
  day: "numeric",
};

const timeFormatOptions = {
  hour: "numeric",
  minute: "numeric",
  second: "numeric",
  hour12: true,
};

const dateFormat = new Intl.DateTimeFormat("en-GB", dateFormatOptions);
const timeFormat = new Intl.DateTimeFormat("en-GB", timeFormatOptions);

// deadline.min = new Date().toISOString().split("T")[0];

Vue.component('ul-list',{
 props:['tasks'], 
 methods:{
  toggleStatus(task) {
    task.status = task.status === 'complete' ? 'pending' : 'complete';
  },

  deleteTask(task) {
    const index = this.tasks.findIndex(t => t === task);
    if (index !== -1) {
      this.tasks.splice(index, 1);
    } else {
      console.log("Task not found for ", task);
    }
  },

 },
  computed:{
    sortedTasks() {
      return this.tasks.slice().sort((a, b) => a.status.localeCompare(b.status));
    },
  },
  template:
 `  <ul class="todo-list-items">
          <todo-items v-for="(task, index) in sortedTasks" :key="index" :task="task" @toggle-status="toggleStatus(task)" @delete-task="deleteTask(task)"></todo-items>
   </ul>
 `,
});
Vue.component('todo-items',{
  props:['task'],
  data(){
    return{
      editingIndex: -1,
      editedTaskName: '',
    }
 },
 methods:{
  toggleStatus() {
    this.$emit('toggle-status', this.task)
  },

  deleteTask() {
    this.$emit('delete-task', this.task);
  },

 },
 computed:{
  shortDateFormatMonth() {
    return function (deadline) {
        if (deadline) {
            const options = {
                month: 'short',
            };
            return new Intl.DateTimeFormat('en-GB', options).format(new Date(deadline));
        }
        return '';
    };
  },
  shortDateFormatDay() {
      return function (deadline) {
          if (deadline) {
              const options = {
                  day: 'numeric',
              };
              return new Intl.DateTimeFormat('en-GB', options).format(new Date(deadline));
          }
          return '';
      };
  },
},
template:
  `   
       <li class="list-item">
              <input type="checkbox" 
              v-model ="task.status" 
              class="selectItems"
              @change="toggleStatus(index)"
              />
              <div class="taskDeadLine">
                  <div class="month"> {{ shortDateFormatMonth(task.deadline) }} </div>
                  <div class="date"> {{ shortDateFormatDay(task.deadline) }} </div>
              </div>
              <label  class="listDetails"> 
                  <h3  :class="{ completedTask: task.completed }">{{ task.todoName }}</h3>
                  <p class="todoType">{{ task.type }}</p>
                  <div class="tag-div">
                      <span :class="'todoTag '+ task.tag.toLowerCase()">{{ task.tag }}</span>
                  </div>
              </label>              
              <i class="ri-delete-bin-line" @click="deleteTask(task)"></i>
          </li>
`,

})

Vue.component('add-btn',{
  template:
     `<button type="button" class="add-item" @click="handleNewList"">
          <i class="ri-add-fill"></i>
     </button>`,

  methods: {
  handleNewList() {
    this.$emit('add-click'); 
  },
}
})

Vue.component('add-list-form', {
  props: ['show-add-list-container'],
  data() {
    return {
      label: 'Todo',
      projectHeader: 'Project',
      tagHeader: 'Tags',
      deadlineHeader: 'Deadline',
      taskInput: '',
      selectedDate: '',
      deadline: {
        min: new Date().toISOString().split("T")[0],
      },
    };
  },
  methods: {
    addTask() {
      if (!this.taskInput) {
        alert('Please Enter Valid Input!');
        return;
      }
      const newList = {
        todoName: this.taskInput,
        type: document.getElementById('projectList').value,
        tag: document.querySelector('input[name="tagName"]:checked').value,
        deadline: this.selectedDate,
        status: 'pending',
        isEditing:false,
      };

      this.$emit('save-task', newList);

      this.taskInput = '';
      this.selectedDate = null;
    },
    

  },
  template: `
  <div class="add-list-container" v-show="showAddListContainer">
    <div class="close-icon" id="closeIcon" @click="$emit('toggle-add-list')">
      <i class="ri-close-line"></i>
    </div>
    <div class="text-input">
      <label for="todo">{{ label }}</label>
      <input v-model="taskInput" type="text" placeholder=" " maxlength="20" required />
    </div>
    <div class="projects">
      <h4>{{ projectHeader }}</h4>
      <div class="project-dropdown-list">
        <select id="projectList" required>
          <option value="home" selected> Home </option>
          <option value="work"> Work </option>
        </select>
      </div>
    </div>
    <div class="tag-input">
      <h4>{{ tagHeader }}</h4>
      <div class="add-icons">
        <input type="radio" id="lowTag" name="tagName" value="Low" required><label for="lowTag"> Low </label>
        <input type="radio" id="medTag" name="tagName" value="Medium"><label for="medTag"> Medium </label>
        <input type="radio" id="highTag" name="tagName" value="High"><label for="highTag"> High </label>
      </div>
    </div>
    <div class="date-input-container">
      <h4>{{ deadlineHeader }}</h4>
      <div class="date-input">
        <input type="date" name="deadline" v-model="selectedDate" id="deadline" required/>
      </div>
    </div>
    <div class="submitBtn">
      <button class="new-task-btn" id="addBtn" @click="addTask"> Done </button>
    </div>
  </div>
`,
})
new Vue({
  el: '#app',
  data: {
      header: 'Today',
      showAddListContainer: false,
      tasks:[
              {
                  todoName :'Task1',
                  type : 'Home',
                  tag : 'Low',
                  deadline: '2024-01-13',
                  status:'pending',
                  isEditing:false,
              },
              {
                  todoName :'Task2',
                  type : 'Work',
                  tag : 'High',
                  deadline: '2024-01-12',
                  status:'completed',
                  isEditing:false,
              }
      ],
  },
 
  methods: {
          toggleAddListContainer() {
              this.showAddListContainer = !this.showAddListContainer;
          },
          saveTask(newList) {
            this.tasks.push(newList);
            this.showAddListContainer = false;
          },
    },


  computed: {
      currentDate(){
          let today = new Date();
          return dateFormat.format(today);
      },
     

  },
})
