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
    showCyclicConnection() {
      // не получилось чето
      // хотел сделать так, чтобы он проходился по friends и делал эту связь
      // типа у Васи друг Петя, у Пети друг Вася и Дима, но Васю откинем,
      // а у Димы друг Вася (первоначальный)
      const users = [
        {
          id: 1,
          name: "Вася",
          friends: [2],
        },
        {
          id: 2,
          name: "Петя",
          friends: [1, 3],
        },
        {
          id: 3,
          name: "Дима",
          friends: [1, 2],
        },
      ];
      function getCycle(id, startID, res) {
        const user = users.find((u) => u.id === id);
        const name = user.name;
        const result = `${name} добавил ${res ?? ""}`;
        const filtered = user.friends.filter((v) => v !== id);
        if (filtered.length > 0) {
          for (const f of filtered) {
            if (![id, startID].includes(f)) {
              getCycle(f, startID, result + users.find((u) => u.id === f).name);
            } else {
              return result + users.find((u) => u.id === f).name;
            }
          }
        } else {
          return result;
        }
      }
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
  }
}
</style>
