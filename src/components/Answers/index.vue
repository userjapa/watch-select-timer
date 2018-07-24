<template>
  <div class="container row">
    <div class="item flex-basis-400 item-border">
      <div class="video-player">
        <video class="video-player__player"
               ref="player"
               :src="exercise.video"
               @playing="playing = true"
               @pause="playing = false"
               @ended="videoFinished = true"
               @click="$event.target.pause()"/>
        <div class="video-player__holder" v-if="!playing">
          <div class="video-player__holder__btn" @click="$refs['player'].play()"></div>
        </div>
      </div>
    </div>
    <div class="item flex-basis-400 item-border">
      <div class="container column">
        <div class="item">
          {{ question.question }}
        </div>
        <div class="item timer">
          {{ time }}
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
          <button class="btn next" @click="startTimer()" v-if="!ended && !answering" :disabled="!videoFinished">Start</button>
          <button class="btn next" @click="next(exercise.questions)" v-if="!ended && answering" :disabled="!question.answered">Next</button>
          <button class="btn next" @click="finish()" v-if="ended">Finished!</button>
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
      videoFinished: false,
      answering: false,
      playing: false,
      time: 0,
      interval: null
    }
  },
  methods: {
    setCurrent (questions) {
      for (const index in questions) {
        if (!questions[index].answered) {
          this.question = this.exercise.questions[index]
          this.time = this.question.timer
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
      if (!this.question.answered && this.answering) {
        this.$set(answer, 'selected', true)
        this.$set(this.question, 'answered', true)
        clearInterval(this.interval)
        console.log(this.question)
      }
    },
    finish () {
      alert('You have finished!')
    },
    startTimer () {
      this.answering = true
      this.interval = setInterval(() => {
        this.time--
        if (this.time == 0) {
          clearInterval(this.interval)
          this.$set(this.question, 'answered', true)
          this.$set(this.question, 'hit', false)
        }
      }, 1000)
    },
    next (questions) {
      this.setCurrent(questions)
      this.answering = false
    }
  },
  props: [
    'exercise'
  ],
  watch: {
    'exercise.questions': function (questions) {
      this.ended = false
      console.log();
      this.setCurrent(questions)
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

.timer {
  font-weight: 600;
  font-size: 25px;
}

.video-player {
  position: relative;
  display: flex;
  justify-content: center;
  align-content: stretch;
  &__player {
    width: 100%;
    height: 100%;
    flex-grow: 1;
    align-self: stretch;
  }
  &__holder {
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    flex-grow: 1;
    position: absolute;
    z-index: 10;
    display: flex;
    justify-content: center;
    background-color: rgba(0, 0, 0, .5);
    &__btn {
      align-self: center;
      width: 100px;
      height: 100px;
      background-image: url(https://cdn2.iconfinder.com/data/icons/metro-uinvert-dock/256/Windows_Media_Player_alt.png);
      background-size: 100px;
      background-position: 50% 50%;
      background-repeat: no-repeat;
      z-index: 15;
      transition: transform .3s;
      &:hover {
        transform: scale(1.25);
        cursor: pointer;
      }
    }
  }
}
</style>
