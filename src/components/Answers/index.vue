<template>
  <div class="container row">
    <div class="item flex-basis-400 item-border">
      <div>
        <video :src="exercise.video"/>
      </div>
    </div>
    <div class="item flex-basis-400 item-border">
      <div class="container column">
        <div class="item">
          {{ question.question }}
        </div>
        <div class="item">
          <div
            class="text-align-left margin-bottom-10 option"
            v-for="(aswr, index) in question.answers"
            :class="{
              right: (question.answered && aswr.correct),
              wrong: (question.answered && !aswr.correct && aswr.selected),
              selected: aswr.selected
            }"
            @click="select(aswr)"
          >
            {{ index + 1 }}) {{ aswr.title }}
          </div>
        </div>
      </div>
      <div class="container justify-content-end align-content-end">
        <div class="margin-right-10">
          <button class="btn next" @click="setCurrent(exercise.questions)" v-if="!ended" :disabled="!question.answered">Next</button>
          <button class="btn next" v-if="ended" @click="finish()">Finished!</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "Answers",
  data () {
    return {
      question: {
        answers: []
      },
      ended: false,
      video: ''
    }
  },
  methods: {
    setCurrent (questions) {
      for (const index in questions) {
        if (!questions[index].answered) {
          this.question = this.exercise.questions[index]
          break
        }
        console.log(parseInt(index), questions.length - 1)
        if (parseInt(index) === (questions.length - 1)) {
          this.question = questions[index]
          this.ended = true
        }
      }
    },
    select (answer) {
      if (!this.question.answered) {
        answer.selected = true
        this.exercise.answered = true
      }
    },
    finish () {
      alert('You have finished!')
    }
  },
  props: [
    'exercise'
  ],
  watch: {
    'exercise.video': function (video) {
      console.log('video changed');
    },
    'exercise.questions': function (exercise) {
      console.log('questions changed');
      this.ended = false
      this.setCurrent(exercise.questions)
    }
  },
  mounted () {
    this.setCurrent(this.exercise.questions)
  }
}
</script>
<style lang="scss" scoped>
img {
  width: 100%;
}

.option {
  background-color: #ddd;
  padding: 10px 30px;
  border-radius: 20px;
  cursor: pointer;
}

.right {
  background-color: green;
}

.wrong {
  background-color: red;
}

.selected {
  color: black;
  font-weight: bold;
}

.next {
  border-radius: 20px;
}
</style>
