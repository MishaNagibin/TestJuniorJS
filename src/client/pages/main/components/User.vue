<template>
  <v-app v-if="hasUser" class="app-user">
    <router-link to="/">Назад</router-link>
    <h1>Страница сотрудника #{{ userId }}</h1>
    <cForm :user="user" :is-edit="true" />
    <h2>Список друзей</h2>
    <v-row dense>
      <v-select
        v-model="selectFriendID"
        :items="notFriends"
        label="Добавить друга"
        dense
        outlined
      />
      <v-btn :disabled="selectFriendID === null" @click="addFriend">
        Добавить
      </v-btn>
    </v-row>
    <template v-if="friends.length > 0">
      <v-simple-table>
        <template v-slot:default>
          <thead>
            <tr>
              <th class="text-left">Фамилия</th>
              <th class="text-left">Имя</th>
              <th class="text-left"></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(f, i) of friends" :key="i">
              <td>{{ f.sname }}</td>
              <td>{{ f.name }}</td>
              <td>
                <v-icon color="red" @click.stop="remove(f.id)">
                  mdi-delete
                </v-icon>
              </td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>
      <v-btn
        @click="showHideCyclicConnection"
        :color="!isShowCyclicConnection ? 'green' : 'blue'"
      >
        {{ !isShowCyclicConnection ? "Показать" : "Скрыть" }}
        циклическую связь
      </v-btn>
      <v-alert
        v-if="isShowCyclicConnection"
        border="top"
        colored-border
        type="info"
        elevation="2"
      >
        {{ resultCyclicConnection || "Связь не найдена" }}
      </v-alert>
    </template>
  </v-app>
  <div v-else>
    <router-link to="/">Назад</router-link>
    <h1>Сотрудник не найден</h1>
  </div>
</template>

<script>
import cForm from "./Form.vue";

export default {
  name: "User",
  components: { cForm },
  data() {
    return {
      selectFriendID: null,
      resultCyclicConnection: null,
      isShowCyclicConnection: false,
    };
  },
  computed: {
    userId() {
      return +this.$route.params.userId;
    },
    user() {
      return this.$store.state.users.find((u) => u.id === this.userId);
    },
    hasUser() {
      return this.user !== undefined;
    },
    users() {
      return this.$store.state.users;
    },
    friends() {
      return this.users.filter(
        (u) => (this.user?.friends ?? []).includes(u.id) && u.id !== this.userId
      );
    },
    notFriends() {
      return this.users.reduce((acc, cur) => {
        if (
          !(this.user?.friends ?? []).includes(cur.id) &&
          cur.id !== this.userId
        ) {
          acc.push({
            text: `${cur.sname ?? ""} ${cur.name ?? ""}`.trim(),
            value: cur.id,
          });
        }
        return acc;
      }, []);
    },
  },
  methods: {
    addFriend() {
      this.$store
        .dispatch("addFriend", [this.user.id, this.selectFriendID])
        .then(() => {
          this.selectFriendID = null;
        });
    },
    remove(id) {
      this.$store.dispatch("removeFriend", [this.user.id, id]);
    },
    showHideCyclicConnection() {
      this.isShowCyclicConnection = !this.isShowCyclicConnection;

      this.resultCyclicConnection = this.isShowCyclicConnection
        ? (this.resultCyclicConnection = this.getCycle(
            this.userId,
            this.userId
          ))
        : null;
    },
    getCycle(id, start, visited = new Set(), res = "") {
      const users = this.$store.state.users;
      const user = users.find((u) => u.id === id);
      const name = user.name;
      const result = `${res}${name} добавил `;
      visited.add(id);
      const friends = (user?.friends ?? []).filter((v) => v !== id).reverse();
      if (friends.length > 0) {
        for (const f of friends) {
          if (f === start) {
            return `${result}${users.find((u) => u.id === f).name}`;
          } else if (!visited.has(f)) {
            const cycle = this.getCycle(
              f,
              start,
              visited,
              `${result}${users.find((u) => u.id === f).name}, `
            );
            if (cycle) {
              return cycle;
            }
          }
        }
      }
      return null;
    },
  },
};
</script>

<style>
.app-user {
  padding: 0 10px;

  & > div {
    & > h2 {
      margin-top: 40px;
      margin-bottom: 10px;
    }

    & > .row {
      width: fit-content;
      gap: 20px;
      flex: unset;
    }

    & > button {
      margin: 20px 0;
    }
  }
}
</style>
