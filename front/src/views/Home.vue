<template>
  <v-container>
    <v-row v-if="!$store.state.token">
      <v-col cols="12" md="12">
        <v-btn @click="login">Login</v-btn>
      </v-col>
    </v-row>
    <template v-else>
      <v-row>
        <v-col cols="4">
          <v-dialog width="500">
            <template v-slot:activator="{ on, attrs }">
              <v-btn color="red lighten-2" dark v-bind="attrs" v-on="on">
                Add
              </v-btn>
            </template>
            <v-card>
              <SeguimientoForm />
            </v-card>
          </v-dialog>
          <SeguimientoList />
        </v-col>
        <v-col cols="8">
          <Climas :hardLimit="hardLimit" />
          <select v-model="hardLimit">
            <option :value="100">100</option>
            <option :value="200">200</option>
            <option :value="500">500</option>
            <option :value="1000">1000</option>
            <option :value="2000">2000</option>
          </select>
        </v-col>
      </v-row>
      <v-row>
        <Fotos />
      </v-row>
    </template>
  </v-container>
</template>

<script lang="ts">
import gql from "graphql-tag";
import Vue from "vue";
import SeguimientoForm from "../components/seguimiento-form.vue";
import SeguimientoList from "../components/seguimiento-list.vue";
import Climas from "../components/climas.vue";
import Fotos from "../components/fotos.vue";

export default Vue.extend({
  name: "Home",
  data() {
    return {
      hardLimit: 200
    }
  },
  components: { SeguimientoForm, SeguimientoList, Climas, Fotos },
  methods: {
    login() {
      this.$apollo
        .mutate({
          // Query
          mutation: gql`
            mutation taka($user: String!, $pwd: String!) {
              login(input: { identifier: $user, password: $pwd }) {
                jwt
              }
            }
          `,
          // Parameters
          variables: {
            user: "graphql",
            pwd: "abbyl40L",
          },
        })
        .then((res: any) => {
          const jwt = res.data.login.jwt;
          this.$store.commit("setToken", jwt);
          localStorage.setItem("token", jwt);
        });
    },
  },
});
</script>
