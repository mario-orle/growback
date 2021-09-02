<template>
  <v-container>
    asd
    <v-timeline align-top dense> 
      <v-timeline-item
        small
        v-for="seguimiento, idx in seguimientos"
        :key="idx"
        :color="seguimiento.tipo === 'comentario' ? 'blue': 'red'"
      >
        <v-row>
          <v-col cols="3">
            <strong class="created">{{format(seguimiento.created_at)}}</strong>
          </v-col>
          <v-col>
            {{seguimiento.comentario}}
          </v-col>
        </v-row>
      
      </v-timeline-item>
    </v-timeline>
  </v-container>
</template>

<script lang="ts">
import gql from "graphql-tag";
import Vue from "vue";
import {formatDistanceToNow} from 'date-fns';
import { es } from 'date-fns/locale'

export default Vue.extend({
  data: function () {
    return { tipoSelected: 'comentario', comentario: '' };
  },
  methods: {
    format(date: string) {
      return formatDistanceToNow(new Date(date), {addSuffix: true, locale: es});
    }
  },
  apollo: {
    seguimientos: {
      query: gql`query seguimientos {
        seguimientos(sort: "created_at") {
          tipo
          comentario
          created_at
        }
      }`,
    } 
  }
});
</script>

<style lang="scss" scoped>
  .created {
    font-size: 10px;
  }
</style>