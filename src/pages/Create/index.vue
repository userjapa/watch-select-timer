<template>
  <div class="container column">
    <div>
      <h2>Create</h2>
    </div>
    <div class="item item-border">
      <Answers :exercise="copy"/>
    </div>
    <div class="item item-border">
      <div class="container row">
        <div class="item flex-basis-400 item-border">
          <div class="container column">
            <div class="item">
              <h4>Questions</h4>
            </div>
            <div class="item">
              <div class="container row line-top line-bottom">
                <div class="item col-1">
                  <b>Index</b>
                </div>
                <div class="item col-6">
                  <b>Question</b>
                </div>
                <div class="item col-5">
                  <b>Options</b>
                </div>
              </div>
              <div class="container row line-bottom" v-for="(qst, index) in exercise.questions">
                <div class="item col-1 no-padding-bottom">
                  {{ index + 1 }})
                </div>
                <div class="item col-6 no-padding-bottom">
                  {{ qst.question }}
                </div>
                <div class="item col-5 no-padding-bottom">
                  <button class="btn btn-primary small" :disabled="$store.getters['isToUpdate']" @click="edit(qst, index)">Edit</button>
                  <button class="btn btn-danger small" :disabled="$store.getters['isToUpdate']" @click="$store.commit('removeQuestion', index)">Remove</button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="item flex-basis-400 item-border">
          <div class="container column">
            <div class="item">
              <div class="container">
                <div class="item flex-basis-75 align-self-center">
                  <label for="question_image">Video</label>
                </div>
                <div class="item flex-basis-325">
                  <input class="input" id="question_image" type="file" @change="videoChanged($event.target.files[0])" required/>
                </div>
              </div>
              <div class="container">
                <div class="item flex-basis-75 align-self-center">
                  <label for="question">Question</label>
                </div>
                <div class="item flex-basis-325">
                  <input class="input" id="question_question" type="text" v-model="question.question" @click="question.question = `Which vehicle appears in the picture?`" required/>
                </div>
              </div>
              <div class="container">
                <div class="item flex-basis-75 align-self-center">
                  <label for="question">Timer (seconds)</label>
                </div>
                <div class="item flex-basis-325">
                  <input class="input" id="question_question" type="number" v-model="question.timer" required/>
                </div>
              </div>
              <div class="container">
                <div class="item">
                  <button class="btn btn-success" @click="save(question)" v-if="!$store.getters['isToUpdate']">Save</button>
                  <button class="btn btn-primary" @click="update(question)" v-if="$store.getters['isToUpdate']">Update</button>
                  <button class="btn btn-danger" @click="cancelUpdate()" v-if="$store.getters['isToUpdate']">Cancel</button>
                </div>
              </div>
            </div>
            <div class="item">
              <div>
                <h4>Answers</h4>
              </div>
              <form v-on:submit.prevent="addAnswer(answer)">
                <div class="container row">
                  <div class="item flex-basis-75 add-right">
                    <button class="btn btn-primary add" type="submit">Add</button>
                  </div>
                  <div class="item flex-basis-325 add-left">
                    <input class="input add" type="text" v-model="answer.title" required>
                  </div>
                </div>
              </form>
              <div class="container column">
                <div class="item no-padding line-top line-bottom" v-if="question.answers.length > 0">
                  <div class="container row">
                    <div class="item col-7 no-padding">
                      <b>Answer</b>
                    </div>
                    <div class="item col-2 align-self-center no-padding">
                      <b>Correct</b>
                    </div>
                    <div class="item col-3 no-padding">
                      <b>Delete</b>
                    </div>
                  </div>
                </div>
                <div class="item no-padding line-bottom" v-for="(aswr, index) in question.answers">
                  <div class="container row">
                    <div class="item col-7 no-padding-bottom">
                      <input class="input" type="text" v-model="aswr.title">
                    </div>
                    <div class="item col-2 align-self-center no-padding-bottom">
                      <input type="radio" name="correct" @change="correctChange(aswr)" :checked="aswr.correct">
                    </div>
                    <div class="item col-3 no-padding-bottom">
                      <button class="btn small btn-danger" @click="question.answers.splice(index, 1)">Remove</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import _ from 'lodash'
import Answers from '../../components/Answers'

export default {
  name: "Create",
  data () {
    return {
      copy: {
        video: '',
        questions: []
      },
      exercise: {
        video: '',
        questions: []
      },
      question: {
        question: '',
        answers: [],
        timer: 0
      },
      answer: {
        correct: false
      },
      allowed: false,
      interval: null
    }
  },
  methods: {
    save (question) {
      if (this.checkAnswers(question.answers)) {
        // this.$store.commit('addQuestion', question)
        this.exercise.questions.push(question)
        this.$store.commit('setExercise', this.exercise)
        this.question = {
          question: '',
          answers: [],
          timer: 0
        }
      } else {
        alert('Must inform answer and select the correct one')
      }
    },
    addAnswer (answer) {
      this.question.answers.push(answer)
      this.answer = {
        correct: false
      }
    },
    checkAnswers (answers) {
      if (answers.length === 0) return false
      const index = answers.findIndex(x => x.correct)
      if (index >= 0) return true
      else return false
    },
    correctChange (answer) {
      this.question.answers.map(x => {
        if (x.title === answer.title) this.$set(x, 'correct', true)
        else this.$set(x, 'correct', false)
      })
      this.doClone()
    },
    edit (question, id) {
      this.$store.commit('setToUpdate', id)
      this.question = question
    },
    update (question) {
      this.$store.commit('update', question)
      this.cancelUpdate()
    },
    cancelUpdate () {
      this.question = {
        question: '',
        answers: [],
        timer: 0
      }
      this.$store.commit('setToUpdate', null)
    },
    videoChanged (file) {
      if (file) {
        var reader = new FileReader();
        reader.onload = e => {
          this.$set(this.exercise, 'video_old', file)
          this.$set(this.exercise, 'video_original', file.name)
          this.$set(this.exercise, 'video', e.target.result)
        };
        reader.readAsDataURL(file)
      }
    },
    doClone () {
      let question = _.cloneDeep(this.question)
      this.$set(question, 'answered', false)
      this.$set(question, 'hit', false)
      question.answers.map(a => {
        this.$set(a, 'selected', false)
      })
      this.$set(this.copy, 'questions', [ question ])
    }
  },
  components: {
    Answers
  },
  watch: {
    'exercise.video': function () {
      this.$set(this.copy, 'video', this.exercise.video)
    },
    'question.question': function () {
      this.doClone()
    },
    'question.answers': function () {
      this.doClone()
    }
  },
  mounted () {
    this.exercise = this.$store.getters['getExercise']
  }
}
</script>
<style lang="scss" scoped>
.btn.small {
  padding: 10px 9px;
  font-size: 12px;
}

.btn.add {
  border-radius: 25px 0px 0px 25px;
  font-size: 14px;
  padding: 10px 17px;
  width: 100%;
}

.input.add {
  border-radius: 0px 5px 5px 0px;
}

.item.add-left {
  padding-left: 0;
}

.item.add-right {
  padding-right: 0;
}

.no-padding {
  padding: 0;
}

.no-padding-bottom {
  padding-bottom: 0;
}

.line-bottom {
  border-bottom: 1px solid #ddd;
  padding-bottom: 5px;
}

.line-top {
  border-top: 1px solid #ddd;
  padding-top: 5px;
}
</style>
