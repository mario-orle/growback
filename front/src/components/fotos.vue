<template>
  <v-container>
    <v-carousel cycle interval="500">
      <v-carousel-item
        v-for="(foto) in fotosConnection.values"
        :key="foto.id"
      >
        <img :src="'http://cacho:1337' + foto.foto.url" :key="foto.id" />
      </v-carousel-item>
    </v-carousel>
  </v-container>
</template>

<script>
import gql from "graphql-tag";
import Vue from "vue";
import {formatDistanceToNow} from 'date-fns';
import { es } from 'date-fns/locale'

export default ({
  data: function () {
    return { 
      limit: 10,
      start: 0
    };
  },
  methods: {
    format(date) {
      return formatDistanceToNow(new Date(date), {addSuffix: true, locale: es});
    },
    onIntersect(entries, observer) {
      if (
        entries[0].isIntersecting && this.seguimientosConnection.aggregate.totalCount > this.start + this.limit) {
        this.start += this.limit;
        this.$apollo.queries.seguimientosConnection.fetchMore({
          variables: {
            limit: this.limit, 
            start: this.start
          },
          updateQuery: (previousResult, { fetchMoreResult }) => {
            const newVals = fetchMoreResult.seguimientosConnection.values
            return {
              seguimientosConnection: {
                __typename: previousResult.seguimientosConnection.values.__typename,
                // Merging the tag list
                values: [...previousResult.seguimientosConnection.values, ...newVals],
                aggregate: {
                  __typename: fetchMoreResult.seguimientosConnection.aggregate.__typename,
                  totalCount: fetchMoreResult.seguimientosConnection.aggregate.totalCount
                }
              }

            }
          },
        });
      }
    }
  },
  apollo: {
    fotosConnection: {
      query: gql`query fotosConnection($limit: Int!, $start: Int!) {
        fotosConnection(sort: "created_at:DESC", limit: $limit, start: $start) {
          values {
            id
            foto {
              url
              width
              height
            }
            created_at
          }
          aggregate {
            totalCount
          }
        }
      }`,
      variables() { 
        return {
          limit: this.limit, 
          start: 0
        }
      }
    } 
  }
});
</script>

<style lang="scss" scoped>
  .created {
    font-size: 10px;
  }
</style>