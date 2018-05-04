<template>
  <div class="container row">
    <div class="item flex-basis-400 item-border">
      <div>
        <img :src="exercise.img">
      </div>
    </div>
    <div class="item flex-basis-400 item-border">
      <div class="container column">
        <div class="item">
          {{ exercise.question }}
        </div>
        <div class="item">
          <div
            class="text-align-left margin-bottom-10 option"
            v-for="(aswr, index) in exercise.answers"
            :class=" {
              right: (exercise.answered && aswr.correct),
              wrong: (exercise.answered && !aswr.correct && aswr.selected),
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
          <button class="btn next" @click="setCurrent(exercises)" v-if="!ended" :disabled="!exercise.answered">Next</button>
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
      exercise: {},
      ended: false
    }
  },
  methods: {
    setCurrent (exercises) {
      for (const index in exercises) {
        if (!exercises[index].answered) {
          this.exercise = exercises[index]
          break
        }
        console.log(parseInt(index), exercises.length - 1)
        if (parseInt(index) === (exercises.length - 1)) {
          this.exercise = exercises[index]
          this.ended = true
        }
      }
    },
    select (answer) {
      if (!this.exercise.answred) {
        answer.selected = true
        this.exercise.answered = true
      }
    },
    finish () {
      alert('You have finished!')
    }
  },
  props: [
    'exercises'
  ],
  watch: {
    exercises: function (exercises) {
      this.ended = false
      this.setCurrent(exercises)
    }
  },
  mounted () {
    this.setCurrent(this.exercises)
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
