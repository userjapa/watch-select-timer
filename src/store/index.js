import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    exercise: {
      video: '',
      questions: []
    },
    toUpdate: null
  },
  getters: {
    getExercise ({ exercise }) {
      return exercise
    },
    isToUpdate ({ toUpdate }) {
      if (toUpdate !== null) return true
      else return false
    }
  },
  mutations: {
    setExercise (state, exercise) {
      state.exercise = exercise
    },
    addQuestion (state, question) {
      state.exercise.questions.push(question)
    },
    removeQuestion (state, id) {
      state.exercise.questions.splice(id, 1)
    },
    setToUpdate (state, id) {
      state.toUpdate = id
    },
    update (state, question) {
      state.exercise.questions[state.toUpdate] = question
    }
  }
})
