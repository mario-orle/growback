<template>
    <v-container>
      <v-row v-if="!$store.state.token">
        <v-col
          cols="12"
          md="12"
        >
          <v-btn @click="login">Login</v-btn>
        </v-col>

      </v-row>
      <v-row v-else>
        <v-col cols="12" md="12">
          <SeguimientoList /> 
        </v-col>
        <v-col cols="12" md="12">
          <SeguimientoForm /> 
        </v-col>
      </v-row>
    </v-container>
</template>

<script lang="ts">
import gql from "graphql-tag";
import Vue from "vue";
import SeguimientoForm from '../components/seguimiento-form.vue';
import SeguimientoList from '../components/seguimiento-list.vue';

export default Vue.extend({
  name: "Home",
  components: {SeguimientoForm, SeguimientoList},
  methods: {
    login() {
      console.log(this);
      this.$apollo.mutate({
        // Query
        mutation: gql`mutation taka($user: String!, $pwd: String!) {
            login (input: { identifier: $user, password: $pwd }) {
              jwt
            }
          }
        `,
        // Parameters
        variables: {
          user: 'graphql',
          pwd: 'abbyl40L',
        },

      }).then((res: any) => {
        const jwt = res.data.login.jwt;
        this.$store.commit("setToken", jwt);
        localStorage.setItem("token", jwt);
      });
    }
  },
});
</script>
