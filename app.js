'use strict';

/* === Компонент элемента списка === */
Vue.component('list-element', {
    props: ['data', 'id'],
     
    template: `
        <div 
            class="list-element"
            v-bind:class="{ focused: isFocused || isHovered }"
            @mouseenter="isHovered = true"
            @mouseleave="isHovered = false">
            <p
                class="delete-button"
                v-if="isHovered || isFocused"
                @click="deleteTodo(id)">×</p>
            <input 
                type="checkbox"
                v-model="data.isChecked"
                @change="saveData()">
            <textarea 
                ref="textarea"
                rows="1" 
                placeholder="Текст задачи"
                v-bind:class="{ completed: data.isChecked }"
                v-bind:style="{ height: data.height }"
                v-model="data.text"
                @input="onTyping()"
                @keydown.enter.prevent=""
                @focus="isFocused = true"
                @blur="isFocused = false"></textarea>
        </div>
    `,

    data: function () {
        return {
            isHovered: false,
            isFocused: false
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

let app = new Vue({

    el: '#app',

    data: {
        todoList: [],
        addButtonCaption: '+ Новая задача'
    },

    mounted: function () {
        try {
            if (localStorage.getItem('todoList')) {
                this.todoList = JSON.parse(localStorage.getItem('todoList'));
            } 
        } catch (exception) {
            console.log(`Ошибка: ${exception.name} — ${exception.message}`);
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