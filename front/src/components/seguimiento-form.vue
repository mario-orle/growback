<template>
  <v-container>
      <v-row>
        <v-col>
          <v-textarea
            label="Comentario"
            v-model="comentario"
          ></v-textarea>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-radio-group v-model="tipoSelected" label="Tipo">
            <v-radio
              v-for="tipo, idx in tipoSeguimiento"
              :key="idx"
              :value="tipo.name"
              :label="tipo.name"
            ></v-radio>
          </v-radio-group>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-btn
            @click="save"
          >
            submit
          </v-btn>
          <v-btn @click="clear">
            clear
          </v-btn>
        </v-col>
      </v-row>
  </v-container>
</template>

<script>
import gql from "graphql-tag";
import Vue from "vue";

export default ({
  data: function () {
    return { tipoSelected: 'comentario', comentario: '' };
  },
  methods: {
    clear () {
      this.tipoSelected = 'comentario';
      this.comentario = '';
    },
    save() {
      this.$apollo.mutate({
        // Query
        mutation: gql`mutation save($tipoSelected: ENUM_SEGUIMIENTO_TIPO!, $comentario: String!) {
            createSeguimiento (input: { data: { tipo: $tipoSelected, comentario: $comentario }}) {
              seguimiento {
                id
              }
            }
          }
        `,
        // Parameters
        variables: {
          tipoSelected: this.tipoSelected,
          comentario: this.comentario
        },

      }).then();    
    }
  },
  apollo: {
    tipoSeguimiento: {
      query: gql`query tipoSeguimiento {
        __type(name: "ENUM_SEGUIMIENTO_TIPO") {
          name
          enumValues {
            name
          }
        }
      }`,
      update(data) {
        return data.__type.enumValues;
      }
    } 
  }
});
</script>

<style>

</style>