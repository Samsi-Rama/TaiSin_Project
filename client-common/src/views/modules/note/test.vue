<template>
  <div>
    <a href="#" class="btn btn-primary btn-block">New Note</a>
    <br>
    <!-- subject -->
    <b-form-input v-model="subject" placeholder="Subject"></b-form-input>
    <br>
    <!-- creator -->
    <b-form-input v-model="creator" placeholder="Creator"></b-form-input>
    <br>
    <!-- receipents -->
    <b-form-input v-model="receipents" placeholder="Receipents"></b-form-input>
    <br>
    <b-form-textarea
      id="elvin"
      v-model="txt"
      placeholder="Enter something..."
      rows="3"
      max-rows="6"
    ></b-form-textarea>
  </div>

</template>

<script>
 export default {
    data() {
      return {
        text: ''
      }
    }
  }
</script>