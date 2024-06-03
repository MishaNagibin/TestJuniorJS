<template>
  <v-app v-if="isHome" class="app-main">
    <h1>Список сотрудников</h1>
    <v-btn v-if="!isAdding" large color="primary" @click="isAdding = true">
      Добавить сотрудника
    </v-btn>
    <cForm v-else @cancel="isAdding = false" @submit="addUser" />
    <v-simple-table v-if="users.length > 0">
      <template v-slot:default>
        <thead>
          <tr>
            <th class="text-left">Фамилия</th>
            <th class="text-left">Имя</th>
            <th class="text-left">Отчество</th>
            <th class="text-left">Email</th>
            <th class="text-left">Кол-во друзей</th>
            <th class="text-left"></th>
            <th class="text-left"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(u, i) of users" :key="i" @click="openUser(u.id)">
            <template v-if="!u.isEditable">
              <td>{{ u.sname }}</td>
              <td>{{ u.name }}</td>
              <td>{{ u.pname }}</td>
              <td>{{ u.email }}</td>
              <td>{{ (u.friends || []).length }}</td>
              <td>
                <v-icon color="blue" @click.stop="setUserEdit(u, i)">
                  mdi-pencil
                </v-icon>
              </td>
              <td>
                <v-icon color="red" @click.stop="openRemoveOverlay(i)">
                  mdi-delete
                </v-icon>
              </td>
            </template>
            <template v-else>
              <td>
                <v-text-field v-model="u.sname" required label="Фамилия" />
              </td>
              <td>
                <v-text-field v-model="u.name" required label="Имя" />
              </td>
              <td>
                <v-text-field v-model="u.pname" required label="Отчество" />
              </td>
              <td>
                <v-text-field v-model="u.email" required label="E-mail" />
              </td>
              <td></td>
              <td>
                <v-icon color="green" @click.stop="edit(u, i)">
                  mdi-check
                </v-icon>
              </td>
              <td>
                <v-icon color="red" @click.stop="unsetUserEdit(i)">
                  mdi-close
                </v-icon>
              </td>
            </template>
          </tr>
        </tbody>
      </template>
    </v-simple-table>
    <v-overlay :z-index="1" :value="removedUserIndex !== null">
      <div>
        <h2>Удалить сотрудника?</h2>
        <span>{{ removedUserName }}</span>
        <div>
          <v-btn color="red" @click="remove"> Да! </v-btn>
          <v-btn @click="removedUserIndex = null"> Нет! </v-btn>
        </div>
      </div>
    </v-overlay>
  </v-app>
  <router-view v-else></router-view>
</template>

<script>
import cForm from "./components/Form.vue";

export default {
  name: "Main",
  components: { cForm },
  data() {
    return {
      isAdding: false,
      users: [],
      removedUserIndex: null,
    };
  },
  computed: {
    storeUsers() {
      return this.$store.state.users;
    },
    removedUserName() {
      const item = this.users[this.removedUserIndex];
      return `${item?.sname ?? ""} ${item?.name ?? ""}`.trim();
    },
    isHome() {
      return this.$route.name === "Main";
    },
  },
  mounted() {
    this.$store.dispatch("init");
    this.setUsers();
  },
  watch: {
    isAdding(n) {
      if (n) {
        this.setUsers();
      }
    },
  },
  methods: {
    setUsers() {
      this.users = JSON.parse(JSON.stringify(this.storeUsers));
    },
    setUserEdit(item, index) {
      this.users.splice(index, 1, { ...item, isEditable: true });
    },
    unsetUserEdit(index) {
      this.users.splice(index, 1, this.storeUsers[index]);
    },
    addUser(item) {
      this.$store.dispatch("add", item).then((s) => {
        this.users = s;
      });
    },
    openUser(id) {
      this.$router.push({ name: "user", params: { userId: id } });
    },
    remove() {
      this.$store.dispatch("del", this.removedUserIndex).then(() => {
        this.setUsers();
        this.removedUserIndex = null;
      });
    },
    edit(item, index) {
      this.$store.dispatch("upd", { ...item, index }).then((s) => {
        this.users.splice(index, 1, { ...s, isEditable: false });
      });
    },
    openRemoveOverlay(index) {
      this.setUsers();
      this.removedUserIndex = index;
    },
  },
};
</script>

<style>
.app-main {
  & > div {
    min-height: auto;
    padding: 0 10px;

    & > form {
      margin-bottom: 60px;
    }

    & > .v-overlay {
      & > div {
        & > div {
          display: flex;
          flex-direction: column;
          padding: 30px;
          box-sizing: border-box;
          gap: 15px;
          background-color: white;
          border-radius: 5px;
          color: black;

          & > div {
            gap: 20px;
            display: flex;
            justify-content: flex-end;
          }
        }
      }
    }
  }
}
</style>
