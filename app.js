'use strict';

Vue.component('list-element', {
    props: ['data', 'id'],
     
    template: `
        <div 
            class="list-element"
            @mouseover="isHovered = true"
            @mouseleave="isHovered = false"
        >
            <p
                v-if="isHovered"
                class="delete-button"
                @click="deleteTodo(id)"
            >×</p>
            <input 
                type="checkbox"
                v-model="data.isChecked"
                @change="saveData()"
            >
            <textarea 
                v-bind:class="{ completed: data.isChecked }"
                rows="1" 
                placeholder="Текст задачи"
                v-model="data.text"
                @input="onTyping()"
                @keydown.enter.prevent=""
                ref="textarea"
                v-bind:style="{ height: data.height }"
            ></textarea>
        </div>
    `,

    data: function () {
        return {
            isHovered: false
        }
    },

    created: function() {
        window.onresize = this.onTyping;
    },

    methods: {
        deleteTodo: function (id)  { 
            app.deleteTodo(id);
        },

        saveData: function () {
            app.saveData();
        },

        onTyping: function () {

            let target = this.$refs['textarea']

            target.style.height = '1px';
            this.data.height = target.style.height = (target.scrollHeight) + 'px';

            this.saveData();
        },

        addNewTodo: function (event) {
            app.addNewTodo();
        }
    }
});

Vue.component('add-button', {
    
    props: ['caption'],

    template: `
        <p 
            class="add-button"
            @click="addNewTodo();"
        > {{ caption }} </p>
    `,

    methods: {
        addNewTodo: function () {
            app.addNewTodo();
        }
    }
});

let app = new Vue({

    el: '#app',

    data: {
        todoList: []
    },

    mounted: function () {
        try {
            if (localStorage.getItem('todoList')) {
                this.todoList = JSON.parse(localStorage.getItem('todoList'));
            } 
        } catch (e) {
            localStorage.removeItem('todoList');
        }
    },

    methods: {
        addNewTodo: function () {

            this.todoList.push({ 
                isChecked: false, 
                text: '',
                height: '19px'
            });

            this.saveData();
        },

        deleteTodo: function (id) {

            this.todoList.splice(id, 1);

            this.saveData();
        },

        saveData: function () {
            const json = JSON.stringify(this.todoList);
            localStorage.setItem('todoList', json);
        }
    }
});