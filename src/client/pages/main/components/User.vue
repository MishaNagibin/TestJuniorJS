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
      <v-btn @click="showCyclicConnection"> Показать циклическую связь </v-btn>
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
    showCyclicConnection() {},
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
  }
}
</style>
