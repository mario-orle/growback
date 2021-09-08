<template>
  <v-container>
    <v-timeline
      v-if="seguimientosConnection && seguimientosConnection.values"
      align-top
      dense
    >
      <template v-for="(seguimiento, idx) in seguimientosConnection.values">
        <v-timeline-item
          v-if="idx < seguimientosConnection.values.length - 1"
          small
          :key="seguimiento.id"
          :color="seguimiento.tipo === 'comentario' ? 'blue' : 'red'"
        >
          <v-row>
            <v-col cols="3">
              <strong class="created">{{
                format(seguimiento.created_at)
              }}</strong>
            </v-col>
            <v-col>
              {{ seguimiento.comentario }}
            </v-col>
          </v-row>
        </v-timeline-item>
        <v-timeline-item
          v-else
          small
          :key="seguimiento.id"
          :color="seguimiento.tipo === 'comentario' ? 'blue' : 'red'"
        >
          <v-row>
            <v-col cols="3">
              <strong class="created">{{
                format(seguimiento.created_at)
              }}</strong>
            </v-col>
            <v-col>
              {{ seguimiento.comentario }}
            </v-col>
          </v-row>
        </v-timeline-item>
      </template>
    </v-timeline>
  </v-container>
</template>

<script>
import gql from "graphql-tag";
import Vue from "vue";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";

export default {
  data: function () {
    return {
      tipoSelected: "comentario",
      comentario: "",
      limit: 10,
      start: 0,
    };
  },
  methods: {
    format(date) {
      return formatDistanceToNow(new Date(date), {
        addSuffix: true,
        locale: es,
      });
    },
    onIntersect(entries, observer) {
      if (
        entries[0].isIntersecting &&
        this.seguimientosConnection.aggregate.totalCount >
          this.start + this.limit
      ) {
        this.start += this.limit;
        this.$apollo.queries.seguimientosConnection.fetchMore({
          variables: {
            limit: this.limit,
            start: this.start,
          },
          updateQuery: (previousResult, { fetchMoreResult }) => {
            const newVals = fetchMoreResult.seguimientosConnection.values;
            return {
              seguimientosConnection: {
                __typename:
                  previousResult.seguimientosConnection.values.__typename,
                // Merging the tag list
                values: [
                  ...previousResult.seguimientosConnection.values,
                  ...newVals,
                ],
                aggregate: {
                  __typename:
                    fetchMoreResult.seguimientosConnection.aggregate.__typename,
                  totalCount:
                    fetchMoreResult.seguimientosConnection.aggregate.totalCount,
                },
              },
            };
          },
        });
      }
    },
  },
  apollo: {
    seguimientosConnection: {
      query: gql`
        query seguimientosConnection($limit: Int!, $start: Int!) {
          seguimientosConnection(
            sort: "created_at:DESC"
            limit: $limit
            start: $start
          ) {
            values {
              id
              tipo
              comentario
              created_at
            }
            aggregate {
              totalCount
            }
          }
        }
      `,
      variables() {
        return {
          limit: this.limit,
          start: 0,
        };
      },
    },
  },
};
</script>

<style lang="scss" scoped>
.created {
  font-size: 10px;
}
</style>
